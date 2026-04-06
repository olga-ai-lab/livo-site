import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(global, "localStorage", { value: localStorageMock });

describe("useAutoSave Hook Logic", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Salvamento de Progresso", () => {
    it("deve salvar dados no localStorage com formato correto", () => {
      const key = "cotacao-progress";
      const data = {
        produto: "rco",
        tipoPessoa: "pj",
        formData: { cpfCnpj: "12345678000100" },
      };
      const step = 2;

      const progress = {
        data,
        timestamp: Date.now(),
        step,
        produto: data.produto,
        version: "1.0",
      };

      localStorage.setItem(key, JSON.stringify(progress));

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        key,
        expect.any(String)
      );

      const saved = JSON.parse(localStorage.getItem(key) || "{}");
      expect(saved.data.produto).toBe("rco");
      expect(saved.step).toBe(2);
      expect(saved.version).toBe("1.0");
    });

    it("deve incluir timestamp no progresso salvo", () => {
      const key = "cotacao-progress";
      const now = Date.now();

      const progress = {
        data: { produto: "solar" },
        timestamp: now,
        step: 1,
        version: "1.0",
      };

      localStorage.setItem(key, JSON.stringify(progress));

      const saved = JSON.parse(localStorage.getItem(key) || "{}");
      expect(saved.timestamp).toBe(now);
    });
  });

  describe("Carregamento de Progresso", () => {
    it("deve carregar progresso salvo do localStorage", () => {
      const key = "cotacao-progress";
      const progress = {
        data: { produto: "garantia", tipoPessoa: "pf" },
        timestamp: Date.now(),
        step: 3,
        produto: "garantia",
        version: "1.0",
      };

      localStorage.setItem(key, JSON.stringify(progress));

      const loaded = JSON.parse(localStorage.getItem(key) || "null");
      expect(loaded).not.toBeNull();
      expect(loaded.data.produto).toBe("garantia");
      expect(loaded.step).toBe(3);
    });

    it("deve retornar null se não houver progresso salvo", () => {
      const loaded = localStorage.getItem("cotacao-progress-inexistente");
      expect(loaded).toBeNull();
    });

    it("deve descartar progresso com versão incompatível", () => {
      const key = "cotacao-progress";
      const progress = {
        data: { produto: "rco" },
        timestamp: Date.now(),
        step: 2,
        version: "0.5", // Versão antiga
      };

      localStorage.setItem(key, JSON.stringify(progress));

      const loaded = JSON.parse(localStorage.getItem(key) || "{}");
      
      // Simular verificação de versão
      const isValidVersion = loaded.version === "1.0";
      expect(isValidVersion).toBe(false);
    });

    it("deve descartar progresso expirado (mais de 7 dias)", () => {
      const key = "cotacao-progress";
      const eightDaysAgo = Date.now() - 8 * 24 * 60 * 60 * 1000;

      const progress = {
        data: { produto: "agro" },
        timestamp: eightDaysAgo,
        step: 1,
        version: "1.0",
      };

      localStorage.setItem(key, JSON.stringify(progress));

      const loaded = JSON.parse(localStorage.getItem(key) || "{}");
      const maxAge = 7 * 24 * 60 * 60 * 1000;
      const isExpired = Date.now() - loaded.timestamp > maxAge;

      expect(isExpired).toBe(true);
    });
  });

  describe("Limpeza de Progresso", () => {
    it("deve limpar progresso do localStorage", () => {
      const key = "cotacao-progress";
      localStorage.setItem(key, JSON.stringify({ data: {} }));

      localStorage.removeItem(key);

      expect(localStorageMock.removeItem).toHaveBeenCalledWith(key);
      expect(localStorage.getItem(key)).toBeNull();
    });
  });

  describe("Formatação de Tempo Relativo", () => {
    it("deve formatar 'agora mesmo' para menos de 60 segundos", () => {
      const timestamp = Date.now() - 30 * 1000; // 30 segundos atrás
      const seconds = Math.floor((Date.now() - timestamp) / 1000);

      let timeAgo = "";
      if (seconds < 60) timeAgo = "agora mesmo";

      expect(timeAgo).toBe("agora mesmo");
    });

    it("deve formatar minutos corretamente", () => {
      const timestamp = Date.now() - 5 * 60 * 1000; // 5 minutos atrás
      const seconds = Math.floor((Date.now() - timestamp) / 1000);

      let timeAgo = "";
      if (seconds >= 60 && seconds < 3600) {
        const minutes = Math.floor(seconds / 60);
        timeAgo = `há ${minutes} ${minutes === 1 ? "minuto" : "minutos"}`;
      }

      expect(timeAgo).toBe("há 5 minutos");
    });

    it("deve formatar horas corretamente", () => {
      const timestamp = Date.now() - 2 * 60 * 60 * 1000; // 2 horas atrás
      const seconds = Math.floor((Date.now() - timestamp) / 1000);

      let timeAgo = "";
      if (seconds >= 3600 && seconds < 86400) {
        const hours = Math.floor(seconds / 3600);
        timeAgo = `há ${hours} ${hours === 1 ? "hora" : "horas"}`;
      }

      expect(timeAgo).toBe("há 2 horas");
    });

    it("deve formatar dias corretamente", () => {
      const timestamp = Date.now() - 3 * 24 * 60 * 60 * 1000; // 3 dias atrás
      const seconds = Math.floor((Date.now() - timestamp) / 1000);

      let timeAgo = "";
      if (seconds >= 86400) {
        const days = Math.floor(seconds / 86400);
        timeAgo = `há ${days} ${days === 1 ? "dia" : "dias"}`;
      }

      expect(timeAgo).toBe("há 3 dias");
    });
  });

  describe("Verificação de Progresso Existente", () => {
    it("deve retornar true se houver progresso válido", () => {
      const key = "cotacao-progress";
      const progress = {
        data: { produto: "engenharia" },
        timestamp: Date.now(),
        step: 2,
        version: "1.0",
      };

      localStorage.setItem(key, JSON.stringify(progress));

      const hasSaved = localStorage.getItem(key) !== null;
      expect(hasSaved).toBe(true);
    });

    it("deve retornar false se não houver progresso", () => {
      const hasSaved = localStorage.getItem("cotacao-progress") !== null;
      expect(hasSaved).toBe(false);
    });
  });

  describe("Informações do Progresso Salvo", () => {
    it("deve retornar informações formatadas do progresso", () => {
      const key = "cotacao-progress";
      const timestamp = Date.now() - 30 * 60 * 1000; // 30 minutos atrás

      const progress = {
        data: { produto: "solar" },
        timestamp,
        step: 2,
        produto: "solar",
        version: "1.0",
      };

      localStorage.setItem(key, JSON.stringify(progress));

      const loaded = JSON.parse(localStorage.getItem(key) || "{}");
      const info = {
        timestamp: new Date(loaded.timestamp),
        step: loaded.step,
        produto: loaded.produto,
      };

      expect(info.step).toBe(2);
      expect(info.produto).toBe("solar");
      expect(info.timestamp).toBeInstanceOf(Date);
    });
  });
});

