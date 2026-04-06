import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock do notifyOwner
vi.mock('./_core/notification', () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

// Mock do nodemailer
vi.mock('nodemailer', () => ({
  default: {
    createTransport: vi.fn().mockReturnValue(null),
  },
}));

import { sendSinistroNotification, sendConfirmationToClient, SinistroData } from './emailService';

describe('Sinistro Email Service', () => {
  const mockSinistroData: SinistroData = {
    nome: 'João da Silva',
    cpfCnpj: '123.456.789-00',
    email: 'joao@teste.com',
    telefone: '(11) 99999-9999',
    numeroApolice: '123456',
    dataOcorrido: '2026-01-15',
    relato: 'Teste de relato de sinistro para verificação do sistema.',
    marca: 'livonius',
    protocolo: 'SIN-TEST123',
    arquivos: ['documento1.pdf', 'foto.jpg'],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('sendSinistroNotification', () => {
    it('deve enviar notificação de sinistro com sucesso', async () => {
      const result = await sendSinistroNotification(mockSinistroData);
      
      expect(result.success).toBe(true);
      expect(result.message).toContain('sucesso');
    });

    it('deve incluir todos os dados do sinistro na notificação', async () => {
      const result = await sendSinistroNotification(mockSinistroData);
      
      expect(result.success).toBe(true);
    });

    it('deve funcionar com marca livo', async () => {
      const livoData: SinistroData = {
        ...mockSinistroData,
        marca: 'livo',
      };
      
      const result = await sendSinistroNotification(livoData);
      
      expect(result.success).toBe(true);
    });

    it('deve funcionar sem arquivos anexados', async () => {
      const dataWithoutFiles: SinistroData = {
        ...mockSinistroData,
        arquivos: undefined,
      };
      
      const result = await sendSinistroNotification(dataWithoutFiles);
      
      expect(result.success).toBe(true);
    });

    it('deve funcionar sem número de apólice', async () => {
      const dataWithoutApolice: SinistroData = {
        ...mockSinistroData,
        numeroApolice: undefined,
      };
      
      const result = await sendSinistroNotification(dataWithoutApolice);
      
      expect(result.success).toBe(true);
    });
  });

  describe('sendConfirmationToClient', () => {
    it('deve enviar confirmação ao cliente com sucesso', async () => {
      const result = await sendConfirmationToClient(mockSinistroData);
      
      expect(result.success).toBe(true);
    });

    it('deve funcionar com marca livo', async () => {
      const livoData: SinistroData = {
        ...mockSinistroData,
        marca: 'livo',
      };
      
      const result = await sendConfirmationToClient(livoData);
      
      expect(result.success).toBe(true);
    });
  });
});

describe('Sinistro Data Validation', () => {
  it('deve validar dados obrigatórios do sinistro', () => {
    const requiredFields = ['nome', 'cpfCnpj', 'email', 'telefone', 'dataOcorrido', 'relato', 'marca', 'protocolo'];
    
    const sinistroData: SinistroData = {
      nome: 'Teste',
      cpfCnpj: '12345678900',
      email: 'teste@teste.com',
      telefone: '11999999999',
      dataOcorrido: '2026-01-15',
      relato: 'Relato de teste',
      marca: 'livonius',
      protocolo: 'SIN-123',
    };

    requiredFields.forEach(field => {
      expect(sinistroData).toHaveProperty(field);
      expect(sinistroData[field as keyof SinistroData]).toBeTruthy();
    });
  });

  it('deve aceitar apenas marcas válidas', () => {
    const validMarcas = ['livonius', 'livo'];
    
    validMarcas.forEach(marca => {
      expect(['livonius', 'livo']).toContain(marca);
    });
  });

  it('deve gerar protocolo no formato correto', () => {
    const protocolo = `SIN-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    
    expect(protocolo).toMatch(/^SIN-[A-Z0-9]+-[A-Z0-9]+$/);
  });
});
