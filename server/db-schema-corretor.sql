-- Schema para Corretores/Parceiros com Autenticação
-- Adicionar à tabela de usuários do Drizzle

CREATE TABLE IF NOT EXISTS corretores (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  email VARCHAR(255) UNIQUE NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  cnpj VARCHAR(18) UNIQUE NOT NULL,
  razao_social VARCHAR(255) NOT NULL,
  nome_fantasia VARCHAR(255),
  endereco TEXT,
  telefone VARCHAR(20),
  contato_nome VARCHAR(255),
  contato_email VARCHAR(255),
  status ENUM('pendente', 'aprovado', 'rejeitado', 'ativo', 'inativo') DEFAULT 'pendente',
  data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_aprovacao TIMESTAMP,
  data_ultimo_acesso TIMESTAMP,
  ativo BOOLEAN DEFAULT TRUE,
  INDEX idx_email (email),
  INDEX idx_cnpj (cnpj),
  INDEX idx_status (status)
);

-- Tabela de Cotações
CREATE TABLE IF NOT EXISTS cotacoes (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  protocolo VARCHAR(50) UNIQUE NOT NULL,
  corretor_id VARCHAR(36) NOT NULL,
  tipo_produto ENUM('rco', 'solar', 'garantia', 'agro', 'engenharia', 'saude') NOT NULL,
  marca ENUM('livonius', 'livo') NOT NULL,
  status ENUM('rascunho', 'enviada', 'em_analise', 'aprovada', 'rejeitada', 'expirada') DEFAULT 'rascunho',
  dados_json LONGTEXT NOT NULL,
  premio_calculado DECIMAL(12, 2),
  premio_final DECIMAL(12, 2),
  desconto_percentual DECIMAL(5, 2),
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_envio TIMESTAMP,
  data_expiracao TIMESTAMP,
  data_atualizacao TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (corretor_id) REFERENCES corretores(id) ON DELETE CASCADE,
  INDEX idx_protocolo (protocolo),
  INDEX idx_corretor (corretor_id),
  INDEX idx_status (status),
  INDEX idx_produto (tipo_produto),
  INDEX idx_data (data_criacao)
);

-- Tabela de Histórico de Cotações
CREATE TABLE IF NOT EXISTS cotacoes_historico (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  cotacao_id VARCHAR(36) NOT NULL,
  status_anterior VARCHAR(50),
  status_novo VARCHAR(50),
  motivo TEXT,
  usuario_id VARCHAR(36),
  data_mudanca TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cotacao_id) REFERENCES cotacoes(id) ON DELETE CASCADE,
  INDEX idx_cotacao (cotacao_id)
);

-- Tabela de Notificações
CREATE TABLE IF NOT EXISTS notificacoes_corretor (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  corretor_id VARCHAR(36) NOT NULL,
  cotacao_id VARCHAR(36),
  tipo ENUM('cotacao_enviada', 'cotacao_aprovada', 'cotacao_rejeitada', 'novo_sinistro', 'atualizacao_sistema') NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  mensagem TEXT,
  lida BOOLEAN DEFAULT FALSE,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (corretor_id) REFERENCES corretores(id) ON DELETE CASCADE,
  FOREIGN KEY (cotacao_id) REFERENCES cotacoes(id) ON DELETE SET NULL,
  INDEX idx_corretor (corretor_id),
  INDEX idx_lida (lida)
);

-- Tabela de Sessões de Corretor
CREATE TABLE IF NOT EXISTS sessoes_corretor (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  corretor_id VARCHAR(36) NOT NULL,
  token_hash VARCHAR(255) UNIQUE NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_expiracao TIMESTAMP,
  ativo BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (corretor_id) REFERENCES corretores(id) ON DELETE CASCADE,
  INDEX idx_token (token_hash),
  INDEX idx_corretor (corretor_id),
  INDEX idx_expiracao (data_expiracao)
);
