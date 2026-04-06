import { eq, desc, and, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  cotacoes, 
  InsertCotacao, 
  Cotacao,
  formAnalytics,
  InsertFormAnalytic,
  documentos,
  InsertDocumento,
  cotacaoHistorico,
  InsertCotacaoHistorico,
  corretores, 
  InsertCorretor, 
  Corretor,
  sinistros,
  InsertSinistro,
  Sinistro,
  sinistroHistorico,
  InsertSinistroHistorico
} from "../drizzle/schema";
import { ENV } from './_core/env';
import { nanoid } from 'nanoid';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ==================== COTAÇÕES ====================

/**
 * Gera um protocolo único para cotação
 * Formato: COT-XXXXXX-YYYY (ex: COT-RCO-A1B2C3)
 */
export function gerarProtocolo(produto: string): string {
  const prefixo = produto.toUpperCase().substring(0, 3);
  const codigo = nanoid(8).toUpperCase();
  return `COT-${prefixo}-${codigo}`;
}

/**
 * Cria uma nova cotação (rascunho)
 */
export async function criarCotacao(data: Omit<InsertCotacao, 'protocolo'>): Promise<Cotacao | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create cotacao: database not available");
    return null;
  }

  const protocolo = gerarProtocolo(data.produto);
  
  try {
    const result = await db.insert(cotacoes).values({
      ...data,
      protocolo,
      status: 'rascunho',
    });
    
    // Buscar a cotação criada
    const [cotacao] = await db.select().from(cotacoes).where(eq(cotacoes.protocolo, protocolo)).limit(1);
    
    // Registrar no histórico
    if (cotacao) {
      await registrarHistoricoCotacao({
        cotacaoId: cotacao.id,
        statusNovo: 'rascunho',
        sistema: true,
        observacao: 'Cotação iniciada pelo cliente',
      });
    }
    
    return cotacao || null;
  } catch (error) {
    console.error("[Database] Failed to create cotacao:", error);
    throw error;
  }
}

/**
 * Atualiza uma cotação existente
 */
export async function atualizarCotacao(
  id: number, 
  data: Partial<InsertCotacao>
): Promise<Cotacao | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update cotacao: database not available");
    return null;
  }

  try {
    await db.update(cotacoes).set(data).where(eq(cotacoes.id, id));
    
    const [cotacao] = await db.select().from(cotacoes).where(eq(cotacoes.id, id)).limit(1);
    return cotacao || null;
  } catch (error) {
    console.error("[Database] Failed to update cotacao:", error);
    throw error;
  }
}

/**
 * Submete uma cotação (muda status para 'enviado')
 */
export async function submeterCotacao(id: number): Promise<Cotacao | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot submit cotacao: database not available");
    return null;
  }

  try {
    // Buscar cotação atual
    const [cotacaoAtual] = await db.select().from(cotacoes).where(eq(cotacoes.id, id)).limit(1);
    
    if (!cotacaoAtual) {
      throw new Error("Cotação não encontrada");
    }
    
    await db.update(cotacoes).set({
      status: 'enviado',
      submittedAt: new Date(),
    }).where(eq(cotacoes.id, id));
    
    // Registrar no histórico
    await registrarHistoricoCotacao({
      cotacaoId: id,
      statusAnterior: cotacaoAtual.status,
      statusNovo: 'enviado',
      sistema: true,
      observacao: 'Cotação enviada para análise',
    });
    
    const [cotacao] = await db.select().from(cotacoes).where(eq(cotacoes.id, id)).limit(1);
    return cotacao || null;
  } catch (error) {
    console.error("[Database] Failed to submit cotacao:", error);
    throw error;
  }
}

/**
 * Busca cotação por protocolo
 */
export async function buscarCotacaoPorProtocolo(protocolo: string): Promise<Cotacao | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get cotacao: database not available");
    return null;
  }

  try {
    const [cotacao] = await db.select().from(cotacoes).where(eq(cotacoes.protocolo, protocolo)).limit(1);
    return cotacao || null;
  } catch (error) {
    console.error("[Database] Failed to get cotacao:", error);
    throw error;
  }
}

/**
 * Busca cotação por ID
 */
export async function buscarCotacaoPorId(id: number): Promise<Cotacao | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get cotacao: database not available");
    return null;
  }

  try {
    const [cotacao] = await db.select().from(cotacoes).where(eq(cotacoes.id, id)).limit(1);
    return cotacao || null;
  } catch (error) {
    console.error("[Database] Failed to get cotacao:", error);
    throw error;
  }
}

/**
 * Lista cotações com filtros
 */
