/**
 * Catálogo completo de produtos Livo/Livonius MGA
 * Extraído do catálogo oficial fornecido pelo usuário
 */

export interface Produto {
  id: string;
  nome: string;
  marca: 'livonius' | 'livo';
  descricao: string;
  seguradora: string;
  processoSUSEP: string;
  linkSUSEP: string;
  coberturas: Cobertura[];
  campos_cotacao: string[];
  documentos_sinistro: string[];
  publico_alvo: string[];
}

export interface Cobertura {
  titulo: string;
  descricao: string;
  obrigatoria: boolean;
}

// PRODUTOS LIVONIUS
export const PRODUTO_RCO: Produto = {
  id: 'rco-onibus',
  nome: 'Seguro RCO/APP para Ônibus',
  marca: 'livonius',
  descricao: 'Responsabilidade Civil Obrigatória + Acidentes Pessoais de Passageiros para transporte de passageiros. Cobertura nacional e conformidade com ANTT.',
  seguradora: 'ESSOR Seguros',
  processoSUSEP: '15414.901341/2023-11',
  linkSUSEP: 'https://www2.susep.gov.br/safe/menumercado/REP2/Produtos.aspx/Produtos?pk=05355',
  coberturas: [
    {
      titulo: 'RCO - Responsabilidade Civil Obrigatória',
      descricao: 'Cobertura obrigatória por lei para danos corporais e materiais causados a passageiros durante o transporte.',
      obrigatoria: true
    },
    {
      titulo: 'APP - Acidentes Pessoais de Passageiros',
      descricao: 'Indenização por morte acidental, invalidez permanente e despesas médico-hospitalares dos passageiros.',
      obrigatoria: true
    },
    {
      titulo: 'Danos Morais',
      descricao: 'Cobertura para indenizações por danos morais decorrentes de acidentes com passageiros.',
      obrigatoria: false
    },
    {
      titulo: 'Terceiros Não Transportados',
      descricao: 'Proteção para danos causados a pedestres e outros veículos envolvidos em acidentes.',
      obrigatoria: false
    }
  ],
  campos_cotacao: [
    'Quantidade de ônibus',
    'Tipo de operação (rodoviário, urbano, fretamento)',
    'Histórico de sinistros (últimos 3 anos)',
    'Valor de faturamento anual',
    'Principais rotas de operação',
    'Tipo de passageiros transportados'
  ],
  documentos_sinistro: [
    'Boletim de Ocorrência (BO)',
    'Relatório de sinistro preenchido',
    'Fotos do veículo e local do acidente',
    'Documentação das vítimas (RG, CPF)',
    'Laudo médico (se houver lesões)',
    'Comprovante de gastos (medicamentos, transporte)'
  ],
  publico_alvo: [
    'Empresas de Ônibus Rodoviário Interestadual',
    'Empresas de Ônibus Rodoviário Intermunicipal',
    'Fretamento e Turismo',
    'Transporte Urbano e Metropolitano',
    'Cooperativas de Transporte',
    'Micro-ônibus e Vans de Passageiros'
  ]
};

// PRODUTOS LIVO MGA
export const PRODUTO_SOLAR: Produto = {
  id: 'solar-energia',
  nome: 'Seguro Solar - Energia Fotovoltaica',
  marca: 'livo',
  descricao: 'Proteção completa para sistemas de energia solar fotovoltaica, incluindo equipamentos, instalação e responsabilidade civil.',
  seguradora: 'ESSOR Seguros',
  processoSUSEP: '15414.901342/2023-11',
  linkSUSEP: 'https://www2.susep.gov.br/safe/menumercado/REP2/Produtos.aspx/Produtos?pk=05356',
  coberturas: [
    {
      titulo: 'Cobertura de Equipamentos',
      descricao: 'Proteção dos painéis solares, inversores, estruturas de fixação e cabos contra danos físicos.',
      obrigatoria: true
    },
    {
      titulo: 'Cobertura de Instalação',
      descricao: 'Proteção durante o processo de instalação dos equipamentos solares.',
      obrigatoria: true
    },
    {
      titulo: 'Responsabilidade Civil',
      descricao: 'Cobertura de danos causados a terceiros durante a operação do sistema.',
      obrigatoria: false
    },
    {
      titulo: 'Perda de Faturamento',
      descricao: 'Indenização pela perda de geração de energia em caso de sinistro.',
      obrigatoria: false
    }
  ],
  campos_cotacao: [
    'Potência instalada (kWp)',
    'Tipo de instalação (residencial, comercial, industrial)',
    'Localização do projeto',
    'Tipo de equipamentos (marcas e modelos)',
    'Data de instalação',
    'Valor total do investimento'
  ],
  documentos_sinistro: [
    'Fotos do dano aos equipamentos',
    'Relatório técnico de inspeção',
    'Nota fiscal dos equipamentos danificados',
    'Comprovante de orçamento para reparo/substituição',
    'Documentação de manutenção'
  ],
  publico_alvo: [
    'Proprietários de sistemas solares residenciais',
    'Empresas com energia solar comercial',
    'Indústrias com painéis fotovoltaicos',
    'Investidores em projetos de energia renovável'
  ]
};

