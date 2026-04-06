/**
 * Serviço de consulta de CNPJ via BrasilAPI
 * Consulta dados da empresa, valida CNPJ e retorna informações
 */

export interface DadosCNPJ {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia?: string;
  endereco: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  ativo: boolean;
  dataAbertura: string;
  telefone?: string;
  email?: string;
}

export interface RespostaCNPJ {
  sucesso: boolean;
  dados?: DadosCNPJ;
  erro?: string;
  mensagem?: string;
}

/**
 * Validar formato de CNPJ
 */
function validarFormatoCNPJ(cnpj: string): boolean {
  const cnpjLimpo = cnpj.replace(/\D/g, '');
  
  if (cnpjLimpo.length !== 14) {
    return false;
  }
  
  // Validar dígitos verificadores
  let tamanho = cnpjLimpo.length - 2;
  let numeros = cnpjLimpo.substring(0, tamanho);
  let digitos = cnpjLimpo.substring(tamanho);
  let soma = 0;
  let pos = 0;

  for (let i = tamanho - 1; i >= 0; i--) {
    pos++;
    soma += parseInt(numeros.charAt(tamanho - pos)) * Math.pow(2, pos % 8);
  }

  let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
  if (resultado !== parseInt(digitos.charAt(0))) {
    return false;
  }

  tamanho = tamanho + 1;
  numeros = cnpjLimpo.substring(0, tamanho);
  soma = 0;
  pos = 0;

  for (let i = tamanho - 1; i >= 0; i--) {
    pos++;
    soma += parseInt(numeros.charAt(tamanho - pos)) * Math.pow(2, pos % 8);
  }

  resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
  if (resultado !== parseInt(digitos.charAt(1))) {
    return false;
  }

  return true;
}

/**
 * Consultar CNPJ na BrasilAPI
 */
export async function consultarCNPJ(cnpj: string): Promise<RespostaCNPJ> {
  try {
    // Validar formato
    if (!validarFormatoCNPJ(cnpj)) {
      return {
        sucesso: false,
        erro: 'CNPJ inválido',
        mensagem: 'O CNPJ informado não é válido'
      };
    }

    // Limpar CNPJ
    const cnpjLimpo = cnpj.replace(/\D/g, '');

    // Consultar BrasilAPI
    const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpjLimpo}`);

    if (!response.ok) {
      if (response.status === 404) {
        return {
          sucesso: false,
          erro: 'CNPJ não encontrado',
          mensagem: 'O CNPJ informado não foi encontrado na base de dados'
        };
      }
      throw new Error(`Erro na API: ${response.status}`);
    }

    const dadosAPI = await response.json();

    // Mapear dados da API para nosso formato
    const dados: DadosCNPJ = {
      cnpj: cnpjLimpo,
      razaoSocial: dadosAPI.nome || '',
      nomeFantasia: dadosAPI.fantasia || '',
      endereco: dadosAPI.logradouro || '',
      numero: dadosAPI.numero || '',
      complemento: dadosAPI.complemento || '',
      bairro: dadosAPI.bairro || '',
      cidade: dadosAPI.municipio || '',
      estado: dadosAPI.uf || '',
      cep: dadosAPI.cep || '',
      ativo: dadosAPI.status === 'ATIVA',
      dataAbertura: dadosAPI.data_abertura || '',
      telefone: dadosAPI.ddd_telefone_1 || '',
      email: dadosAPI.email || ''
    };

    // Validar se empresa está ativa
    if (!dados.ativo) {
      return {
        sucesso: false,
        dados,
        erro: 'Empresa inativa',
        mensagem: 'A empresa associada a este CNPJ está inativa'
      };
    }

    return {
      sucesso: true,
      dados
    };
  } catch (erro) {
    console.error('Erro ao consultar CNPJ:', erro);
    return {
      sucesso: false,
      erro: 'Erro ao consultar CNPJ',
      mensagem: 'Ocorreu um erro ao consultar o CNPJ. Tente novamente.'
    };
  }
}

/**
 * Formatar CNPJ para exibição
 */
export function formatarCNPJ(cnpj: string): string {
  const cnpjLimpo = cnpj.replace(/\D/g, '');
  return cnpjLimpo.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
}

/**
 * Limpar CNPJ (remover formatação)
 */
export function limparCNPJ(cnpj: string): string {
  return cnpj.replace(/\D/g, '');
}
