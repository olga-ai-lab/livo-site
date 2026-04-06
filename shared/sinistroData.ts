/**
 * Dados específicos de sinistros por tipo de seguro
 * Baseado na documentação de produtos Livonius e Livo MGA
 */

export interface CampoSinistro {
  nome: string;
  label: string;
  tipo: "text" | "email" | "tel" | "date" | "time" | "number" | "select" | "textarea";
  obrigatorio: boolean;
  placeholder?: string;
  opcoes?: Array<{ valor: string; label: string }>;
  validacao?: (valor: string) => boolean;
}

export interface DadosSinistroTipo {
  campos: CampoSinistro[];
  documentos: Array<{ tipo: string; obrigatorio: boolean; descricao: string }>;
  descricao: string;
}

export const sinistrosPorTipo: Record<string, DadosSinistroTipo> = {
  // RCO - LIVONIUS
  rco_material: {
    descricao: "Sinistro RCO - Dano Material",
    campos: [
      {
        nome: "placaVeiculo",
        label: "Placa do Veículo",
        tipo: "text",
        obrigatorio: true,
        placeholder: "ABC-1234",
        validacao: (v) => /^[A-Z]{3}-\d{4}$/.test(v),
      },
      {
        nome: "marcaModeloVeiculo",
        label: "Marca e Modelo",
        tipo: "text",
        obrigatorio: true,
        placeholder: "Ex: Mercedes-Benz OF-1721",
      },
      {
        nome: "anoVeiculo",
        label: "Ano de Fabricação",
        tipo: "number",
        obrigatorio: true,
        placeholder: "2020",
      },
      {
        nome: "chassiVeiculo",
        label: "Número do Chassi",
        tipo: "text",
        obrigatorio: true,
        placeholder: "9BWHE21JX24000001",
      },
      {
        nome: "nomeCondutor",
        label: "Nome do Condutor",
        tipo: "text",
        obrigatorio: true,
        placeholder: "João da Silva",
      },
      {
        nome: "cnhCondutor",
        label: "Número da CNH",
        tipo: "text",
        obrigatorio: true,
        placeholder: "1234567890",
      },
      {
        nome: "tipoVeiculo",
        label: "Tipo de Veículo",
        tipo: "select",
        obrigatorio: true,
        opcoes: [
          { valor: "onibus", label: "Ônibus" },
          { valor: "microonibus", label: "Microônibus" },
          { valor: "van", label: "Van" },
          { valor: "caminhao", label: "Caminhão" },
        ],
      },
      {
        nome: "tipoAcidente",
        label: "Tipo de Acidente",
        tipo: "select",
        obrigatorio: true,
        opcoes: [
          { valor: "colisao", label: "Colisão" },
          { valor: "capotamento", label: "Capotamento" },
          { valor: "atropelamento", label: "Atropelamento" },
          { valor: "queda_objeto", label: "Queda de Objeto" },
          { valor: "incendio", label: "Incêndio" },
          { valor: "outro", label: "Outro" },
        ],
      },
      {
        nome: "localExato",
        label: "Local Exato do Acidente",
        tipo: "textarea",
        obrigatorio: true,
        placeholder: "Rua, número, cidade, estado, referências",
      },
      {
        nome: "testemunhas",
        label: "Testemunhas (nomes e contatos)",
        tipo: "textarea",
        obrigatorio: false,
        placeholder: "Nome, telefone, email",
      },
    ],
    documentos: [
      { tipo: "boletim_ocorrencia", obrigatorio: true, descricao: "Boletim de Ocorrência" },
      { tipo: "cnh_motorista", obrigatorio: true, descricao: "CNH do Motorista" },
      { tipo: "fotos_danos", obrigatorio: true, descricao: "Fotos dos Danos (mínimo 5)" },
      { tipo: "orcamentos", obrigatorio: true, descricao: "3 Orçamentos de Reparo" },
      { tipo: "nota_fiscal", obrigatorio: false, descricao: "Nota Fiscal do Bem Danificado" },
      { tipo: "comprovante_seguro", obrigatorio: true, descricao: "Comprovante do Seguro" },
    ],
  },

  rco_corporal: {
    descricao: "Sinistro RCO - Dano Corporal",
    campos: [
      {
        nome: "placaVeiculo",
        label: "Placa do Veículo",
        tipo: "text",
        obrigatorio: true,
        placeholder: "ABC-1234",
      },
      {
        nome: "nomeCondutor",
        label: "Nome do Condutor",
        tipo: "text",
        obrigatorio: true,
        placeholder: "João da Silva",
      },
      {
        nome: "cnhCondutor",
        label: "Número da CNH",
        tipo: "text",
        obrigatorio: true,
        placeholder: "1234567890",
      },
      {
        nome: "numeroVitimas",
        label: "Número de Vítimas",
        tipo: "number",
        obrigatorio: true,
        placeholder: "1",
      },
      {
        nome: "nomeVitima",
        label: "Nome da(s) Vítima(s)",
        tipo: "textarea",
        obrigatorio: true,
        placeholder: "Um nome por linha",
      },
      {
        nome: "tipoLesao",
        label: "Tipo de Lesão",
        tipo: "select",
        obrigatorio: true,
        opcoes: [
          { valor: "leve", label: "Leve (ferimentos superficiais)" },
          { valor: "moderada", label: "Moderada (fraturas, contusões)" },
          { valor: "grave", label: "Grave (internação)" },
          { valor: "fatal", label: "Fatal" },
        ],
      },
      {
        nome: "localAtendimento",
        label: "Local de Atendimento Médico",
        tipo: "text",
        obrigatorio: true,
        placeholder: "Hospital/Clínica",
      },
    ],
    documentos: [
      { tipo: "boletim_ocorrencia", obrigatorio: true, descricao: "Boletim de Ocorrência" },
      { tipo: "cnh_motorista", obrigatorio: true, descricao: "CNH do Motorista" },
      { tipo: "laudo_medico", obrigatorio: true, descricao: "Laudo Médico / Atestado" },
      { tipo: "documentos_vitima", obrigatorio: true, descricao: "RG e CPF da Vítima" },
      { tipo: "comprovante_despesas", obrigatorio: false, descricao: "Comprovantes de Despesas Médicas" },
      { tipo: "relatorio_hospitalar", obrigatorio: false, descricao: "Relatório Hospitalar" },
    ],
  },

  // SOLAR - LIVO
  solar: {
    descricao: "Sinistro Energia Solar",
    campos: [
      {
        nome: "potenciaInstalada",
        label: "Potência Instalada (kWp)",
        tipo: "number",
        obrigatorio: true,
        placeholder: "10.5",
      },
      {
        nome: "dataInstalacao",
        label: "Data de Instalação",
        tipo: "date",
        obrigatorio: true,
      },
      {
        nome: "tipoEquipamento",
        label: "Equipamento Danificado",
        tipo: "select",
        obrigatorio: true,
        opcoes: [
          { valor: "paineis", label: "Painéis Solares" },
          { valor: "inversor", label: "Inversor" },
          { valor: "estrutura", label: "Estrutura de Suporte" },
          { valor: "cabeamento", label: "Cabeamento" },
          { valor: "multiplos", label: "Múltiplos Equipamentos" },
        ],
      },
      {
        nome: "causaSinistro",
        label: "Causa do Sinistro",
        tipo: "select",
        obrigatorio: true,
        opcoes: [
          { valor: "tempestade", label: "Tempestade/Raio" },
          { valor: "granizo", label: "Granizo" },
          { valor: "vento", label: "Vento Forte" },
          { valor: "acidente", label: "Acidente" },
          { valor: "defeito_fabricacao", label: "Defeito de Fabricação" },
          { valor: "outro", label: "Outro" },
        ],
      },
      {
        nome: "producaoAfetada",
        label: "Produção Afetada (%)",
        tipo: "number",
        obrigatorio: true,
        placeholder: "50",
      },
    ],
    documentos: [
      { tipo: "boletim_ocorrencia", obrigatorio: false, descricao: "Boletim de Ocorrência (se aplicável)" },
      { tipo: "fotos_danos", obrigatorio: true, descricao: "Fotos dos Equipamentos Danificados" },
      { tipo: "laudo_tecnico", obrigatorio: true, descricao: "Laudo Técnico do Sistema" },
      { tipo: "nota_fiscal_equipamentos", obrigatorio: true, descricao: "Nota Fiscal dos Equipamentos" },
      { tipo: "orcamentos", obrigatorio: true, descricao: "Orçamentos de Reparo/Substituição" },
      { tipo: "relatorio_producao", obrigatorio: false, descricao: "Relatório de Produção" },
    ],
  },

  // GARANTIA - LIVO
  garantia: {
    descricao: "Sinistro Seguro Garantia",
    campos: [
      {
        nome: "tipoGarantia",
        label: "Tipo de Garantia",
        tipo: "select",
        obrigatorio: true,
        opcoes: [
          { valor: "contratual", label: "Garantia Contratual" },
          { valor: "judicial", label: "Garantia Judicial" },
          { valor: "licitacao", label: "Garantia de Licitação" },
        ],
      },
      {
        nome: "valorGarantido",
        label: "Valor Garantido (R$)",
        tipo: "number",
        obrigatorio: true,
        placeholder: "100000",
      },
      {
        nome: "dataVencimento",
        label: "Data de Vencimento",
        tipo: "date",
        obrigatorio: true,
      },
      {
        nome: "nomeContratante",
        label: "Nome do Contratante",
        tipo: "text",
        obrigatorio: true,
        placeholder: "Empresa XYZ",
      },
      {
        nome: "nomeContratado",
        label: "Nome do Contratado",
        tipo: "text",
        obrigatorio: true,
        placeholder: "Empresa ABC",
      },
      {
        nome: "motivoSinistro",
        label: "Motivo da Reclamação",
        tipo: "textarea",
        obrigatorio: true,
        placeholder: "Descreva o motivo da inadimplência",
      },
    ],
    documentos: [
      { tipo: "contrato", obrigatorio: true, descricao: "Contrato Garantido" },
      { tipo: "notificacao_inadimplencia", obrigatorio: true, descricao: "Notificação de Inadimplência" },
      { tipo: "documentos_cobranca", obrigatorio: true, descricao: "Documentos de Cobrança" },
      { tipo: "comprovante_pagamentos", obrigatorio: false, descricao: "Comprovantes de Pagamentos Realizados" },
      { tipo: "sentenca_judicial", obrigatorio: false, descricao: "Sentença Judicial (se aplicável)" },
    ],
  },

  // AGRO - LIVO
  agro: {
    descricao: "Sinistro Penhor Rural",
    campos: [
      {
        nome: "tipoColheita",
        label: "Tipo de Colheita",
        tipo: "select",
        obrigatorio: true,
        opcoes: [
          { valor: "soja", label: "Soja" },
          { valor: "milho", label: "Milho" },
          { valor: "trigo", label: "Trigo" },
          { valor: "algodao", label: "Algodão" },
          { valor: "cana", label: "Cana-de-Açúcar" },
          { valor: "outro", label: "Outro" },
        ],
      },
      {
        nome: "areaAfetada",
        label: "Área Afetada (hectares)",
        tipo: "number",
        obrigatorio: true,
        placeholder: "100",
      },
      {
        nome: "producaoEstimada",
        label: "Produção Estimada (sacas/toneladas)",
        tipo: "number",
        obrigatorio: true,
        placeholder: "5000",
      },
      {
        nome: "causaSinistro",
        label: "Causa do Sinistro",
        tipo: "select",
        obrigatorio: true,
        opcoes: [
          { valor: "seca", label: "Seca" },
          { valor: "chuva_excessiva", label: "Chuva Excessiva" },
          { valor: "geada", label: "Geada" },
          { valor: "granizo", label: "Granizo" },
          { valor: "praga", label: "Praga/Doença" },
          { valor: "outro", label: "Outro" },
        ],
      },
      {
        nome: "perdaEstimada",
        label: "Perda Estimada (%)",
        tipo: "number",
        obrigatorio: true,
        placeholder: "50",
      },
      {
        nome: "localizacaoPropriedade",
        label: "Localização da Propriedade",
        tipo: "text",
        obrigatorio: true,
        placeholder: "Município, Estado",
      },
    ],
    documentos: [
      { tipo: "boletim_ocorrencia", obrigatorio: false, descricao: "Boletim de Ocorrência (se aplicável)" },
      { tipo: "laudo_vistoria", obrigatorio: true, descricao: "Laudo de Vistoria" },
      { tipo: "fotos_danos", obrigatorio: true, descricao: "Fotos dos Danos" },
      { tipo: "nota_fiscal_produtos", obrigatorio: true, descricao: "Nota Fiscal dos Produtos/Equipamentos" },
      { tipo: "relatorio_producao", obrigatorio: false, descricao: "Relatório de Produção" },
      { tipo: "comprovante_propriedade", obrigatorio: true, descricao: "Comprovante de Propriedade (CCIR)" },
    ],
  },

  // ENGENHARIA - LIVO
  engenharia: {
    descricao: "Sinistro Riscos de Engenharia",
    campos: [
      {
        nome: "tipoObra",
        label: "Tipo de Obra",
        tipo: "select",
        obrigatorio: true,
        opcoes: [
          { valor: "construcao", label: "Construção Civil" },
          { valor: "reforma", label: "Reforma" },
          { valor: "ampliacao", label: "Ampliação" },
          { valor: "infraestrutura", label: "Infraestrutura" },
          { valor: "industrial", label: "Industrial" },
        ],
      },
      {
        nome: "valorObra",
        label: "Valor Total da Obra (R$)",
        tipo: "number",
        obrigatorio: true,
        placeholder: "500000",
      },
      {
        nome: "percentualConclusao",
        label: "Percentual de Conclusão (%)",
        tipo: "number",
        obrigatorio: true,
        placeholder: "50",
      },
      {
        nome: "responsavelTecnico",
        label: "Responsável Técnico",
        tipo: "text",
        obrigatorio: true,
        placeholder: "Nome do Engenheiro",
      },
      {
        nome: "numeroART",
        label: "Número da ART/RRT",
        tipo: "text",
        obrigatorio: false,
        placeholder: "1234567890",
      },
      {
        nome: "tipoSinistro",
        label: "Tipo de Sinistro",
        tipo: "select",
        obrigatorio: true,
        opcoes: [
          { valor: "colapso", label: "Colapso Estrutural" },
          { valor: "incendio", label: "Incêndio" },
          { valor: "explosao", label: "Explosão" },
          { valor: "danos_terceiros", label: "Danos a Terceiros" },
          { valor: "outro", label: "Outro" },
        ],
      },
      {
        nome: "descricaoSinistro",
        label: "Descrição Detalhada",
        tipo: "textarea",
        obrigatorio: true,
        placeholder: "Descreva o sinistro em detalhes",
      },
    ],
    documentos: [
      { tipo: "boletim_ocorrencia", obrigatorio: true, descricao: "Boletim de Ocorrência" },
      { tipo: "laudo_tecnico", obrigatorio: true, descricao: "Laudo Técnico de Engenharia" },
      { tipo: "fotos_danos", obrigatorio: true, descricao: "Fotos dos Danos" },
      { tipo: "cronograma_obra", obrigatorio: true, descricao: "Cronograma da Obra" },
      { tipo: "orcamentos", obrigatorio: true, descricao: "Orçamentos de Reparo" },
      { tipo: "art_rrt", obrigatorio: false, descricao: "ART/RRT do Responsável Técnico" },
      { tipo: "projeto_original", obrigatorio: true, descricao: "Projeto Original da Obra" },
    ],
  },
};

export function getDadosSinistro(produto: string, tipoDano?: string): DadosSinistroTipo | null {
  const chave = tipoDano ? `${produto}_${tipoDano}` : produto;
  return sinistrosPorTipo[chave] || null;
}
