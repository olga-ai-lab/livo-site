import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { sendSinistroNotification, sendConfirmationToClient, sendCotacaoConfirmation, SinistroData, CotacaoData } from "./emailService";
import { 
  criarCotacao, 
  atualizarCotacao, 
  submeterCotacao, 
  buscarCotacaoPorProtocolo,
  buscarCotacaoPorId,
  listarCotacoes,
  registrarAnalytics,
  buscarMetricasAnalytics,
  salvarDocumento,
  atualizarDadosExtraidos,
  listarDocumentosCotacao,
  buscarHistoricoCotacao,
  criarCorretor,
  buscarCorretorPorCnpj,
  buscarCorretorPorProtocolo,
  listarCorretores,
  criarSinistro,
  buscarSinistroPorProtocolo,
  listarSinistros,
} from "./db";
import { storagePut } from "./storage";
import { invokeLLM } from "./_core/llm";
import { notifyOwner } from "./_core/notification";
import { nanoid } from "nanoid";
import { consultarCNPJ, isCNPJError, validarCNPJ, limparCNPJ } from "./cnpjService";

// Schema de validação para o formulário de sinistro
const sinistroSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  cpfCnpj: z.string().min(11, "CPF/CNPJ inválido"),
  email: z.string().email("E-mail inválido"),
  telefone: z.string().min(10, "Telefone inválido"),
  numeroApolice: z.string().optional(),
  dataOcorrido: z.string(),
  relato: z.string().min(10, "Relato deve ter pelo menos 10 caracteres"),
  marca: z.enum(["livonius", "livo"]),
  arquivos: z.array(z.string()).optional(),
});

// Schema para cotação
const cotacaoBaseSchema = z.object({
  marca: z.enum(["livonius", "livo"]),
  produto: z.enum(["rco", "solar", "garantia", "agro", "engenharia"]),
  tipoPessoa: z.enum(["pf", "pj"]),
  cpfCnpj: z.string().min(11),
  nomeRazaoSocial: z.string().min(3),
  nomeFantasia: z.string().optional(),
  telefone: z.string().min(10),
  whatsapp: z.string().optional(),
  email: z.string().email(),
  melhorHorario: z.string().optional(),
  cep: z.string().optional(),
  logradouro: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  dadosProduto: z.record(z.string(), z.any()).optional(),
  coberturas: z.array(z.string()).optional(),
  observacoes: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
});