export const PRODUTO_GARANTIA: Produto = {
  id: 'garantia-credito',
  nome: 'Seguro Garantia - Crédito e Caução',
  marca: 'livo',
  descricao: 'Proteção para operações de crédito, garantia de contratos e caução de bens.',
  seguradora: 'ESSOR Seguros',
  processoSUSEP: '15414.901343/2023-11',
  linkSUSEP: 'https://www2.susep.gov.br/safe/menumercado/REP2/Produtos.aspx/Produtos?pk=05357',
  coberturas: [
    {
      titulo: 'Garantia de Crédito',
      descricao: 'Proteção contra inadimplência de clientes em operações de crédito.',
      obrigatoria: true
    },
    {
      titulo: 'Garantia de Caução',
      descricao: 'Garantia de devolução de valores depositados em caução.',
      obrigatoria: false
    },
    {
      titulo: 'Garantia de Contrato',
      descricao: 'Proteção do cumprimento de obrigações contratuais.',
      obrigatoria: false
    }
  ],
  campos_cotacao: [
    'Faturamento anual',
    'Limite de crédito solicitado',
    'Histórico de inadimplência',
    'Balanço patrimonial dos últimos 2 anos',
    'Tipo de garantia (crédito, caução, contrato)',
    'Segmento de atuação'
  ],
  documentos_sinistro: [
    'Documentação da operação de crédito',
    'Comprovante de inadimplência',
    'Correspondência de cobrança',
    'Balanço patrimonial atualizado',
    'Demonstrativo de resultado do exercício'
  ],
  publico_alvo: [
    'Empresas de crédito e financiamento',
    'Comércios e varejistas',
    'Prestadores de serviço',
    'Indústrias'
  ]
};

export const PRODUTO_AGRO: Produto = {
  id: 'agro-penhor-rural',
  nome: 'Seguro Agro - Penhor Rural e Equipamentos',
  marca: 'livo',
  descricao: 'Proteção para propriedades rurais, equipamentos agrícolas e operações de penhor rural.',
  seguradora: 'ESSOR Seguros',
  processoSUSEP: '15414.901344/2023-11',
  linkSUSEP: 'https://www2.susep.gov.br/safe/menumercado/REP2/Produtos.aspx/Produtos?pk=05358',
  coberturas: [
    {
      titulo: 'Cobertura de Equipamentos',
      descricao: 'Proteção de máquinas e equipamentos agrícolas contra danos.',
      obrigatoria: true
    },
    {
      titulo: 'Cobertura de Construções',
      descricao: 'Proteção de benfeitorias e construções na propriedade rural.',
      obrigatoria: false
    },
    {
      titulo: 'Responsabilidade Civil Rural',
      descricao: 'Cobertura de danos causados a terceiros em operações agrícolas.',
      obrigatoria: false
    }
  ],
  campos_cotacao: [
    'Tamanho da propriedade (hectares)',
    'Tipo de cultura/criação',
    'Valor dos equipamentos',
    'Histórico de sinistros',
    'Localização da propriedade',
    'Tipo de operação (mecanizada, manual)'
  ],
  documentos_sinistro: [
    'Fotos do dano aos equipamentos/construções',
    'Relatório de vistoria',
    'Nota fiscal dos equipamentos',
    'Comprovante de orçamento para reparo',
    'Documentação da propriedade (CCIR, ITR)'
  ],
  publico_alvo: [
    'Produtores rurais',
    'Cooperativas agrícolas',
    'Empresas de mecanização agrícola',
    'Investidores em propriedades rurais'
  ]
};

