/**
 * Rota tRPC para gerenciar cotações de seguros
 * Integra consulta de CNPJ, validação e envio de dados
 */

import { router, publicProcedure } from '../_core/trpc';
import { z } from 'zod';
import { consultarCNPJ, RespostaCNPJ } from '../services/cnpjService';
import { nanoid } from 'nanoid';

export const cotacaoRouter = router({
  /**
   * Consultar CNPJ e retornar dados da empresa
   */
  consultarCNPJ: publicProcedure
    .input(z.object({
      cnpj: z.string().min(11).max(18)
    }))
    .mutation(async ({ input }) => {
      const resultado = await consultarCNPJ(input.cnpj);
      return resultado;
    }),

  /**
   * Enviar cotação para análise
   */
  enviarCotacao: publicProcedure
    .input(z.object({
      tipoProduto: z.enum(['rco', 'solar', 'garantia', 'agro', 'engenharia', 'saude']),
      marca: z.enum(['livonius', 'livo']),
      
      // Dados básicos
      cnpj: z.string(),
      razaoSocial: z.string(),
      nomeFantasia: z.string().optional(),
      email: z.string().email(),
      telefone: z.string(),
      whatsapp: z.string().optional(),
      
      // Endereço
      cep: z.string(),
      endereco: z.string(),
      numero: z.string(),
      complemento: z.string().optional(),
      cidade: z.string(),
      estado: z.string(),
      
      // Responsável
      nomeResponsavel: z.string(),
      cargoResponsavel: z.string().optional(),
      
      // Dados específicos do produto (flexível)
      dadosProduto: z.record(z.string(), z.any()).optional()
    }))
    .mutation(async ({ input }) => {
      try {
        // Gerar protocolo único
        const protocolo = `COT-${Date.now()}-${nanoid(6)}`;

        // Criar payload estruturado
        const payload = {
          id: protocolo,
          timestamp: new Date().toISOString(),
          tipoProduto: input.tipoProduto,
          marca: input.marca,
          
          cliente: {
            cnpj: input.cnpj,
            razaoSocial: input.razaoSocial,
            email: input.email,
            telefone: input.telefone,
            whatsapp: input.whatsapp,
            endereco: {
              cep: input.cep,
              rua: input.endereco,
              numero: input.numero,
              cidade: input.cidade,
              estado: input.estado
            }
          },
          
          dados: input.dadosProduto || {},
          status: 'enviada' as const,
          documentos: [],
          origem: 'web' as const
        };

        // TODO: Integrar com CRM/APIs de cálculo
        // Por enquanto, apenas retornar o payload

        return {
          sucesso: true,
          protocolo,
          mensagem: `Cotação ${protocolo} recebida com sucesso. Você receberá um e-mail de confirmação em breve.`,
          payload
        };
      } catch (erro) {
        console.error('Erro ao enviar cotação:', erro);
        return {
          sucesso: false,
          protocolo: '',
          mensagem: 'Erro ao processar cotação. Tente novamente.',
          erro: erro instanceof Error ? erro.message : 'Erro desconhecido'
        };
      }
    }),

  /**
   * Listar cotações (para dashboard do corretor - futuro)
   */
  listarCotacoes: publicProcedure
    .query(async () => {
      // TODO: Implementar listagem de cotações
      return {
        cotacoes: [],
        total: 0
      };
    })
});