// Schema para analytics
const analyticsSchema = z.object({
  sessionId: z.string(),
  cotacaoId: z.number().optional(),
  eventType: z.enum([
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
  ]),
  eventData: z.record(z.string(), z.any()).optional(),
  produto: z.enum(["rco", "solar", "garantia", "agro", "engenharia"]).optional(),
  stepNumber: z.number().optional(),
  fieldName: z.string().optional(),
  timeOnStep: z.number().optional(),
  totalTimeOnForm: z.number().optional(),
  userAgent: z.string().optional(),
  deviceType: z.string().optional(),
  screenWidth: z.number().optional(),
  screenHeight: z.number().optional(),
  referrer: z.string().optional(),
  landingPage: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
});

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Router de Sinistros
  sinistro: router({
    // Endpoint para enviar aviso de sinistro
    enviar: publicProcedure
      .input(sinistroSchema)
      .mutation(async ({ input }) => {
        // Gerar protocolo único
        const protocolo = `SIN-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        
        const sinistroData: SinistroData = {
          ...input,
          protocolo,
        };

        // Enviar notificação para a equipe de sinistros
        const notificationResult = await sendSinistroNotification(sinistroData);
        
        // Enviar confirmação para o cliente
        const confirmationResult = await sendConfirmationToClient(sinistroData);

        return {
          success: notificationResult.success,
          protocolo,
          message: notificationResult.message,
          confirmationSent: confirmationResult.success,
        };
      }),
  }),

  // Router de Cotações
  cotacao: router({
    // Criar nova cotação (rascunho)
    criar: publicProcedure
      .input(cotacaoBaseSchema)
      .mutation(async ({ input }) => {
        const cotacao = await criarCotacao(input);
        
        if (!cotacao) {
          throw new Error("Erro ao criar cotação");
        }

        return {
          success: true,
          protocolo: cotacao.protocolo,
          id: cotacao.id,
        };
      }),

    // Atualizar cotação existente
    atualizar: publicProcedure
      .input(z.object({
        id: z.number(),
        dados: cotacaoBaseSchema.partial(),
      }))
      .mutation(async ({ input }) => {
        const cotacao = await atualizarCotacao(input.id, input.dados);
        
        if (!cotacao) {
          throw new Error("Cotação não encontrada");
        }

        return {
          success: true,
          cotacao,
        };
      }),

    // Submeter cotação para análise
    submeter: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const cotacao = await submeterCotacao(input.id);
        
        if (!cotacao) {
          throw new Error("Erro ao submeter cotação");
        }

        // Notificar equipe comercial
        await notifyOwner({
          title: `Nova Cotação: ${cotacao.protocolo}`,
          content: `
Nova solicitação de cotação recebida!

**Protocolo:** ${cotacao.protocolo}
**Produto:** ${cotacao.produto.toUpperCase()}
**Marca:** ${cotacao.marca === 'livonius' ? 'Livonius' : 'Livo MGA'}

**Cliente:**
- Nome: ${cotacao.nomeRazaoSocial}
- ${cotacao.tipoPessoa === 'pf' ? 'CPF' : 'CNPJ'}: ${cotacao.cpfCnpj}
- E-mail: ${cotacao.email}
- Telefone: ${cotacao.telefone}

**Observações:** ${cotacao.observacoes || 'Nenhuma'}
          `.trim(),
        });

        // Enviar e-mail de confirmação ao cliente
        const cotacaoEmailData: CotacaoData = {
          protocolo: cotacao.protocolo,
          marca: cotacao.marca as 'livonius' | 'livo',
          produto: cotacao.produto,
          nomeRazaoSocial: cotacao.nomeRazaoSocial,
          email: cotacao.email,
          telefone: cotacao.telefone,
          tipoPessoa: cotacao.tipoPessoa as 'pf' | 'pj',
          cpfCnpj: cotacao.cpfCnpj,
          dadosProduto: cotacao.dadosProduto as Record<string, any> | undefined,
          coberturas: cotacao.coberturas as string[] | undefined,
        };

        try {
          const emailResult = await sendCotacaoConfirmation(cotacaoEmailData);
          console.log(`[Cotação] E-mail de confirmação: ${emailResult.success ? 'enviado' : 'falhou'} - ${cotacao.protocolo}`);
        } catch (emailError) {
          console.error('[Cotação] Erro ao enviar e-mail de confirmação:', emailError);
          // Não lançar erro para não bloquear a submissão
        }

        return {
          success: true,
          protocolo: cotacao.protocolo,
          message: "Cotação enviada com sucesso! Nossa equipe entrará em contato em breve.",
        };
      }),

    // Buscar cotação por protocolo
    buscarPorProtocolo: publicProcedure
      .input(z.object({ protocolo: z.string() }))
      .query(async ({ input }) => {
        const cotacao = await buscarCotacaoPorProtocolo(input.protocolo);
        return cotacao;
      }),

    // Buscar cotação por ID
    buscarPorId: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const cotacao = await buscarCotacaoPorId(input.id);
        return cotacao;
      }),

    // Listar cotações (para admin)
    listar: publicProcedure
      .input(z.object({
        status: z.string().optional(),
        produto: z.string().optional(),
        marca: z.string().optional(),
        limite: z.number().optional(),
        offset: z.number().optional(),
      }).optional())
      .query(async ({ input }) => {
        const cotacoes = await listarCotacoes(input);
        return cotacoes;
      }),

    // Buscar histórico de uma cotação
    historico: publicProcedure
      .input(z.object({ cotacaoId: z.number() }))
      .query(async ({ input }) => {
        const historico = await buscarHistoricoCotacao(input.cotacaoId);
        return historico;
      }),

    // Upload de documento
    uploadDocumento: publicProcedure
      .input(z.object({
        cotacaoId: z.number(),
        nomeOriginal: z.string(),
        mimeType: z.string(),
        base64: z.string(),
        tipoDocumento: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        // Converter base64 para buffer
        const buffer = Buffer.from(input.base64, 'base64');
        
        // Gerar nome único para o arquivo
        const extensao = input.nomeOriginal.split('.').pop() || 'bin';
        const nomeArmazenado = `cotacoes/${input.cotacaoId}/${nanoid()}.${extensao}`;
        
        // Upload para S3
        const { url } = await storagePut(nomeArmazenado, buffer, input.mimeType);
        
        // Salvar metadados no banco
        const docId = await salvarDocumento({
          cotacaoId: input.cotacaoId,
          nomeOriginal: input.nomeOriginal,
          nomeArmazenado,
          mimeType: input.mimeType,
          tamanho: buffer.length,
          url,
          fileKey: nomeArmazenado,
          tipoDocumento: input.tipoDocumento,
        });

        return {
          success: true,
          documentoId: docId,
          url,
        };
      }),

    // Listar documentos de uma cotação
    listarDocumentos: publicProcedure
      .input(z.object({ cotacaoId: z.number() }))
      .query(async ({ input }) => {
        const docs = await listarDocumentosCotacao(input.cotacaoId);
        return docs;
      }),

    // Extrair dados de documento com IA
    extrairDados: publicProcedure
      .input(z.object({
        documentoId: z.number(),
        url: z.string(),
        produto: z.enum(["rco", "solar", "garantia", "agro", "engenharia"]),
      }))
      .mutation(async ({ input }) => {
        // Definir campos esperados por produto
        const camposPorProduto: Record<string, string[]> = {
          rco: ["cnpj", "razaoSocial", "quantidadeVeiculos", "tipoOperacao", "registroANTT"],
          solar: ["cpfCnpj", "nome", "potenciaInstalada", "quantidadePaineis", "valorSistema"],
          garantia: ["cnpj", "razaoSocial", "tipoGarantia", "valorGarantia", "prazoContrato"],
          agro: ["cpfCnpj", "nome", "tipoBem", "valorMercado", "localizacao"],
          engenharia: ["cnpj", "razaoSocial", "tipoObra", "valorObra", "prazoExecucao"],
        };

        const campos = camposPorProduto[input.produto] || [];

        try {
          // Usar LLM para extrair dados do documento
          const response = await invokeLLM({
            messages: [
              {
                role: "system",
                content: `Você é um assistente especializado em extrair dados de documentos de seguros.
                
Analise o documento fornecido e extraia os seguintes campos se disponíveis:
${campos.map(c => `- ${c}`).join('\n')}

Retorne APENAS um JSON válido com os campos encontrados. Se um campo não for encontrado, não inclua no JSON.
Inclua também um campo "confianca" de 0 a 100 indicando sua confiança na extração.`,
              },
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: `Extraia os dados deste documento para cotação de seguro ${input.produto.toUpperCase()}. URL do documento: ${input.url}`,
                  },
                ],
              },
            ],
            response_format: {
              type: "json_schema",
              json_schema: {
                name: "dados_extraidos",
                strict: true,
                schema: {
                  type: "object",
                  properties: {
                    dados: {
                      type: "object",
                      additionalProperties: true,
                    },
                    confianca: {
                      type: "integer",
                      minimum: 0,
                      maximum: 100,
                    },
                  },
                  required: ["dados", "confianca"],
                  additionalProperties: false,
                },
              },
            },
          });

          const content = response.choices[0].message.content;
          const resultado = JSON.parse(typeof content === 'string' ? content : "{}");
          
          // Atualizar documento com dados extraídos
          await atualizarDadosExtraidos(
            input.documentoId,
            resultado.dados || {},
            resultado.confianca || 0
          );

          return {
            success: true,
            dados: resultado.dados,
            confianca: resultado.confianca,
          };
        } catch (error) {
          console.error("[Cotação] Erro ao extrair dados:", error);
          return {
            success: false,
            dados: {},
            confianca: 0,
            error: "Não foi possível extrair dados do documento",
          };
        }
      }),

    // Preparar payload para MCP/CRM
    prepararMCP: publicProcedure
      .input(z.object({ cotacaoId: z.number() }))
      .mutation(async ({ input }) => {
        const cotacao = await buscarCotacaoPorId(input.cotacaoId);
        
        if (!cotacao) {
          throw new Error("Cotação não encontrada");
        }

        const documentos = await listarDocumentosCotacao(input.cotacaoId);

        // Montar payload padronizado para MCP/CRM
        const mcpPayload = {
          protocolo: cotacao.protocolo,
          timestamp: new Date().toISOString(),
          origem: "site_grupo_livonius",
          
          cliente: {
            tipo: cotacao.tipoPessoa,
            documento: cotacao.cpfCnpj,
            nome: cotacao.nomeRazaoSocial,
            nomeFantasia: cotacao.nomeFantasia,
            contato: {
              telefone: cotacao.telefone,
              whatsapp: cotacao.whatsapp,
              email: cotacao.email,
              melhorHorario: cotacao.melhorHorario,
            },
            endereco: {
              cep: cotacao.cep,
              logradouro: cotacao.logradouro,
              numero: cotacao.numero,
              complemento: cotacao.complemento,
              bairro: cotacao.bairro,
              cidade: cotacao.cidade,
              estado: cotacao.estado,
            },
          },
          
          cotacao: {
            marca: cotacao.marca,
            produto: cotacao.produto,
            dadosProduto: cotacao.dadosProduto,
            coberturas: cotacao.coberturas,
            observacoes: cotacao.observacoes,
          },
          
          documentos: documentos.map(doc => ({
            nome: doc.nomeOriginal,
            tipo: doc.tipoDocumento,
            url: doc.url,
            dadosExtraidos: doc.dadosExtraidos,
            confianca: doc.confiancaExtracao,
          })),
          
          rastreamento: {
            utmSource: cotacao.utmSource,
            utmMedium: cotacao.utmMedium,
            utmCampaign: cotacao.utmCampaign,
            origem: cotacao.origem,
          },
        };

        // Salvar payload na cotação
        await atualizarCotacao(input.cotacaoId, {
          mcpPayload: mcpPayload as any,
        });

        return {
          success: true,
          payload: mcpPayload,
        };
      }),
  }),

  // Router de Analytics
  analytics: router({
    // Registrar evento
    registrar: publicProcedure
      .input(analyticsSchema)
      .mutation(async ({ input }) => {
        await registrarAnalytics(input);
        return { success: true };
      }),

    // Buscar métricas (para admin)
    metricas: publicProcedure
      .input(z.object({
        produto: z.string().optional(),
        dataInicio: z.string().optional(),
        dataFim: z.string().optional(),
      }).optional())
      .query(async ({ input }) => {
        const metricas = await buscarMetricasAnalytics({
          produto: input?.produto,
          dataInicio: input?.dataInicio ? new Date(input.dataInicio) : undefined,
          dataFim: input?.dataFim ? new Date(input.dataFim) : undefined,
        });
        return metricas;
      }),
  }),

  // Router de Corretores/Parceiros
  corretor: router({
    // Cadastrar novo corretor
    cadastrar: publicProcedure
      .input(z.object({
        cnpj: z.string().min(14).max(18),
        razaoSocial: z.string().min(3),
        nomeFantasia: z.string().optional(),
        inscricaoEstadual: z.string().optional(),
        cep: z.string().optional(),
        logradouro: z.string().optional(),
        numero: z.string().optional(),
        complemento: z.string().optional(),
        bairro: z.string().optional(),
        cidade: z.string().optional(),
        estado: z.string().optional(),
        telefoneEmpresa: z.string().optional(),
        emailEmpresa: z.string().email(),
        website: z.string().optional(),
        nomeResponsavel: z.string().min(3),
        cpfResponsavel: z.string().optional(),
        cargoResponsavel: z.string().optional(),
        telefoneResponsavel: z.string().min(10),
        emailResponsavel: z.string().email(),
        bancoNome: z.string().optional(),
        bancoCodigo: z.string().optional(),
        agencia: z.string().optional(),
        conta: z.string().optional(),
        tipoConta: z.enum(["corrente", "poupanca"]).optional(),
        pixChave: z.string().optional(),
        docContratoSocial: z.string().optional(),
        docComprovanteBancarioPJ: z.string().optional(),
        docComprovantesBancariosSocios: z.array(z.string()).optional(),
        susepNumero: z.string().optional(),
        observacoes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        // Verificar se CNPJ já está cadastrado
        const cnpjLimpo = limparCNPJ(input.cnpj);
        const existente = await buscarCorretorPorCnpj(cnpjLimpo);
        
        if (existente) {
          return {
            success: false,
            error: "CNPJ_JA_CADASTRADO",
            message: "Este CNPJ já possui cadastro. Entre em contato para mais informações.",
            protocolo: existente.protocolo,
          };
        }
        
        const corretor = await criarCorretor({
          ...input,
          cnpj: cnpjLimpo,
          docComprovantesBancariosSocios: input.docComprovantesBancariosSocios as any,
        });
        
        if (!corretor) {
          throw new Error("Erro ao criar cadastro de corretor");
        }
        
        // Notificar equipe
        await notifyOwner({
          title: `Novo Cadastro de Corretor: ${input.razaoSocial}`,
          content: `Protocolo: ${corretor.protocolo}\nCNPJ: ${cnpjLimpo}\nResponsável: ${input.nomeResponsavel}\nE-mail: ${input.emailResponsavel}\nTelefone: ${input.telefoneResponsavel}`,
        });
        
        return {
          success: true,
          protocolo: corretor.protocolo,
          message: "Cadastro recebido com sucesso! Nossa equipe entrará em contato em breve.",
        };
      }),

    // Consultar status do cadastro
    consultarStatus: publicProcedure
      .input(z.object({
        protocolo: z.string(),
      }))
      .query(async ({ input }) => {
        const corretor = await buscarCorretorPorProtocolo(input.protocolo);
        
        if (!corretor) {
          return {
            success: false,
            error: "NAO_ENCONTRADO",
            message: "Cadastro não encontrado com este protocolo.",
          };
        }
        
        return {
          success: true,
          status: corretor.status,
          razaoSocial: corretor.razaoSocial,
          createdAt: corretor.createdAt,
        };
      }),

    // Listar corretores (admin)
    listar: publicProcedure
      .input(z.object({
        status: z.string().optional(),
        limite: z.number().optional(),
        offset: z.number().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await listarCorretores(input);
      }),
  }),

  // Router de Sinistros
  sinistroNovo: router({
    // Abrir novo sinistro
    abrir: publicProcedure
      .input(z.object({
        marca: z.enum(["livonius", "livo"]),
        produto: z.enum(["rco", "solar", "garantia", "agro", "engenharia"]),
        tipoSinistro: z.string().min(3),
        tipoPessoa: z.enum(["pf", "pj"]),
        cpfCnpj: z.string().min(11),
        nomeRazaoSocial: z.string().min(3),
        telefone: z.string().min(10),
        whatsapp: z.string().optional(),
        email: z.string().email(),
        numeroApolice: z.string().optional(),
        dataOcorrencia: z.string(),
        horaOcorrencia: z.string().optional(),
        localOcorrencia: z.string().optional(),
        descricaoOcorrencia: z.string().min(10),
        dadosSinistro: z.record(z.string(), z.any()).optional(),
        // Dados específicos RCO
        placaVeiculo: z.string().optional(),
        marcaModeloVeiculo: z.string().optional(),
        anoVeiculo: z.string().optional(),
        chassiVeiculo: z.string().optional(),
        nomeCondutor: z.string().optional(),
        cnhCondutor: z.string().optional(),
        // Documentos
        docBoletimOcorrencia: z.string().optional(),
        docCRLV: z.string().optional(),
        docCNH: z.string().optional(),
        docFotos: z.array(z.string()).optional(),
        docLaudoTecnico: z.string().optional(),
        docRelatorioMedico: z.string().optional(),
        docOrcamentos: z.array(z.string()).optional(),
        docNotasFiscais: z.array(z.string()).optional(),
        docOutros: z.array(z.string()).optional(),
        observacoes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const sinistro = await criarSinistro({
          ...input,
          dataOcorrencia: new Date(input.dataOcorrencia),
          docFotos: input.docFotos as any,
          docOrcamentos: input.docOrcamentos as any,
          docNotasFiscais: input.docNotasFiscais as any,
          docOutros: input.docOutros as any,
        });
        
        if (!sinistro) {
          throw new Error("Erro ao abrir sinistro");
        }
        
        // Notificar equipe de sinistros
        await notifyOwner({
          title: `Novo Sinistro Aberto: ${sinistro.protocolo}`,
          content: `Produto: ${input.produto.toUpperCase()}\nTipo: ${input.tipoSinistro}\nSegurado: ${input.nomeRazaoSocial}\nData: ${input.dataOcorrencia}\nDescrição: ${input.descricaoOcorrencia.substring(0, 200)}...`,
        });
        
        return {
          success: true,
          protocolo: sinistro.protocolo,
          message: "Sinistro aberto com sucesso! Acompanhe o andamento pelo protocolo informado.",
        };
      }),

    // Consultar status do sinistro
    consultarStatus: publicProcedure
      .input(z.object({
        protocolo: z.string(),
      }))
      .query(async ({ input }) => {
        const sinistro = await buscarSinistroPorProtocolo(input.protocolo);
        
        if (!sinistro) {
          return {
            success: false,
            error: "NAO_ENCONTRADO",
            message: "Sinistro não encontrado com este protocolo.",
          };
        }
        
        return {
          success: true,
          status: sinistro.status,
          produto: sinistro.produto,
          tipoSinistro: sinistro.tipoSinistro,
          dataOcorrencia: sinistro.dataOcorrencia,
          createdAt: sinistro.createdAt,
        };
      }),

    // Listar sinistros (admin ou por CPF/CNPJ)
    listar: publicProcedure
      .input(z.object({
        status: z.string().optional(),
        produto: z.string().optional(),
        cpfCnpj: z.string().optional(),
        limite: z.number().optional(),
        offset: z.number().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await listarSinistros(input);
      }),
  }),

  // Router de utilidades (CNPJ, CEP, etc.)
  utils: router({
    // Consultar CNPJ na Receita Federal via BrasilAPI
    consultarCNPJ: publicProcedure
      .input(z.object({
        cnpj: z.string().min(14).max(18),
      }))
      .query(async ({ input }) => {
        const cnpjLimpo = limparCNPJ(input.cnpj);
        
        // Validar formato
        if (!validarCNPJ(cnpjLimpo)) {
          return {
            success: false,
            error: "CNPJ_INVALIDO",
            message: "O CNPJ informado é inválido. Verifique os dígitos.",
          };
        }
        
        const resultado = await consultarCNPJ(cnpjLimpo);
        
        if (isCNPJError(resultado)) {
          return {
            success: false,
            error: resultado.error,
            message: resultado.message,
          };
        }
        
        return {
          success: true,
          dados: resultado,
        };
      }),

    // Validar CNPJ (apenas formato, sem consulta)
    validarCNPJ: publicProcedure
      .input(z.object({
        cnpj: z.string(),
      }))
      .query(({ input }) => {
        const cnpjLimpo = limparCNPJ(input.cnpj);
        const valido = validarCNPJ(cnpjLimpo);
        
        return {
          valido,
          cnpjFormatado: valido 
            ? cnpjLimpo.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
            : null,
        };
      }),
  }),
  tts: router({
    synthesize: publicProcedure
      .input(z.object({
        text: z.string().min(1),
        articleId: z.string(),
        language: z.enum(["pt-BR", "en"]).default("pt-BR"),
      }))
      .mutation(async ({ input }) => {
        try {
          const audioKey = `audio/${input.articleId}-${Date.now()}.mp3`;
          return {
            audioUrl: `/audio/${input.articleId}.mp3`,
            duration: 0,
            language: input.language,
          };
        } catch (error) {
          console.error("Erro ao sintetizar áudio:", error);
          throw new Error("Falha ao gerar áudio");
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
