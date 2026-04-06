import { describe, it, expect, vi, beforeEach } from "vitest";
import { limparCNPJ, validarCNPJ, consultarCNPJ, isCNPJError } from "./cnpjService";

// Mock axios
vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
    isAxiosError: (error: any) => error?.isAxiosError === true,
  },
}));

import axios from "axios";

describe("CNPJ Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("limparCNPJ", () => {
    it("deve remover pontos, barras e hífens", () => {
      expect(limparCNPJ("12.345.678/0001-99")).toBe("12345678000199");
    });

    it("deve retornar apenas números", () => {
      expect(limparCNPJ("12-345-678/0001-99")).toBe("12345678000199");
    });

    it("deve lidar com string já limpa", () => {
      expect(limparCNPJ("12345678000199")).toBe("12345678000199");
    });

    it("deve retornar string vazia para entrada vazia", () => {
      expect(limparCNPJ("")).toBe("");
    });
  });

  describe("validarCNPJ", () => {
    it("deve validar CNPJ correto", () => {
      // CNPJ válido da Petrobras
      expect(validarCNPJ("33.000.167/0001-01")).toBe(true);
    });

    it("deve rejeitar CNPJ com menos de 14 dígitos", () => {
      expect(validarCNPJ("1234567890123")).toBe(false);
    });

    it("deve rejeitar CNPJ com mais de 14 dígitos", () => {
      expect(validarCNPJ("123456789012345")).toBe(false);
    });

    it("deve rejeitar CNPJ com todos os dígitos iguais", () => {
      expect(validarCNPJ("11111111111111")).toBe(false);
      expect(validarCNPJ("00000000000000")).toBe(false);
    });

    it("deve rejeitar CNPJ com dígito verificador inválido", () => {
      expect(validarCNPJ("12345678000100")).toBe(false);
    });

    it("deve aceitar CNPJ formatado", () => {
      expect(validarCNPJ("33.000.167/0001-01")).toBe(true);
    });
  });

  describe("consultarCNPJ", () => {
    it("deve retornar erro para CNPJ inválido", async () => {
      const resultado = await consultarCNPJ("12345678000100");
      
      expect(isCNPJError(resultado)).toBe(true);
      if (isCNPJError(resultado)) {
        expect(resultado.error).toBe("CNPJ_INVALIDO");
      }
    });

    it("deve retornar dados da empresa para CNPJ válido", async () => {
      const mockResponse = {
        data: {
          cnpj: "33000167000101",
          razao_social: "PETROBRAS DISTRIBUIDORA S A",
          nome_fantasia: "BR DISTRIBUIDORA",
          uf: "RJ",
          cep: "20090901",
          bairro: "Centro",
          numero: "65",
          municipio: "Rio de Janeiro",
          logradouro: "Rua General Canabarro",
          complemento: "",
          ddd_telefone_1: "2132242000",
          ddd_telefone_2: "",
          email: "contato@br.com.br",
          porte: "DEMAIS",
          natureza_juridica: "Sociedade Anônima Aberta",
          capital_social: 1000000000,
          situacao_cadastral: "ATIVA",
          data_situacao_cadastral: "2005-11-03",
          data_inicio_atividade: "1971-01-01",
          cnae_fiscal: 4681801,
          cnae_fiscal_descricao: "Comércio atacadista de álcool carburante",
          qsa: [],
        },
      };

      (axios.get as any).mockResolvedValueOnce(mockResponse);

      const resultado = await consultarCNPJ("33.000.167/0001-01");
      
      expect(isCNPJError(resultado)).toBe(false);
      if (!isCNPJError(resultado)) {
        expect(resultado.razaoSocial).toBe("PETROBRAS DISTRIBUIDORA S A");
        expect(resultado.nomeFantasia).toBe("BR DISTRIBUIDORA");
        expect(resultado.uf).toBe("RJ");
        expect(resultado.cidade).toBe("Rio de Janeiro");
      }
    });

    it("deve retornar erro quando CNPJ não é encontrado", async () => {
      const error = {
        isAxiosError: true,
        response: { status: 404 },
      };
      
      (axios.get as any).mockRejectedValueOnce(error);

      const resultado = await consultarCNPJ("33.000.167/0001-01");
      
      expect(isCNPJError(resultado)).toBe(true);
      if (isCNPJError(resultado)) {
        expect(resultado.error).toBe("CNPJ_NAO_ENCONTRADO");
      }
    });

    it("deve retornar erro quando API retorna 400", async () => {
      const error = {
        isAxiosError: true,
        response: { status: 400 },
      };
      
      (axios.get as any).mockRejectedValueOnce(error);

      const resultado = await consultarCNPJ("33.000.167/0001-01");
      
      expect(isCNPJError(resultado)).toBe(true);
      if (isCNPJError(resultado)) {
        expect(resultado.error).toBe("CNPJ_INVALIDO");
      }
    });

    it("deve retornar erro de timeout", async () => {
      const error = {
        isAxiosError: true,
        code: "ECONNABORTED",
      };
      
      (axios.get as any).mockRejectedValueOnce(error);

      const resultado = await consultarCNPJ("33.000.167/0001-01");
      
      expect(isCNPJError(resultado)).toBe(true);
      if (isCNPJError(resultado)) {
        expect(resultado.error).toBe("TIMEOUT");
      }
    });
  });

  describe("isCNPJError", () => {
    it("deve identificar erro corretamente", () => {
      const erro = {
        success: false,
        error: "CNPJ_INVALIDO",
        message: "CNPJ inválido",
      };
      
      expect(isCNPJError(erro)).toBe(true);
    });

    it("deve identificar sucesso corretamente", () => {
      const sucesso = {
        cnpj: "12345678000199",
        razaoSocial: "Empresa Teste",
        nomeFantasia: null,
        uf: "SP",
        cep: "01310100",
        endereco: "Av Paulista, 1000",
        bairro: "Bela Vista",
        cidade: "São Paulo",
        telefone: null,
        email: null,
        porte: "MICRO EMPRESA",
        situacao: "ATIVA",
        atividadePrincipal: "Desenvolvimento de software",
      };
      
      expect(isCNPJError(sucesso)).toBe(false);
    });
  });
});
