/**
 * Tipos para Sistema de Cotação Inteligente
 * Suporta múltiplos produtos com campos dinâmicos
 */

export type TipoProduto = 'rco' | 'solar' | 'garantia' | 'agro' | 'engenharia' | 'saude';
export type TipoOperacao = 'urbano' | 'rodoviario' | 'fretamento' | 'turismo' | 'escolar';
export type TipoVeiculo = 'onibus' | 'microonibus' | 'van';
export type TipoInstalacao = 'residencial' | 'comercial' | 'industrial' | 'rural';
export type TipoGarantia = 'contratual' | 'judicial' | 'licitante';
export type TipoBem = 'maquinas' | 'benfeitorias' | 'equipamentos';
export type TipoObra = 'construcao' | 'instalacao' | 'montagem';

/**
 * Dados comuns a todas as cotações
 */
export interface DadosBasicoCotacao {
  id?: string;
  tipoProduto: TipoProduto;
  marca: 'livonius' | 'livo';
  
  cnpj: string;
  razaoSocial: string;
  nomeFantasia?: string;
  
  email: string;
  telefone: string;
  whatsapp?: string;
  
  cep: string;
  endereco: string;
  numero: string;
  complemento?: string;
  cidade: string;
  estado: string;
  
  nomeResponsavel: string;
  cargoResponsavel?: string;
  
  criadoEm?: Date;
  atualizadoEm?: Date;
}

/**
 * RCO - Responsabilidade Civil Ônibus (Livonius)
 */
export interface DadosRCO extends DadosBasicoCotacao {
  tipoProduto: 'rco';
  quantidadeVeiculos: number;
  tipoVeiculo: TipoVeiculo;
  anoFabricacaoMedia: number;
  capacidadePassageiros: number;
  tipoOperacao: TipoOperacao;
  registroANTT?: string;
  danosCorporaisPassageiros: boolean;
  danosMaterialPassageiros: boolean;
  danosTerceiros: boolean;
  danosBagagens: boolean;
  app: boolean;
  documentosCNPJ?: string[];
  listaVeiculos?: string;
  certificadoANTT?: string;
}

/**
 * Energia Solar (Livo)
 */
export interface DadosSolar extends DadosBasicoCotacao {
  tipoProduto: 'solar';
  potenciaInstalada: number;
  quantidadePaineis: number;
  marcaPaineis: string;
  modeloPaineis: string;
  marcaInversor: string;
  modeloInversor: string;
  tipoInstalacao: TipoInstalacao;
  dataInstalacao: string;
  valorTotalSistema: number;
  danosEletricos: boolean;
  vendavalGranizo: boolean;
  rouboFurto: boolean;
  incendio: boolean;
  perdaReceita: boolean;
  notaFiscal?: string;
  projetoTecnico?: string;
  fotos?: string[];
}

/**
 * Seguro Garantia (Livo)
 */
export interface DadosGarantia extends DadosBasicoCotacao {
  tipoProduto: 'garantia';
  tipoGarantia: TipoGarantia;
  valorGarantia: number;
  prazoContrato: number;
  objetoContrato: string;
  beneficiario: string;
  faturamentoAnual?: number;
  contrato?: string;
  edital?: string;
  balancoPatrimonial?: string;
}

/**
 * Agrícola / Penhor Rural (Livo)
 */
export interface DadosAgro extends DadosBasicoCotacao {
  tipoProduto: 'agro';
  tipoBem: TipoBem;
  descricaoBem: string;
  valorMercado: number;
  anoFabricacao?: number;
  localizacao: string;
  incendio: boolean;
  rouboFurto: boolean;
  danosEletricos: boolean;
  vendaval: boolean;
  alagamento: boolean;
  notaFiscal?: string;
  fotos?: string[];
  car?: string;
}

/**
 * Riscos de Engenharia (Livo)
 */
export interface DadosEngenharia extends DadosBasicoCotacao {
  tipoProduto: 'engenharia';
  tipoObra: TipoObra;
  enderecoObra: string;
  valorTotalObra: number;
  prazoExecucao: number;
  descricaoProjeto: string;
  danosMateriais: boolean;
  responsabilidadeCivil: boolean;
  erroProjeto: boolean;
  despesasExtraordinarias: boolean;
  propriedadesCircunvizinhas: boolean;
  projeto?: string;
  cronograma?: string;
  art?: string;
}

/**
 * Saúde e Vida (Livo)
 */
export interface DadosSaude extends DadosBasicoCotacao {
  tipoProduto: 'saude';
  coberturaAmbulatorial: boolean;
  internacaoHospitalar: boolean;
  coberturaOdontologica: boolean;
  coberturaOftalmologica: boolean;
  seguroVida: boolean;
  assistencia24h: boolean;
  quantidadeBeneficiarios: number;
  temDependentes: boolean;
  documentoIdentidade?: string;
  comprovantRenda?: string;
}

/**
 * Union type para qualquer tipo de cotação
 */
export type DadosCotacao = 
  | DadosRCO 
  | DadosSolar 
  | DadosGarantia 
  | DadosAgro 
  | DadosEngenharia 
  | DadosSaude;

/**
 * Payload para envio ao CRM / APIs
 */
export interface PayloadCotacao {
  id: string;
  timestamp: string;
  tipoProduto: TipoProduto;
  marca: 'livonius' | 'livo';
  
  cliente: {
    cnpj: string;
    razaoSocial: string;
    email: string;
    telefone: string;
    whatsapp?: string;
    endereco: {
      cep: string;
      rua: string;
      numero: string;
      cidade: string;
      estado: string;
    };
  };
  
  dados: Record<string, any>;
  status: 'rascunho' | 'enviada' | 'processando' | 'aprovada' | 'rejeitada';
  
  documentos: Array<{
    tipo: string;
    url: string;
    nome: string;
  }>;
  
  calculo?: {
    premio: number;
    taxa: number;
    desconto?: number;
    total: number;
  };
  
  origem: 'web' | 'mobile' | 'api';
  navegador?: string;
  ipAddress?: string;
}

/**
 * Resposta de cotação
 */
export interface RespostaCotacao {
  sucesso: boolean;
  protocolo: string;
  mensagem: string;
  cotacao?: PayloadCotacao;
  erros?: string[];
}

/**
 * Configuração de campos por tipo de produto
 */
export interface ConfigCamposPorProduto {
  tipoProduto: TipoProduto;
  marca: 'livonius' | 'livo';
  etapas: Array<{
    numero: number;
    titulo: string;
    descricao: string;
    campos: Array<{
      nome: string;
      tipo: 'text' | 'email' | 'tel' | 'number' | 'date' | 'select' | 'checkbox' | 'file';
      label: string;
      placeholder?: string;
      obrigatorio: boolean;
      validacao?: RegExp;
      opcoes?: Array<{ valor: string; label: string }>;
      ajuda?: string;
    }>;
  }>;
}