export async function listarCotacoes(filtros?: {
  status?: string;
  produto?: string;
  marca?: string;
  limite?: number;
  offset?: number;
}): Promise<Cotacao[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot list cotacoes: database not available");
    return [];
  }

  try {
    let query = db.select().from(cotacoes);
    
    const conditions = [];
    
    if (filtros?.status) {
      conditions.push(eq(cotacoes.status, filtros.status as any));
    }
    if (filtros?.produto) {
      conditions.push(eq(cotacoes.produto, filtros.produto as any));
    }
    if (filtros?.marca) {
      conditions.push(eq(cotacoes.marca, filtros.marca as any));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }
    
    query = query.orderBy(desc(cotacoes.createdAt)) as any;
    
    if (filtros?.limite) {
      query = query.limit(filtros.limite) as any;
    }
    if (filtros?.offset) {
      query = query.offset(filtros.offset) as any;
    }
    
    return await query;
  } catch (error) {
    console.error("[Database] Failed to list cotacoes:", error);
    throw error;
  }
}

// ==================== ANALYTICS ====================

/**
 * Registra um evento de analytics
 */
export async function registrarAnalytics(data: InsertFormAnalytic): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot register analytics: database not available");
    return;
  }

  try {
    await db.insert(formAnalytics).values(data);
  } catch (error) {
    console.error("[Database] Failed to register analytics:", error);
    // Não lançar erro para não interromper o fluxo do usuário
  }
}

/**
 * Busca métricas agregadas de analytics
 */
export async function buscarMetricasAnalytics(filtros?: {
  produto?: string;
  dataInicio?: Date;
  dataFim?: Date;
}): Promise<{
  totalVisitas: number;
  totalInicios: number;
  totalEnvios: number;
  taxaConversao: number;
  tempoMedioFormulario: number;
}> {
  const db = await getDb();
  if (!db) {
    return {
      totalVisitas: 0,
      totalInicios: 0,
      totalEnvios: 0,
      taxaConversao: 0,
      tempoMedioFormulario: 0,
    };
  }

  try {
    // Contar eventos por tipo
    const [visitas] = await db.select({ count: sql<number>`count(*)` })
      .from(formAnalytics)
      .where(eq(formAnalytics.eventType, 'page_view'));
    
    const [inicios] = await db.select({ count: sql<number>`count(*)` })
      .from(formAnalytics)
      .where(eq(formAnalytics.eventType, 'form_start'));
    
    const [envios] = await db.select({ count: sql<number>`count(*)` })
      .from(formAnalytics)
      .where(eq(formAnalytics.eventType, 'form_submit'));
    
    const [tempoMedio] = await db.select({ avg: sql<number>`AVG(totalTimeOnForm)` })
      .from(formAnalytics)
      .where(eq(formAnalytics.eventType, 'form_submit'));
    
    const totalVisitas = Number(visitas?.count) || 0;
    const totalInicios = Number(inicios?.count) || 0;
    const totalEnvios = Number(envios?.count) || 0;
    
    return {
      totalVisitas,
      totalInicios,
      totalEnvios,
      taxaConversao: totalInicios > 0 ? (totalEnvios / totalInicios) * 100 : 0,
      tempoMedioFormulario: Number(tempoMedio?.avg) || 0,
    };
  } catch (error) {
    console.error("[Database] Failed to get analytics metrics:", error);
    return {
      totalVisitas: 0,
      totalInicios: 0,
      totalEnvios: 0,
      taxaConversao: 0,
      tempoMedioFormulario: 0,
    };
  }
}

// ==================== DOCUMENTOS ====================

/**
 * Salva metadados de um documento
 */
export async function salvarDocumento(data: InsertDocumento): Promise<number | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot save documento: database not available");
    return null;
  }

  try {
    const result = await db.insert(documentos).values(data);
    return result[0].insertId;
  } catch (error) {
    console.error("[Database] Failed to save documento:", error);
    throw error;
  }
}

/**
 * Atualiza dados extraídos de um documento
 */
export async function atualizarDadosExtraidos(
  id: number, 
  dadosExtraidos: Record<string, any>,
  confianca: number
): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update documento: database not available");
    return;
  }

  try {
    await db.update(documentos).set({
      dadosExtraidos,
      extraidoEm: new Date(),
      confiancaExtracao: confianca,
      processado: true,
    }).where(eq(documentos.id, id));
  } catch (error) {
    console.error("[Database] Failed to update documento:", error);
    throw error;
  }
}

/**
 * Lista documentos de uma cotação
 */