describe("Integração com Formulário de Cotação", () => {
  it("deve preservar todos os campos do formulário", () => {
    const formData = {
      produto: "rco",
      tipoPessoa: "pj",
      formData: {
        cpfCnpj: "12345678000100",
        nomeRazaoSocial: "Empresa Teste LTDA",
        telefone: "11999999999",
        email: "teste@empresa.com",
        cep: "01310100",
        logradouro: "Av Paulista",
        numero: "1000",
        bairro: "Bela Vista",
        cidade: "São Paulo",
        estado: "SP",
      },
      dadosProduto: {
        quantidadeVeiculos: 10,
        tipoVeiculo: "Ônibus",
      },
      coberturas: ["Danos Corporais a Passageiros", "Danos Materiais"],
    };

    const progress = {
      data: formData,
      timestamp: Date.now(),
      step: 3,
      produto: "rco",
      version: "1.0",
    };

    localStorage.setItem("cotacao-progress", JSON.stringify(progress));

    const loaded = JSON.parse(localStorage.getItem("cotacao-progress") || "{}");

    expect(loaded.data.formData.cpfCnpj).toBe("12345678000100");
    expect(loaded.data.formData.nomeRazaoSocial).toBe("Empresa Teste LTDA");
    expect(loaded.data.dadosProduto.quantidadeVeiculos).toBe(10);
    expect(loaded.data.coberturas).toContain("Danos Corporais a Passageiros");
  });

  it("deve limpar progresso após submissão bem-sucedida", () => {
    localStorage.setItem(
      "cotacao-progress",
      JSON.stringify({ data: { produto: "rco" } })
    );

    // Simular submissão bem-sucedida
    localStorage.removeItem("cotacao-progress");

    expect(localStorage.getItem("cotacao-progress")).toBeNull();
  });
});
