import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json, bigint, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Cotações de seguros - armazena todas as solicitações de cotação
 */
export const cotacoes = mysqlTable("cotacoes", {
  id: int("id").autoincrement().primaryKey(),
  
  // Protocolo único para rastreamento
  protocolo: varchar("protocolo", { length: 32 }).notNull().unique(),
  
  // Marca e produto
  marca: mysqlEnum("marca", ["livonius", "livo"]).notNull(),
  produto: mysqlEnum("produto", ["rco", "solar", "garantia", "agro", "engenharia"]).notNull(),
  
  // Status do fluxo
  status: mysqlEnum("status", ["rascunho", "enviado", "em_analise", "cotado", "aceito", "recusado", "expirado"]).default("rascunho").notNull(),
  
  // Dados do solicitante
  tipoPessoa: mysqlEnum("tipoPessoa", ["pf", "pj"]).notNull(),
  cpfCnpj: varchar("cpfCnpj", { length: 18 }).notNull(),
  nomeRazaoSocial: varchar("nomeRazaoSocial", { length: 255 }).notNull(),
  nomeFantasia: varchar("nomeFantasia", { length: 255 }),
  
  // Contato
  telefone: varchar("telefone", { length: 20 }).notNull(),
  whatsapp: varchar("whatsapp", { length: 20 }),
  email: varchar("email", { length: 320 }).notNull(),
  melhorHorario: varchar("melhorHorario", { length: 50 }),
  
  // Endereço
  cep: varchar("cep", { length: 10 }),
  logradouro: varchar("logradouro", { length: 255 }),
  numero: varchar("numero", { length: 20 }),
  complemento: varchar("complemento", { length: 100 }),
  bairro: varchar("bairro", { length: 100 }),
  cidade: varchar("cidade", { length: 100 }),
  estado: varchar("estado", { length: 2 }),
  
  // Dados específicos do produto (JSON flexível)
  dadosProduto: json("dadosProduto"),
  
  // Coberturas selecionadas
  coberturas: json("coberturas"),
  
  // Documentos anexados (URLs do S3)
  documentos: json("documentos"),
  
  // Dados extraídos por IA dos documentos
  dadosExtraidos: json("dadosExtraidos"),
  
  // Observações do cliente
  observacoes: text("observacoes"),
  
  // Origem e rastreamento
  origem: varchar("origem", { length: 50 }).default("site"),
  utmSource: varchar("utmSource", { length: 100 }),
  utmMedium: varchar("utmMedium", { length: 100 }),
  utmCampaign: varchar("utmCampaign", { length: 100 }),
  
  // Integração CRM/MCP
  crmId: varchar("crmId", { length: 100 }),
  crmSyncedAt: timestamp("crmSyncedAt"),
  mcpPayload: json("mcpPayload"),
  
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  submittedAt: timestamp("submittedAt"),
});

export type Cotacao = typeof cotacoes.$inferSelect;
export type InsertCotacao = typeof cotacoes.$inferInsert;

/**
 * Analytics de formulário - rastreia interações do usuário
 */