export async function listarDocumentosCotacao(cotacaoId: number) {
  const db = await getDb();
  if (!db) {
    return [];
  }

  try {
    return await db.select().from(documentos).where(eq(documentos.cotacaoId, cotacaoId));
  } catch (error) {
    console.error("[Database] Failed to list documentos:", error);
    return [];
  }
}

// ==================== HISTÓRICO ====================

/**
 * Registra uma mudança de status no histórico
 */
export async function registrarHistoricoCotacao(data: InsertCotacaoHistorico): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot register historico: database not available");
    return;
  }

  try {
    await db.insert(cotacaoHistorico).values(data);
  } catch (error) {
    console.error("[Database] Failed to register historico:", error);
    // Não lançar erro para não interromper o fluxo
  }
}

/**
 * Busca histórico de uma cotação
 */
export async function buscarHistoricoCotacao(cotacaoId: number) {
  const db = await getDb();
  if (!db) {
    return [];
  }

  try {
    return await db.select()
      .from(cotacaoHistorico)
      .where(eq(cotacaoHistorico.cotacaoId, cotacaoId))
      .orderBy(desc(cotacaoHistorico.createdAt));
  } catch (error) {
    console.error("[Database] Failed to get historico:", error);
    return [];
  }
}


// ==================== CORRETORES ====================

/**
 * Gera um protocolo único para corretor
 * Formato: COR-XXXXXXXX (ex: COR-A1B2C3D4)
 */
export function gerarProtocoloCorretor(): string {
  const codigo = nanoid(8).toUpperCase();
  return `COR-${codigo}`;
}

/**
 * Cria um novo cadastro de corretor
 */
export async function criarCorretor(data: Omit<InsertCorretor, 'protocolo'>): Promise<Corretor | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create corretor: database not available");
    return null;
  }

  const protocolo = gerarProtocoloCorretor();
  
  try {
    await db.insert(corretores).values({
      ...data,
      protocolo,
      status: 'pendente',
    });
    
    const [corretor] = await db.select().from(corretores).where(eq(corretores.protocolo, protocolo)).limit(1);
    return corretor || null;
  } catch (error) {
    console.error("[Database] Failed to create corretor:", error);
    throw error;
  }
}

/**
 * Busca corretor por CNPJ
 */
export async function buscarCorretorPorCnpj(cnpj: string): Promise<Corretor | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get corretor: database not available");
    return null;
  }

  try {
    const [corretor] = await db.select().from(corretores).where(eq(corretores.cnpj, cnpj)).limit(1);
    return corretor || null;
  } catch (error) {
    console.error("[Database] Failed to get corretor:", error);
    throw error;
  }
}

/**
 * Busca corretor por protocolo
 */
export async function buscarCorretorPorProtocolo(protocolo: string): Promise<Corretor | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get corretor: database not available");
    return null;
  }

  try {
    const [corretor] = await db.select().from(corretores).where(eq(corretores.protocolo, protocolo)).limit(1);
    return corretor || null;
  } catch (error) {
    console.error("[Database] Failed to get corretor:", error);
    throw error;
  }
}

/**
 * Atualiza um corretor existente
 */
export async function atualizarCorretor(
  id: number, 
  data: Partial<InsertCorretor>
): Promise<Corretor | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update corretor: database not available");
    return null;
  }

  try {
    await db.update(corretores).set(data).where(eq(corretores.id, id));
    
    const [corretor] = await db.select().from(corretores).where(eq(corretores.id, id)).limit(1);
    return corretor || null;
  } catch (error) {
    console.error("[Database] Failed to update corretor:", error);
    throw error;
  }
}

/**
 * Lista corretores com filtros
 */
export async function listarCorretores(filtros?: {
  status?: string;
  limite?: number;
  offset?: number;
}): Promise<Corretor[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot list corretores: database not available");
    return [];
  }

  try {
    let query = db.select().from(corretores);
    
    if (filtros?.status) {
      query = query.where(eq(corretores.status, filtros.status as any)) as any;
    }
    
    query = query.orderBy(desc(corretores.createdAt)) as any;
    
    if (filtros?.limite) {
      query = query.limit(filtros.limite) as any;
    }
    if (filtros?.offset) {
      query = query.offset(filtros.offset) as any;
    }
    
    return await query;
  } catch (error) {
    console.error("[Database] Failed to list corretores:", error);
    throw error;
  }
}

// ==================== SINISTROS ====================

/**
 * Gera um protocolo único para sinistro
 * Formato: SIN-XXX-XXXXXXXX (ex: SIN-RCO-A1B2C3D4)
 */