export const PRODUTO_ENGENHARIA: Produto = {
  id: 'engenharia-obra',
  nome: 'Seguro Engenharia - Obras e Instalações',
  marca: 'livo',
  descricao: 'Cobertura completa para obras de construção, instalações e responsabilidade civil de engenharia.',
  seguradora: 'ESSOR Seguros',
  processoSUSEP: '15414.901345/2023-11',
  linkSUSEP: 'https://www2.susep.gov.br/safe/menumercado/REP2/Produtos.aspx/Produtos?pk=05359',
  coberturas: [
    {
      titulo: 'Cobertura de Obra',
      descricao: 'Proteção contra danos à obra em construção.',
      obrigatoria: true
    },
    {
      titulo: 'Responsabilidade Civil',
      descricao: 'Cobertura de danos causados a terceiros durante a obra.',
      obrigatoria: true
    },
    {
      titulo: 'Equipamentos de Obra',
      descricao: 'Proteção de máquinas e equipamentos utilizados na construção.',
      obrigatoria: false
    }
  ],
  campos_cotacao: [
    'Valor total da obra',
    'Tipo de obra (residencial, comercial, industrial)',
    'Prazo de execução',
    'Localização da obra',
    'Número de ART (Anotação de Responsabilidade Técnica)',
    'Histórico de sinistros em obras anteriores'
  ],
  documentos_sinistro: [
    'Fotos do dano à obra',
    'Relatório técnico de avaliação',
    'Orçamento para reparo/reconstrução',
    'Documentação da ART',
    'Cronograma da obra atualizado',
    'Comprovante de gastos com reparos'
  ],
  publico_alvo: [
    'Construtoras',
    'Incorporadoras',
    'Empreiteiras',
    'Engenheiros e arquitetos autônomos',
    'Empresas de instalação'
  ]
};

// Produtos adicionais (Vida, Saúde, Odontológico)
export const PRODUTO_VIDA: Produto = {
  id: 'vida-grupo',
  nome: 'Seguro Vida em Grupo',
  marca: 'livo',
  descricao: 'Proteção de vida para grupos de pessoas, com cobertura de morte, invalidez e assistência.',
  seguradora: 'ESSOR Seguros',
  processoSUSEP: '15414.901346/2023-11',
  linkSUSEP: 'https://www2.susep.gov.br/safe/menumercado/REP2/Produtos.aspx/Produtos?pk=05360',
  coberturas: [
    {
      titulo: 'Morte por Qualquer Causa',
      descricao: 'Indenização aos beneficiários em caso de morte do segurado.',
      obrigatoria: true
    },
    {
      titulo: 'Invalidez Permanente',
      descricao: 'Indenização em caso de invalidez permanente total ou parcial.',
      obrigatoria: true
    },
    {
      titulo: 'Assistência Funeral',
      descricao: 'Cobertura de despesas com funeral.',
      obrigatoria: false
    }
  ],
  campos_cotacao: [
    'Número de participantes',
    'Idade média do grupo',
    'Ramo de atividade',
    'Faturamento anual',
    'Cobertura desejada (valor)',
    'Tipo de beneficiários'
  ],
  documentos_sinistro: [
    'Certidão de óbito',
    'Documentação do beneficiário',
    'Documentação médica (se aplicável)',
    'Comprovante de despesas (funeral)'
  ],
  publico_alvo: [
    'Empresas (seguro de vida para funcionários)',
    'Associações profissionais',
    'Sindicatos',
    'Cooperativas'
  ]
};

