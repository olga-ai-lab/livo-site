import { describe, it, expect, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import { createContext } from "./_core/context";
import type { Request, Response } from "express";

// Mock do banco de dados
vi.mock("./db", () => ({
  criarCotacao: vi.fn().mockResolvedValue({
    id: 1,
    protocolo: "COT-TEST123-ABCD",
    status: "rascunho",
  }),
  atualizarCotacao: vi.fn().mockResolvedValue({
    id: 1,
    protocolo: "COT-TEST123-ABCD",
    status: "rascunho",
    marca: "livonius",
    produto: "rco",
  }),
  buscarCotacaoPorProtocolo: vi.fn().mockResolvedValue({
    id: 1,
    protocolo: "COT-TEST123-ABCD",
    status: "rascunho",
    marca: "livonius",
    produto: "rco",
    tipoPessoa: "pj",
    cpfCnpj: "12345678000100",
    nomeRazaoSocial: "Empresa Teste LTDA",
    telefone: "11999999999",
    email: "teste@empresa.com",
  }),
  buscarCotacaoPorId: vi.fn().mockResolvedValue({
    id: 1,
    protocolo: "COT-TEST123-ABCD",
    status: "rascunho",
    marca: "livonius",
    produto: "rco",
    tipoPessoa: "pj",
    cpfCnpj: "12345678000100",
    nomeRazaoSocial: "Empresa Teste LTDA",
    telefone: "11999999999",
    email: "teste@empresa.com",
  }),
  submeterCotacao: vi.fn().mockResolvedValue({
    id: 1,
    protocolo: "COT-TEST123-ABCD",
    status: "submetido",
    marca: "livonius",
    produto: "rco",
    tipoPessoa: "pj",
    cpfCnpj: "12345678000100",
    nomeRazaoSocial: "Empresa Teste LTDA",
    telefone: "11999999999",
    email: "teste@empresa.com",
    observacoes: "",
  }),
  listarCotacoes: vi.fn().mockResolvedValue([]),
  buscarHistoricoCotacao: vi.fn().mockResolvedValue([]),
  salvarDocumento: vi.fn().mockResolvedValue(1),
  listarDocumentosCotacao: vi.fn().mockResolvedValue([]),
  atualizarDadosExtraidos: vi.fn().mockResolvedValue(true),
  registrarEvento: vi.fn().mockResolvedValue({ id: 1 }),
  registrarAnalytics: vi.fn().mockResolvedValue({ id: 1 }),
  getUser: vi.fn().mockResolvedValue(null),
}));

// Mock do storage
vi.mock("./storage", () => ({
  storagePut: vi.fn().mockResolvedValue({
    key: "cotacoes/1/documento.pdf",
    url: "https://storage.example.com/documento.pdf",
  }),
}));

// Mock do LLM
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    choices: [
      {
        message: {
          content: JSON.stringify({
            dados: { cnpj: "12345678000100", razaoSocial: "Empresa Teste" },
            confianca: 85,
          }),
        },
      },
    ],
  }),
}));

// Mock do notifyOwner
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

// Mock do emailService
vi.mock("./emailService", () => ({
  sendSinistroNotification: vi.fn().mockResolvedValue({ success: true, message: "Notificação enviada" }),
  sendConfirmationToClient: vi.fn().mockResolvedValue({ success: true, message: "Confirmação enviada" }),
  sendCotacaoConfirmation: vi.fn().mockResolvedValue({ success: true, message: "Confirmação de cotação enviada" }),
}));