export function gerarProtocoloSinistro(produto: string): string {
  const prefixo = produto.toUpperCase().substring(0, 3);
  const codigo = nanoid(8).toUpperCase();
  return `SIN-${prefixo}-${codigo}`;
}

/**
 * Cria um novo sinistro
 */
export async function criarSinistro(data: Omit<InsertSinistro, 'protocolo'>): Promise<Sinistro | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create sinistro: database not available");
    return null;
  }

  const protocolo = gerarProtocoloSinistro(data.produto);
  
  try {
    await db.insert(sinistros).values({
      ...data,
      protocolo,
      status: 'aberto',
    });
    
    const [sinistro] = await db.select().from(sinistros).where(eq(sinistros.protocolo, protocolo)).limit(1);
    
    // Registrar no histórico
    if (sinistro) {
      await registrarHistoricoSinistro({
        sinistroId: sinistro.id,
        statusNovo: 'aberto',
        sistema: true,
        observacao: 'Sinistro aberto pelo segurado',
      });
    }
    
    return sinistro || null;
  } catch (error) {
    console.error("[Database] Failed to create sinistro:", error);
    throw error;
  }
}

/**
 * Busca sinistro por protocolo
 */
export async function buscarSinistroPorProtocolo(protocolo: string): Promise<Sinistro | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get sinistro: database not available");
    return null;
  }

  try {
    const [sinistro] = await db.select().from(sinistros).where(eq(sinistros.protocolo, protocolo)).limit(1);
    return sinistro || null;
  } catch (error) {
    console.error("[Database] Failed to get sinistro:", error);
    throw error;
  }
}

/**
 * Busca sinistro por ID
 */
export async function buscarSinistroPorId(id: number): Promise<Sinistro | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get sinistro: database not available");
    return null;
  }

  try {
    const [sinistro] = await db.select().from(sinistros).where(eq(sinistros.id, id)).limit(1);
    return sinistro || null;
  } catch (error) {
    console.error("[Database] Failed to get sinistro:", error);
    throw error;
  }
}

/**
 * Atualiza um sinistro existente
 */
export async function atualizarSinistro(
  id: number, 
  data: Partial<InsertSinistro>
): Promise<Sinistro | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update sinistro: database not available");
    return null;
  }

  try {
    await db.update(sinistros).set(data).where(eq(sinistros.id, id));
    
    const [sinistro] = await db.select().from(sinistros).where(eq(sinistros.id, id)).limit(1);
    return sinistro || null;
  } catch (error) {
    console.error("[Database] Failed to update sinistro:", error);
    throw error;
  }
}

/**
 * Lista sinistros com filtros
 */
export async function listarSinistros(filtros?: {
  status?: string;
  produto?: string;
  marca?: string;
  cpfCnpj?: string;
  limite?: number;
  offset?: number;
}): Promise<Sinistro[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot list sinistros: database not available");
    return [];
  }

  try {
    let query = db.select().from(sinistros);
    
    const conditions = [];
    
    if (filtros?.status) {
      conditions.push(eq(sinistros.status, filtros.status as any));
    }
    if (filtros?.produto) {
      conditions.push(eq(sinistros.produto, filtros.produto as any));
    }
    if (filtros?.marca) {
      conditions.push(eq(sinistros.marca, filtros.marca as any));
    }
    if (filtros?.cpfCnpj) {
      conditions.push(eq(sinistros.cpfCnpj, filtros.cpfCnpj));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }
    
    query = query.orderBy(desc(sinistros.createdAt)) as any;
    
    if (filtros?.limite) {
      query = query.limit(filtros.limite) as any;
    }
    if (filtros?.offset) {
      query = query.offset(filtros.offset) as any;
    }
    
    return await query;
  } catch (error) {
    console.error("[Database] Failed to list sinistros:", error);
    throw error;
  }
}

/**
 * Registra uma mudança de status no histórico de sinistro
 */
export async function registrarHistoricoSinistro(data: InsertSinistroHistorico): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot register historico sinistro: database not available");
    return;
  }

  try {
    await db.insert(sinistroHistorico).values(data);
  } catch (error) {
    console.error("[Database] Failed to register historico sinistro:", error);
  }
}

/**
 * Busca histórico de um sinistro
 */
export async function buscarHistoricoSinistro(sinistroId: number) {
  const db = await getDb();
  if (!db) {
    return [];
  }

  try {
    return await db.select()
      .from(sinistroHistorico)
      .where(eq(sinistroHistorico.sinistroId, sinistroId))
      .orderBy(desc(sinistroHistorico.createdAt));
  } catch (error) {
    console.error("[Database] Failed to get historico sinistro:", error);
    return [];
  }
}
