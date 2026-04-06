/**
 * Configuração de campos dinâmicos para cotação por tipo de seguro
 * Baseado no Catálogo Completo Livo & Livonius MGA
 */

export type TipoCampo = 'text' | 'email' | 'phone' | 'number' | 'date' | 'select' | 'textarea' | 'file' | 'checkbox';

export interface CampoCotacao {
  id: string;
  label: string;
  tipo: TipoCampo;
  obrigatorio: boolean;
  placeholder?: string;
  opcoes?: { valor: string; label: string }[];
  validacao?: (valor: any) => boolean;
  ajuda?: string;
}

export interface GrupoEtapa {
  id: string;
  titulo: string;
  descricao?: string;
  campos: CampoCotacao[];
}

// ============================================
// RCO/APP - RESPONSABILIDADE CIVIL ÔNIBUS
// ============================================

export const camposRCO: GrupoEtapa[] = [
  {
    id: 'dados-segurado',
    titulo: 'Dados do Segurado',
    descricao: 'Informações da empresa que será segurada',
    campos: [
      {
        id: 'cnpj',
        label: 'CNPJ',
        tipo: 'text',
        obrigatorio: true,
        placeholder: '00.000.000/0000-00',
        validacao: (v) => /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(v),
        ajuda: 'Será consultado automaticamente para preencher dados da empresa'
      },
      {
        id: 'razaoSocial',
        label: 'Razão Social',
        tipo: 'text',
        obrigatorio: true,
        placeholder: 'Nome completo da empresa'
      },
      {
        id: 'nomeFantasia',
        label: 'Nome Fantasia',
        tipo: 'text',
        obrigatorio: false,
        placeholder: 'Nome comercial da empresa'
      },
      {
        id: 'endereco',
        label: 'Endereço Completo',
        tipo: 'text',
        obrigatorio: true,
        placeholder: 'Logradouro, número, bairro, cidade, UF, CEP'
      },
      {
        id: 'contato-nome',
        label: 'Nome do Responsável',
        tipo: 'text',
        obrigatorio: true,
        placeholder: 'Responsável pela cotação'
      },
      {
        id: 'contato-telefone',
        label: 'Telefone',
        tipo: 'phone',
        obrigatorio: true,
        placeholder: '(00) 00000-0000'
      },
      {
        id: 'contato-email',
        label: 'E-mail',
        tipo: 'email',
        obrigatorio: true,
        placeholder: 'email@empresa.com.br'
      }
    ]
  },

  {
    id: 'dados-frota',
    titulo: 'Dados da Frota',
    descricao: 'Informações dos veículos que serão segurados',
    campos: [
      {
        id: 'quantidade-veiculos',
        label: 'Quantidade de Veículos',
        tipo: 'number',
        obrigatorio: true,
        placeholder: '1',
        validacao: (v) => v > 0,
        ajuda: 'Total de veículos na frota'
      },
      {
        id: 'tipo-veiculo',
        label: 'Tipo de Veículo',
        tipo: 'select',
        obrigatorio: true,
        opcoes: [
          { valor: 'onibus', label: 'Ônibus' },
          { valor: 'microonibus', label: 'Micro-ônibus' },
          { valor: 'van', label: 'Van' }
        ],
        ajuda: 'Tipo predominante de veículo na frota'
      },
      {
        id: 'marca-modelo-ano',
        label: 'Marca/Modelo/Ano',
        tipo: 'text',
        obrigatorio: true,
        placeholder: 'Ex: Scania K360 2020'
      },
      {
        id: 'capacidade-media',
        label: 'Capacidade Média (passageiros)',
        tipo: 'number',
        obrigatorio: true,
        placeholder: '50',
        validacao: (v) => v > 0,
        ajuda: 'Número médio de passageiros por veículo'
      },
      {
        id: 'placas-renavam',
        label: 'Placas/RENAVAM',
        tipo: 'textarea',
        obrigatorio: true,
        placeholder: 'Uma placa por linha',
        ajuda: 'Liste as placas de todos os veículos'
      }
    ]
  },

  {
    id: 'dados-operacionais',
    titulo: 'Dados Operacionais',
    descricao: 'Informações sobre a operação e histórico de sinistros',
    campos: [
      {
        id: 'tipo-servico',
        label: 'Tipo de Serviço',
        tipo: 'select',
        obrigatorio: true,
        opcoes: [
          { valor: 'linha-regular', label: 'Linha Regular' },
          { valor: 'fretamento', label: 'Fretamento' },
          { valor: 'turismo', label: 'Turismo' },
          { valor: 'escolar', label: 'Escolar' },
          { valor: 'misto', label: 'Misto' }
        ]
      },
      {
        id: 'abrangencia',
        label: 'Abrangência',
        tipo: 'select',
        obrigatorio: true,
        opcoes: [
          { valor: 'municipal', label: 'Municipal' },
          { valor: 'intermunicipal', label: 'Intermunicipal' },
          { valor: 'interestadual', label: 'Interestadual' },
          { valor: 'internacional', label: 'Internacional' }
        ]
      },
      {
        id: 'regiao-operacao',
        label: 'Região de Operação',
        tipo: 'text',
        obrigatorio: true,
        placeholder: 'Estados e cidades onde opera',
        ajuda: 'Ex: RS, SC, PR - Porto Alegre, Curitiba, São Paulo'
      },
      {
        id: 'sinistros-5anos',
        label: 'Histórico de Sinistros (últimos 5 anos)',
        tipo: 'textarea',
        obrigatorio: false,
        placeholder: 'Quantidade, valores, tipos de sinistros',
        ajuda: 'Descreva sinistros ocorridos nos últimos 5 anos'
      },
      {
        id: 'motoristas-quantidade',
        label: 'Quantidade de Motoristas',
        tipo: 'number',
        obrigatorio: true,
        placeholder: '10',
        validacao: (v) => v > 0
      },
      {
        id: 'treinamento-motoristas',
        label: 'Treinamento de Motoristas',
        tipo: 'checkbox',
        obrigatorio: false,
        ajuda: 'Realiza treinamento periódico de motoristas?'
      }
    ]
  },

  {
    id: 'cobertura-desejada',
    titulo: 'Cobertura Desejada',
    descricao: 'Selecione as coberturas que deseja contratar',
    campos: [
      {
        id: 'cobertura-basica',
        label: 'Cobertura Básica (RCO)',
        tipo: 'checkbox',
        obrigatorio: false,
        ajuda: 'Responsabilidade Civil Ônibus - Cobertura obrigatória'
      },
      {
        id: 'cobertura-app',
        label: 'APP (Acidentes Pessoais Passageiros)',
        tipo: 'checkbox',
        obrigatorio: false,
        ajuda: 'Cobertura adicional para acidentes com passageiros'
      },
      {
        id: 'franquia',
        label: 'Franquia Desejada',
        tipo: 'select',
        obrigatorio: true,
        opcoes: [
          { valor: 'franquia-1000', label: 'R$ 1.000' },
          { valor: 'franquia-2500', label: 'R$ 2.500' },
          { valor: 'franquia-5000', label: 'R$ 5.000' },
          { valor: 'franquia-10000', label: 'R$ 10.000' }
        ]
      },
      {
        id: 'limite-indenizacao',
        label: 'Limite de Indenização',
        tipo: 'select',
        obrigatorio: true,
        opcoes: [
          { valor: 'limite-500k', label: 'R$ 500.000' },
          { valor: 'limite-1m', label: 'R$ 1.000.000' },
          { valor: 'limite-2m', label: 'R$ 2.000.000' },
          { valor: 'limite-5m', label: 'R$ 5.000.000' }
        ]
      }
    ]
  },

  {
    id: 'documentos',
    titulo: 'Documentos',
    descricao: 'Envie os documentos necessários para cotação',
    campos: [
      {
        id: 'contrato-social',
        label: 'Contrato Social',
        tipo: 'file',
        obrigatorio: true,
        ajuda: 'PDF do contrato social da empresa'
      },
      {
        id: 'cnae',
        label: 'CNAE',
        tipo: 'file',
        obrigatorio: false,
        ajuda: 'Comprovante de CNAE'
      },
      {
        id: 'apolicacasco',
        label: 'Apólice de Casco (se houver)',
        tipo: 'file',
        obrigatorio: false,
        ajuda: 'Apólice de casco dos veículos'
      }
    ]
  }
];

// ============================================
// MAPEAMENTO DE PRODUTOS
// ============================================

export const camposPorProduto: Record<string, GrupoEtapa[]> = {
  rco: camposRCO
};