export const formAnalytics = mysqlTable("form_analytics", {
  id: int("id").autoincrement().primaryKey(),
  
  // Sessão do usuário (anônimo)
  sessionId: varchar("sessionId", { length: 64 }).notNull(),
  
  // Referência à cotação (se houver)
  cotacaoId: int("cotacaoId"),
  
  // Tipo de evento
  eventType: mysqlEnum("eventType", [
    "page_view",
    "form_start",
    "step_view",
    "step_complete",
    "field_focus",
    "field_blur",
    "field_change",
    "file_upload",
    "form_submit",
    "form_abandon",
    "error",
    "cta_click"
  ]).notNull(),
  
  // Dados do evento
  eventData: json("eventData"),
  
  // Contexto
  produto: mysqlEnum("produto", ["rco", "solar", "garantia", "agro", "engenharia"]),
  stepNumber: int("stepNumber"),
  fieldName: varchar("fieldName", { length: 100 }),
  
  // Métricas de tempo
  timeOnStep: int("timeOnStep"), // em segundos
  totalTimeOnForm: int("totalTimeOnForm"), // em segundos
  
  // Dispositivo e navegador
  userAgent: text("userAgent"),
  deviceType: varchar("deviceType", { length: 20 }),
  screenWidth: int("screenWidth"),
  screenHeight: int("screenHeight"),
  
  // Localização (aproximada)
  country: varchar("country", { length: 2 }),
  region: varchar("region", { length: 100 }),
  city: varchar("city", { length: 100 }),
  
  // Referrer
  referrer: text("referrer"),
  landingPage: text("landingPage"),
  
  // UTM params
  utmSource: varchar("utmSource", { length: 100 }),
  utmMedium: varchar("utmMedium", { length: 100 }),
  utmCampaign: varchar("utmCampaign", { length: 100 }),
  
  // Timestamp
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type FormAnalytic = typeof formAnalytics.$inferSelect;
export type InsertFormAnalytic = typeof formAnalytics.$inferInsert;

/**
 * Documentos enviados - metadados dos arquivos
 */
export const documentos = mysqlTable("documentos", {
  id: int("id").autoincrement().primaryKey(),
  
  // Referência à cotação
  cotacaoId: int("cotacaoId").notNull(),
  
  // Informações do arquivo
  nomeOriginal: varchar("nomeOriginal", { length: 255 }).notNull(),
  nomeArmazenado: varchar("nomeArmazenado", { length: 255 }).notNull(),
  mimeType: varchar("mimeType", { length: 100 }).notNull(),
  tamanho: bigint("tamanho", { mode: "number" }).notNull(), // em bytes
  
  // URL do S3
  url: text("url").notNull(),
  fileKey: varchar("fileKey", { length: 500 }).notNull(),
  
  // Tipo de documento
  tipoDocumento: varchar("tipoDocumento", { length: 100 }),
  
  // Extração de dados por IA
  dadosExtraidos: json("dadosExtraidos"),
  extraidoEm: timestamp("extraidoEm"),
  confiancaExtracao: int("confiancaExtracao"), // 0-100
  
  // Status
  processado: boolean("processado").default(false),
  
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Documento = typeof documentos.$inferSelect;
export type InsertDocumento = typeof documentos.$inferInsert;

/**
 * Histórico de status das cotações
 */
export const cotacaoHistorico = mysqlTable("cotacao_historico", {
  id: int("id").autoincrement().primaryKey(),
  
  cotacaoId: int("cotacaoId").notNull(),
  
  statusAnterior: varchar("statusAnterior", { length: 50 }),
  statusNovo: varchar("statusNovo", { length: 50 }).notNull(),
  
  observacao: text("observacao"),
  
  // Quem fez a alteração
  usuarioId: int("usuarioId"),
  sistema: boolean("sistema").default(false),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CotacaoHistorico = typeof cotacaoHistorico.$inferSelect;
export type InsertCotacaoHistorico = typeof cotacaoHistorico.$inferInsert;


/**
 * Corretores/Parceiros - cadastro de corretores parceiros
 */
export const corretores = mysqlTable("corretores", {
  id: int("id").autoincrement().primaryKey(),
  
  // Protocolo único para rastreamento
  protocolo: varchar("protocolo", { length: 32 }).notNull().unique(),
  
  // Status do cadastro
  status: mysqlEnum("status", ["pendente", "em_analise", "aprovado", "recusado", "suspenso"]).default("pendente").notNull(),
  
  // Dados da empresa
  cnpj: varchar("cnpj", { length: 18 }).notNull().unique(),
  razaoSocial: varchar("razaoSocial", { length: 255 }).notNull(),
  nomeFantasia: varchar("nomeFantasia", { length: 255 }),
  inscricaoEstadual: varchar("inscricaoEstadual", { length: 30 }),
  
  // Endereço
  cep: varchar("cep", { length: 10 }),
  logradouro: varchar("logradouro", { length: 255 }),
  numero: varchar("numero", { length: 20 }),
  complemento: varchar("complemento", { length: 100 }),
  bairro: varchar("bairro", { length: 100 }),
  cidade: varchar("cidade", { length: 100 }),
  estado: varchar("estado", { length: 2 }),
  
  // Contato da empresa
  telefoneEmpresa: varchar("telefoneEmpresa", { length: 20 }),
  emailEmpresa: varchar("emailEmpresa", { length: 320 }).notNull(),
  website: varchar("website", { length: 255 }),
  
  // Responsável pelo cadastro
  nomeResponsavel: varchar("nomeResponsavel", { length: 255 }).notNull(),
  cpfResponsavel: varchar("cpfResponsavel", { length: 14 }),
  cargoResponsavel: varchar("cargoResponsavel", { length: 100 }),
  telefoneResponsavel: varchar("telefoneResponsavel", { length: 20 }).notNull(),
  emailResponsavel: varchar("emailResponsavel", { length: 320 }).notNull(),
  
  // Dados bancários PJ
  bancoNome: varchar("bancoNome", { length: 100 }),
  bancoCodigo: varchar("bancoCodigo", { length: 10 }),
  agencia: varchar("agencia", { length: 20 }),
  conta: varchar("conta", { length: 30 }),
  tipoConta: mysqlEnum("tipoConta", ["corrente", "poupanca"]),
  pixChave: varchar("pixChave", { length: 255 }),
  
  // Documentos (URLs do S3)
  docContratoSocial: text("docContratoSocial"),
  docComprovanteBancarioPJ: text("docComprovanteBancarioPJ"),
  docComprovantesBancariosSocios: json("docComprovantesBancariosSocios"), // Array de URLs
  docOutros: json("docOutros"), // Array de URLs
  
  // Registro SUSEP (se aplicável)
  susepNumero: varchar("susepNumero", { length: 50 }),
  susepValidade: timestamp("susepValidade"),
  
  // Observações
  observacoes: text("observacoes"),
  motivoRecusa: text("motivoRecusa"),
  
  // Integração CRM/MCP
  crmId: varchar("crmId", { length: 100 }),
  crmSyncedAt: timestamp("crmSyncedAt"),
  
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  aprovadoEm: timestamp("aprovadoEm"),
  aprovadoPor: int("aprovadoPor"),
});

export type Corretor = typeof corretores.$inferSelect;
export type InsertCorretor = typeof corretores.$inferInsert;

/**
 * Sinistros - abertura e acompanhamento de sinistros
 */
export const sinistros = mysqlTable("sinistros", {
  id: int("id").autoincrement().primaryKey(),
  
  // Protocolo único para rastreamento
  protocolo: varchar("protocolo", { length: 32 }).notNull().unique(),
  
  // Marca e produto
  marca: mysqlEnum("marca", ["livonius", "livo"]).notNull(),
  produto: mysqlEnum("produto", ["rco", "solar", "garantia", "agro", "engenharia"]).notNull(),
  
  // Tipo de sinistro específico por produto
  tipoSinistro: varchar("tipoSinistro", { length: 100 }).notNull(),
  
  // Status do sinistro
  status: mysqlEnum("status", [
    "aberto",
    "documentacao_pendente",
    "em_analise",
    "vistoria_agendada",
    "aguardando_laudo",
    "em_regulacao",
    "aprovado",
    "parcialmente_aprovado",
    "negado",
    "pago",
    "encerrado"
  ]).default("aberto").notNull(),
  
  // Dados do segurado
  tipoPessoa: mysqlEnum("tipoPessoa", ["pf", "pj"]).notNull(),
  cpfCnpj: varchar("cpfCnpj", { length: 18 }).notNull(),
  nomeRazaoSocial: varchar("nomeRazaoSocial", { length: 255 }).notNull(),
  
  // Contato
  telefone: varchar("telefone", { length: 20 }).notNull(),
  whatsapp: varchar("whatsapp", { length: 20 }),
  email: varchar("email", { length: 320 }).notNull(),
  
  // Dados da apólice
  numeroApolice: varchar("numeroApolice", { length: 50 }),
  vigenciaInicio: timestamp("vigenciaInicio"),
  vigenciaFim: timestamp("vigenciaFim"),
  
  // Dados do sinistro
  dataOcorrencia: timestamp("dataOcorrencia").notNull(),
  horaOcorrencia: varchar("horaOcorrencia", { length: 10 }),
  localOcorrencia: text("localOcorrencia"),
  descricaoOcorrencia: text("descricaoOcorrencia").notNull(),
  
  // Dados específicos por tipo de sinistro (JSON flexível)
  dadosSinistro: json("dadosSinistro"),
  
  // Para RCO - dados do veículo
  placaVeiculo: varchar("placaVeiculo", { length: 10 }),
  marcaModeloVeiculo: varchar("marcaModeloVeiculo", { length: 100 }),
  anoVeiculo: varchar("anoVeiculo", { length: 10 }),
  chassiVeiculo: varchar("chassiVeiculo", { length: 30 }),
  
  // Para RCO - dados do condutor
  nomeCondutor: varchar("nomeCondutor", { length: 255 }),
  cnhCondutor: varchar("cnhCondutor", { length: 20 }),
  
  // Vítimas/Terceiros envolvidos (JSON)
  vitimas: json("vitimas"),
  terceiros: json("terceiros"),
  
  // Estimativa de valor
  valorEstimado: bigint("valorEstimado", { mode: "number" }),
  valorAprovado: bigint("valorAprovado", { mode: "number" }),
  valorPago: bigint("valorPago", { mode: "number" }),
  
  // Documentos obrigatórios (URLs do S3)
  docBoletimOcorrencia: text("docBoletimOcorrencia"),
  docCRLV: text("docCRLV"),
  docCNH: text("docCNH"),
  docFotos: json("docFotos"), // Array de URLs
  docLaudoTecnico: text("docLaudoTecnico"),
  docRelatorioMedico: text("docRelatorioMedico"),
  docOrcamentos: json("docOrcamentos"), // Array de URLs
  docNotasFiscais: json("docNotasFiscais"), // Array de URLs
  docOutros: json("docOutros"), // Array de URLs
  
  // Observações
  observacoes: text("observacoes"),
  motivoNegativa: text("motivoNegativa"),
  
  // Integração CRM/MCP
  crmId: varchar("crmId", { length: 100 }),
  crmSyncedAt: timestamp("crmSyncedAt"),
  
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  encerradoEm: timestamp("encerradoEm"),
});

export type Sinistro = typeof sinistros.$inferSelect;
export type InsertSinistro = typeof sinistros.$inferInsert;

/**
 * Histórico de status dos sinistros
 */
export const sinistroHistorico = mysqlTable("sinistro_historico", {
  id: int("id").autoincrement().primaryKey(),
  
  sinistroId: int("sinistroId").notNull(),
  
  statusAnterior: varchar("statusAnterior", { length: 50 }),
  statusNovo: varchar("statusNovo", { length: 50 }).notNull(),
  
  observacao: text("observacao"),
  
  // Quem fez a alteração
  usuarioId: int("usuarioId"),
  sistema: boolean("sistema").default(false),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SinistroHistorico = typeof sinistroHistorico.$inferSelect;
export type InsertSinistroHistorico = typeof sinistroHistorico.$inferInsert;
