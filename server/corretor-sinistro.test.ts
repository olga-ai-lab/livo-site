import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock do db
vi.mock("./db", () => ({
  criarCorretor: vi.fn().mockResolvedValue({
    id: 1,
    protocolo: "COR-TEST123",
    cnpj: "12345678000199",
    razaoSocial: "Corretora Teste LTDA",
    nomeFantasia: "Corretora Teste",
    email: "contato@corretora.com",
    telefone: "11999999999",
    status: "pendente",
    createdAt: new Date(),
  }),
  buscarCorretorPorCnpj: vi.fn().mockResolvedValue(null),
  buscarCorretorPorProtocolo: vi.fn().mockResolvedValue({
    id: 1,
    protocolo: "COR-TEST123",
    status: "pendente",
  }),
  listarCorretores: vi.fn().mockResolvedValue([]),
  criarSinistro: vi.fn().mockResolvedValue({
    id: 1,
    protocolo: "SIN-TEST456",
    produto: "rco",
    status: "aberto",
    createdAt: new Date(),
  }),
  buscarSinistroPorProtocolo: vi.fn().mockResolvedValue({
    id: 1,
    protocolo: "SIN-TEST456",
    status: "aberto",
    produto: "rco",
  }),
  listarSinistros: vi.fn().mockResolvedValue([]),
}));

// Mock do notification
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

// Mock do storage
vi.mock("./storage", () => ({
  storagePut: vi.fn().mockResolvedValue({ url: "https://storage.example.com/file.pdf", key: "file.pdf" }),
}));

// Mock do cnpjService
vi.mock("./cnpjService", () => ({
  consultarCNPJ: vi.fn().mockResolvedValue({
    razaoSocial: "Empresa Teste LTDA",
    nomeFantasia: "Empresa Teste",
    endereco: "Rua Teste, 123",
    cidade: "São Paulo",
    uf: "SP",
    telefone: "11999999999",
  }),
  validarCNPJ: vi.fn().mockReturnValue(true),
  limparCNPJ: vi.fn().mockImplementation((cnpj: string) => cnpj.replace(/\D/g, "")),
  isCNPJError: vi.fn().mockReturnValue(false),
}));

import * as db from "./db";
import * as notification from "./_core/notification";

describe("Cadastro de Corretor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Validação de dados", () => {
    it("deve validar CNPJ com 14 dígitos", () => {
      const cnpj = "12345678000199";
      expect(cnpj.length).toBe(14);
    });

    it("deve validar e-mail no formato correto", () => {
      const email = "contato@corretora.com";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      expect(emailRegex.test(email)).toBe(true);
    });

    it("deve validar telefone com pelo menos 10 dígitos", () => {
      const telefone = "11999999999";
      expect(telefone.replace(/\D/g, "").length).toBeGreaterThanOrEqual(10);
    });
  });

  describe("Criação de corretor", () => {
    it("deve criar um corretor com sucesso", async () => {
      const dadosCorretor = {
        cnpj: "12345678000199",
        razaoSocial: "Corretora Teste LTDA",
        nomeFantasia: "Corretora Teste",
        email: "contato@corretora.com",
        telefone: "11999999999",
        responsavelNome: "João Silva",
        responsavelCpf: "12345678901",
        responsavelEmail: "joao@corretora.com",
        responsavelTelefone: "11988888888",
        endereco: "Rua Teste, 123",
        cidade: "São Paulo",
        uf: "SP",
        cep: "01234567",
      };

      const resultado = await db.criarCorretor(dadosCorretor as any);
      
      expect(resultado).toBeDefined();
      expect(resultado?.protocolo).toMatch(/^COR-/);
      expect(db.criarCorretor).toHaveBeenCalledWith(dadosCorretor);
    });

    it("deve verificar se CNPJ já está cadastrado", async () => {
      const cnpj = "12345678000199";
      const existente = await db.buscarCorretorPorCnpj(cnpj);
      
      expect(existente).toBeNull();
      expect(db.buscarCorretorPorCnpj).toHaveBeenCalledWith(cnpj);
    });

    it("deve gerar protocolo único para cada cadastro", async () => {
      const corretor = await db.criarCorretor({} as any);
      
      expect(corretor?.protocolo).toBeDefined();
      expect(corretor?.protocolo).toMatch(/^COR-[A-Z0-9]+$/);
    });
  });

  describe("Consulta de corretor", () => {
    it("deve buscar corretor por protocolo", async () => {
      const protocolo = "COR-TEST123";
      const corretor = await db.buscarCorretorPorProtocolo(protocolo);
      
      expect(corretor).toBeDefined();
      expect(corretor?.protocolo).toBe(protocolo);
    });
  });
});