export const PRODUTO_SAUDE: Produto = {
  id: 'saude-coletiva',
  nome: 'Seguro Saúde Coletivo',
  marca: 'livo',
  descricao: 'Plano de saúde coletivo com cobertura hospitalar, ambulatorial e odontológica.',
  seguradora: 'ESSOR Seguros',
  processoSUSEP: '15414.901347/2023-11',
  linkSUSEP: 'https://www2.susep.gov.br/safe/menumercado/REP2/Produtos.aspx/Produtos?pk=05361',
  coberturas: [
    {
      titulo: 'Cobertura Hospitalar',
      descricao: 'Internação, cirurgias e tratamentos hospitalares.',
      obrigatoria: true
    },
    {
      titulo: 'Cobertura Ambulatorial',
      descricao: 'Consultas, exames e procedimentos ambulatoriais.',
      obrigatoria: true
    },
    {
      titulo: 'Cobertura Odontológica',
      descricao: 'Procedimentos odontológicos preventivos e restauradores.',
      obrigatoria: false
    }
  ],
  campos_cotacao: [
    'Número de vidas',
    'Idade média dos participantes',
    'Ramo de atividade',
    'Faturamento anual',
    'Cobertura desejada',
    'Histórico de sinistralidade'
  ],
  documentos_sinistro: [
    'Documentação do paciente',
    'Comprovante de atendimento hospitalar/ambulatorial',
    'Recibos de pagamento',
    'Prescrição médica',
    'Exames complementares'
  ],
  publico_alvo: [
    'Empresas (benefício para funcionários)',
    'Associações',
    'Sindicatos',
    'Cooperativas',
    'Grupos de profissionais autônomos'
  ]
};

export const PRODUTO_ODONTOLOGICO: Produto = {
  id: 'odontologico-especializado',
  nome: 'Seguro Odontológico Especializado',
  marca: 'livo',
  descricao: 'Cobertura odontológica completa com procedimentos preventivos, restauradores e estéticos.',
  seguradora: 'ESSOR Seguros',
  processoSUSEP: '15414.901348/2023-11',
  linkSUSEP: 'https://www2.susep.gov.br/safe/menumercado/REP2/Produtos.aspx/Produtos?pk=05362',
  coberturas: [
    {
      titulo: 'Prevenção e Limpeza',
      descricao: 'Limpeza, profilaxia e fluoretação.',
      obrigatoria: true
    },
    {
      titulo: 'Procedimentos Restauradores',
      descricao: 'Restaurações, tratamento de canal e extrações.',
      obrigatoria: true
    },
    {
      titulo: 'Procedimentos Estéticos',
      descricao: 'Clareamento, facetas e implantes.',
      obrigatoria: false
    }
  ],
  campos_cotacao: [
    'Número de beneficiários',
    'Faixa etária predominante',
    'Tipo de cobertura desejada',
    'Faturamento anual',
    'Histórico de sinistralidade',
    'Rede de dentistas preferida'
  ],
  documentos_sinistro: [
    'Documentação do paciente',
    'Comprovante de atendimento odontológico',
    'Recibos de pagamento',
    'Prescrição do dentista',
    'Fotos (para procedimentos estéticos)'
  ],
  publico_alvo: [
    'Empresas (benefício para funcionários)',
    'Profissionais autônomos',
    'Associações profissionais',
    'Sindicatos',
    'Grupos de pessoas físicas'
  ]
};

// Mapa de produtos por ID
export const PRODUTOS_MAP: Record<string, Produto> = {
  [PRODUTO_RCO.id]: PRODUTO_RCO,
  [PRODUTO_SOLAR.id]: PRODUTO_SOLAR,
  [PRODUTO_GARANTIA.id]: PRODUTO_GARANTIA,
  [PRODUTO_AGRO.id]: PRODUTO_AGRO,
  [PRODUTO_ENGENHARIA.id]: PRODUTO_ENGENHARIA,
  [PRODUTO_VIDA.id]: PRODUTO_VIDA,
  [PRODUTO_SAUDE.id]: PRODUTO_SAUDE,
  [PRODUTO_ODONTOLOGICO.id]: PRODUTO_ODONTOLOGICO,
};

// Lista de todos os produtos
export const TODOS_PRODUTOS = [
  PRODUTO_RCO,
  PRODUTO_SOLAR,
  PRODUTO_GARANTIA,
  PRODUTO_AGRO,
  PRODUTO_ENGENHARIA,
  PRODUTO_VIDA,
  PRODUTO_SAUDE,
  PRODUTO_ODONTOLOGICO,
];

// Produtos por marca
export const PRODUTOS_LIVONIUS = [PRODUTO_RCO];
export const PRODUTOS_LIVO = [
  PRODUTO_SOLAR,
  PRODUTO_GARANTIA,
  PRODUTO_AGRO,
  PRODUTO_ENGENHARIA,
  PRODUTO_VIDA,
  PRODUTO_SAUDE,
  PRODUTO_ODONTOLOGICO,
];
