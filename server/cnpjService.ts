/**
 * Serviço de consulta de CNPJ via BrasilAPI
 * https://brasilapi.com.br/docs#tag/CNPJ
 */

import axios from "axios";

const BRASIL_API_URL = "https://brasilapi.com.br/api/cnpj/v1";

export interface CNPJResponse {
  cnpj: string;
  razao_social: string;
  nome_fantasia: string | null;
  uf: string;
  cep: string;
  bairro: string;
  numero: string;
  municipio: string;
  logradouro: string;
  complemento: string;
  ddd_telefone_1: string;
  ddd_telefone_2: string;
  email: string | null;
  porte: string;
  natureza_juridica: string;
  capital_social: number;
  situacao_cadastral: string;
  data_situacao_cadastral: string;
  data_inicio_atividade: string;
  cnae_fiscal: number;
  cnae_fiscal_descricao: string;
  qsa: Array<{
    nome_socio: string;
    cnpj_cpf_do_socio: string;
    qualificacao_socio: string;
  }>;
}

export interface CNPJSimplificado {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string | null;
  uf: string;
  cep: string;
  endereco: string;
  bairro: string;
  cidade: string;
  telefone: string | null;
  email: string | null;
  porte: string;
  situacao: string;
  atividadePrincipal: string;
}

export interface CNPJError {
  success: false;
  error: string;
  message: string;
}

/**
 * Remove formatação do CNPJ (pontos, barras, hífens)
 */
export function limparCNPJ(cnpj: string): string {
  return cnpj.replace(/[^\d]/g, "");
}

/**
 * Valida formato do CNPJ (14 dígitos)
 */
export function validarCNPJ(cnpj: string): boolean {
  const cnpjLimpo = limparCNPJ(cnpj);
  
  if (cnpjLimpo.length !== 14) {
    return false;
  }
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cnpjLimpo)) {
    return false;
  }
  
  // Validação dos dígitos verificadores
  let tamanho = cnpjLimpo.length - 2;
  let numeros = cnpjLimpo.substring(0, tamanho);
  const digitos = cnpjLimpo.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;
  
  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(0))) {
    return false;
  }
  
  tamanho = tamanho + 1;
  numeros = cnpjLimpo.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  
  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(1))) {
    return false;
  }
  
  return true;
}

/**
 * Formata telefone para exibição
 */
function formatarTelefone(ddd: string): string | null {
  if (!ddd || ddd.trim() === "") return null;
  
  // Remove caracteres não numéricos
  const numeros = ddd.replace(/[^\d]/g, "");
  
  if (numeros.length < 10) return null;
  
  const dddParte = numeros.substring(0, 2);
  const numero = numeros.substring(2);
  
  if (numero.length === 9) {
    return `(${dddParte}) ${numero.substring(0, 5)}-${numero.substring(5)}`;
  } else if (numero.length === 8) {
    return `(${dddParte}) ${numero.substring(0, 4)}-${numero.substring(4)}`;
  }
  
  return `(${dddParte}) ${numero}`;
}

/**
 * Monta endereço completo
 */
function montarEndereco(data: CNPJResponse): string {
  const partes: string[] = [];
  
  if (data.logradouro) {
    partes.push(data.logradouro);
  }
  
  if (data.numero) {
    partes.push(data.numero);
  }
  
  if (data.complemento) {
    partes.push(data.complemento);
  }
  
  return partes.join(", ");
}

/**
 * Consulta dados de um CNPJ na BrasilAPI
 */
export async function consultarCNPJ(
  cnpj: string
): Promise<CNPJSimplificado | CNPJError> {
  const cnpjLimpo = limparCNPJ(cnpj);
  
  // Validação prévia
  if (!validarCNPJ(cnpjLimpo)) {
    return {
      success: false,
      error: "CNPJ_INVALIDO",
      message: "O CNPJ informado é inválido. Verifique os dígitos.",
    };
  }
  
  try {
    const response = await axios.get<CNPJResponse>(
      `${BRASIL_API_URL}/${cnpjLimpo}`,
      {
        timeout: 10000, // 10 segundos
        headers: {
          Accept: "application/json",
        },
      }
    );
    
    const data = response.data;
    
    // Transforma para formato simplificado
    const resultado: CNPJSimplificado = {
      cnpj: data.cnpj,
      razaoSocial: data.razao_social,
      nomeFantasia: data.nome_fantasia || null,
      uf: data.uf,
      cep: data.cep,
      endereco: montarEndereco(data),
      bairro: data.bairro,
      cidade: data.municipio,
      telefone: formatarTelefone(data.ddd_telefone_1) || formatarTelefone(data.ddd_telefone_2),
      email: data.email || null,
      porte: data.porte,
      situacao: data.situacao_cadastral,
      atividadePrincipal: data.cnae_fiscal_descricao || "",
    };
    
    return resultado;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) {
        return {
          success: false,
          error: "CNPJ_INVALIDO",
          message: "O CNPJ informado é inválido ou está mal formatado.",
        };
      }
      
      if (error.response?.status === 404) {
        return {
          success: false,
          error: "CNPJ_NAO_ENCONTRADO",
          message: "CNPJ não encontrado na base da Receita Federal.",
        };
      }
      
      if (error.code === "ECONNABORTED") {
        return {
          success: false,
          error: "TIMEOUT",
          message: "A consulta demorou muito. Tente novamente.",
        };
      }
    }
    
    console.error("[CNPJ] Erro ao consultar:", error);
    
    return {
      success: false,
      error: "ERRO_INTERNO",
      message: "Erro ao consultar CNPJ. Tente novamente mais tarde.",
    };
  }
}

/**
 * Verifica se o resultado é um erro
 */
export function isCNPJError(
  result: CNPJSimplificado | CNPJError
): result is CNPJError {
  return "success" in result && result.success === false;
}