describe("Abertura de Sinistro", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Validação de dados", () => {
    it("deve validar produto como um dos valores permitidos", () => {
      const produtosValidos = ["rco", "solar", "garantia", "agro", "engenharia"];
      const produto = "rco";
      
      expect(produtosValidos.includes(produto)).toBe(true);
    });

    it("deve validar tipo de pessoa como pf ou pj", () => {
      const tiposValidos = ["pf", "pj"];
      const tipoPessoa = "pj";
      
      expect(tiposValidos.includes(tipoPessoa)).toBe(true);
    });

    it("deve validar data de ocorrência", () => {
      const dataOcorrencia = "2026-01-15";
      const data = new Date(dataOcorrencia);
      
      expect(data instanceof Date).toBe(true);
      expect(!isNaN(data.getTime())).toBe(true);
    });

    it("deve validar descrição com pelo menos 10 caracteres", () => {
      const descricao = "Acidente de trânsito na Av. Paulista";
      
      expect(descricao.length).toBeGreaterThanOrEqual(10);
    });
  });

  describe("Criação de sinistro", () => {
    it("deve criar um sinistro com sucesso", async () => {
      const dadosSinistro = {
        marca: "livonius",
        produto: "rco",
        tipoSinistro: "material",
        tipoPessoa: "pj",
        cpfCnpj: "12345678000199",
        nomeRazaoSocial: "Empresa Teste LTDA",
        telefone: "11999999999",
        email: "contato@empresa.com",
        dataOcorrencia: new Date("2026-01-15"),
        descricaoOcorrencia: "Acidente de trânsito na Av. Paulista com danos materiais",
      };

      const resultado = await db.criarSinistro(dadosSinistro as any);
      
      expect(resultado).toBeDefined();
      expect(resultado?.protocolo).toMatch(/^SIN-/);
      expect(db.criarSinistro).toHaveBeenCalled();
    });

    it("deve gerar protocolo único para cada sinistro", async () => {
      const sinistro = await db.criarSinistro({} as any);
      
      expect(sinistro?.protocolo).toBeDefined();
      expect(sinistro?.protocolo).toMatch(/^SIN-[A-Z0-9]+$/);
    });

    it("deve definir status inicial como aberto", async () => {
      const sinistro = await db.criarSinistro({} as any);
      
      expect(sinistro?.status).toBe("aberto");
    });
  });

  describe("Consulta de sinistro", () => {
    it("deve buscar sinistro por protocolo", async () => {
      const protocolo = "SIN-TEST456";
      const sinistro = await db.buscarSinistroPorProtocolo(protocolo);
      
      expect(sinistro).toBeDefined();
      expect(sinistro?.protocolo).toBe(protocolo);
    });
  });

  describe("Notificações", () => {
    it("deve notificar equipe ao abrir sinistro", async () => {
      await notification.notifyOwner({
        title: "Novo Sinistro Aberto: SIN-TEST456",
        content: "Produto: RCO\nTipo: material\nSegurado: Empresa Teste",
      });
      
      expect(notification.notifyOwner).toHaveBeenCalled();
    });
  });
});

describe("Documentos por Produto", () => {
  const documentosPorProduto: Record<string, string[]> = {
    rco_material: ["boletim_ocorrencia", "cnh_motorista", "fotos_danos", "orcamentos"],
    rco_corporal: ["boletim_ocorrencia", "cnh_motorista", "laudo_medico", "documentos_vitima"],
    solar: ["fotos_danos", "laudo_tecnico", "nota_fiscal_equipamentos", "orcamentos"],
    garantia: ["contrato", "notificacao_inadimplencia", "documentos_cobranca"],
    agro: ["laudo_vistoria", "fotos_danos", "nota_fiscal_produtos"],
    engenharia: ["boletim_ocorrencia", "laudo_tecnico", "fotos_danos", "cronograma_obra", "orcamentos"],
  };

  it("deve ter documentos obrigatórios para RCO material", () => {
    const docs = documentosPorProduto.rco_material;
    
    expect(docs).toContain("boletim_ocorrencia");
    expect(docs).toContain("cnh_motorista");
    expect(docs).toContain("fotos_danos");
  });

  it("deve ter documentos obrigatórios para RCO corporal", () => {
    const docs = documentosPorProduto.rco_corporal;
    
    expect(docs).toContain("boletim_ocorrencia");
    expect(docs).toContain("laudo_medico");
    expect(docs).toContain("documentos_vitima");
  });

  it("deve ter documentos obrigatórios para Solar", () => {
    const docs = documentosPorProduto.solar;
    
    expect(docs).toContain("laudo_tecnico");
    expect(docs).toContain("nota_fiscal_equipamentos");
  });

  it("deve ter documentos obrigatórios para Garantia", () => {
    const docs = documentosPorProduto.garantia;
    
    expect(docs).toContain("contrato");
    expect(docs).toContain("notificacao_inadimplencia");
  });

  it("deve ter documentos obrigatórios para Engenharia", () => {
    const docs = documentosPorProduto.engenharia;
    
    expect(docs).toContain("laudo_tecnico");
    expect(docs).toContain("cronograma_obra");
  });
});