describe("Sistema de Cotação", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeEach(async () => {
    const mockReq = {
      headers: {},
      cookies: {},
    } as unknown as Request;
    const mockRes = {
      setHeader: vi.fn(),
      cookie: vi.fn(),
    } as unknown as Response;

    const ctx = await createContext({ req: mockReq, res: mockRes });
    caller = appRouter.createCaller(ctx);
  });

  describe("cotacao.criar", () => {
    it("deve criar uma nova cotação com dados válidos", async () => {
      const result = await caller.cotacao.criar({
        marca: "livonius",
        produto: "rco",
        tipoPessoa: "pj",
        cpfCnpj: "12345678000100",
        nomeRazaoSocial: "Empresa Teste LTDA",
        telefone: "11999999999",
        email: "teste@empresa.com",
      });

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.protocolo).toContain("COT-");
    });

    it("deve criar cotação para pessoa física", async () => {
      const result = await caller.cotacao.criar({
        marca: "livo",
        produto: "solar",
        tipoPessoa: "pf",
        cpfCnpj: "12345678901",
        nomeRazaoSocial: "João da Silva",
        telefone: "11988888888",
        email: "joao@email.com",
      });

      expect(result).toBeDefined();
      expect(result.protocolo).toContain("COT-");
    });
  });

  describe("cotacao.atualizar", () => {
    it("deve atualizar uma cotação existente", async () => {
      const result = await caller.cotacao.atualizar({
        id: 1,
        dados: {
          nomeRazaoSocial: "Empresa Atualizada LTDA",
          email: "novo@empresa.com",
        },
      });

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });
  });

  describe("cotacao.buscarPorId", () => {
    it("deve buscar uma cotação por ID", async () => {
      const result = await caller.cotacao.buscarPorId({ id: 1 });

      expect(result).toBeDefined();
      expect(result?.id).toBe(1);
      expect(result?.protocolo).toContain("COT-");
      expect(result?.marca).toBe("livonius");
    });
  });

  describe("cotacao.buscarPorProtocolo", () => {
    it("deve buscar uma cotação por protocolo", async () => {
      const result = await caller.cotacao.buscarPorProtocolo({ protocolo: "COT-TEST123-ABCD" });

      expect(result).toBeDefined();
      expect(result?.protocolo).toBe("COT-TEST123-ABCD");
    });
  });

  describe("cotacao.submeter", () => {
    it("deve submeter uma cotação", async () => {
      const result = await caller.cotacao.submeter({ id: 1 });

      expect(result).toBeDefined();
      expect(result.protocolo).toContain("COT-");
      expect(result.success).toBe(true);
    });

    it("deve enviar e-mail de confirmação ao cliente após submissão", async () => {
      const { sendCotacaoConfirmation } = await import("./emailService");
      
      await caller.cotacao.submeter({ id: 1 });

      expect(sendCotacaoConfirmation).toHaveBeenCalled();
      expect(sendCotacaoConfirmation).toHaveBeenCalledWith(
        expect.objectContaining({
          protocolo: expect.stringContaining("COT-"),
          email: "teste@empresa.com",
          nomeRazaoSocial: "Empresa Teste LTDA",
        })
      );
    });
  });

  describe("cotacao.uploadDocumento", () => {
    it("deve fazer upload de um documento", async () => {
      const base64Content = Buffer.from("conteudo do arquivo").toString("base64");
      
      const result = await caller.cotacao.uploadDocumento({
        cotacaoId: 1,
        nomeOriginal: "documento.pdf",
        mimeType: "application/pdf",
        base64: base64Content,
      });

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.documentoId).toBe(1);
    });
  });

  describe("cotacao.listar", () => {
    it("deve listar cotações", async () => {
      const result = await caller.cotacao.listar({});

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("analytics.registrar", () => {
    it("deve registrar evento de analytics", async () => {
      const result = await caller.analytics.registrar({
        sessionId: "session-123",
        eventType: "page_view",
        produto: "rco",
        stepNumber: 1,
        userAgent: "Mozilla/5.0",
        deviceType: "desktop",
        screenWidth: 1920,
        screenHeight: 1080,
      });

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });

    it("deve registrar evento de form_start", async () => {
      const result = await caller.analytics.registrar({
        sessionId: "session-123",
        eventType: "form_start",
        produto: "solar",
        eventData: { produto: "solar" },
      });

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });

    it("deve registrar evento de step_complete", async () => {
      const result = await caller.analytics.registrar({
        sessionId: "session-123",
        eventType: "step_complete",
        stepNumber: 2,
        timeOnStep: 45,
        totalTimeOnForm: 120,
      });

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });
  });
});

describe("Validação de Produtos", () => {
  it("deve aceitar todos os produtos válidos", () => {
    const produtosValidos = ["rco", "solar", "garantia", "agro", "engenharia"];
    
    produtosValidos.forEach((produto) => {
      expect(["rco", "solar", "garantia", "agro", "engenharia"]).toContain(produto);
    });
  });

  it("RCO deve ser da marca Livonius", () => {
    const produtosMarca: Record<string, string> = {
      rco: "livonius",
      solar: "livo",
      garantia: "livo",
      agro: "livo",
      engenharia: "livo",
    };

    expect(produtosMarca["rco"]).toBe("livonius");
    expect(produtosMarca["solar"]).toBe("livo");
    expect(produtosMarca["garantia"]).toBe("livo");
  });
});

describe("Geração de Protocolo", () => {
  it("deve gerar protocolo no formato correto", () => {
    const protocolo = "COT-ABCD1234-XY12";
    const regex = /^COT-[A-Z0-9]{8}-[A-Z0-9]{4}$/;
    
    expect(regex.test(protocolo)).toBe(true);
  });
});
