- [ ] Adicionar seção "Grupo Livonius" (Cross-sell) na HomeLivonius.tsx
- [ ] Adicionar seção "Sobre Nós" na HomeLivonius.tsx
- [ ] Adicionar seção "Parceiros" na HomeLivonius.tsx
- [ ] Adicionar seção "Cross-sell" na HomeLivo.tsx
- [ ] Adicionar seção "Sobre Nós" na HomeLivo.tsx
- [ ] Adicionar seção "Parceiros" na HomeLivo.tsx
- [ ] Verificar e corrigir links de navegação (âncoras) em ambas as páginas
- [ ] Revisar rodapés para garantir consistência
- [ ] Criar componente `BrandConnector` para navegação fluida entre marcas (Tradição + Tech)
- [ ] Implementar seção "O Melhor dos Dois Mundos" na HomeLivonius e HomeLivo
- [ ] Definir e implementar design system para capas de posts do blog (Duotone/Geométrico)
- [ ] Atualizar `BlogUnificado.tsx` com o novo visual dos posts
- [ ] Refinar copy para enfatizar a sinergia entre história e inovação digital
- [ ] Criar página `BlogPost.tsx` com layout de leitura otimizado
- [ ] Implementar cabeçalho dinâmico baseado na marca do post (Livonius/Livo)
- [ ] Adicionar elementos de tipografia rica (Blockquotes, Listas estilizadas)
- [ ] Configurar rota dinâmica `/blog/:slug` no `App.tsx`
- [ ] Conectar cards do `BlogUnificado` à nova página de post
- [ ] Adicionar textura de granulação (noise) global via CSS
- [ ] Implementar animações de entrada (FadeIn/SlideUp) com `framer-motion` ou CSS
- [ ] Refinar sombras dos cards para criar profundidade em camadas
- [ ] Criar composições SVG abstratas mais ricas para os Hero Sections
- [ ] Adicionar micro-interações de hover mais sofisticadas nos botões
- [ ] Criar componente `ProductLayout.tsx` reutilizável
- [ ] Implementar página `ProdutoRCO.tsx` (Livonius)
- [ ] Implementar página `ProdutoSolar.tsx` (Livo)
- [ ] Implementar página `ProdutoGarantia.tsx` (Livo)
- [ ] Implementar página `ProdutoAgro.tsx` (Livo)
- [ ] Implementar página `ProdutoEngenharia.tsx` (Livo)
- [ ] Atualizar rotas no `App.tsx`
- [ ] Conectar links da Home às páginas de produto
- [ ] Criar componente `LeadChat.tsx` (Simulação de IA para captura)
- [ ] Implementar geração de PDF no cliente com `jspdf` ou similar
- [ ] Adicionar botão "Baixar Ficha Técnica" no `ProductLayout`
- [ ] Implementar Schema Markup (JSON-LD) para Produtos e Organização (GEO)
- [ ] Revisar meta tags e descrições para "Answer Engine Optimization"
- [ ] Testar todos os fluxos de navegação e botões (QA)
- [ ] Verificar responsividade em mobile e desktop
- [ ] Pesquisar detalhes técnicos e condições gerais de RCO (Livonius)
- [ ] Pesquisar detalhes técnicos e condições gerais de Solar, Garantia, Agro, Engenharia (Livo MGA)
- [ ] Atualizar `ProdutoRCO.tsx` com conteúdo enriquecido
- [ ] Atualizar `ProdutoSolar.tsx` com conteúdo enriquecido
- [ ] Atualizar `ProdutoGarantia.tsx` com conteúdo enriquecido
- [ ] Atualizar `ProdutoAgro.tsx` com conteúdo enriquecido
- [ ] Atualizar `ProdutoEngenharia.tsx` com conteúdo enriquecido
- [ ] Gerar imagem realista para RCO (Ônibus/Frota)
- [ ] Gerar imagem realista para Solar (Painéis/Usina)
- [ ] Gerar imagem realista para Garantia (Corporativo/Contrato)
- [ ] Gerar imagem realista para Agro (Campo/Máquinas)
- [ ] Gerar imagem realista para Engenharia (Obra/Construção)
- [ ] Integrar imagens nas páginas de produto substituindo os placeholders geométricos
- [ ] Verificar responsividade em mobile e desktop
- [ ] Testar todos os links de navegação interna
- [ ] Validar funcionamento do LeadChat em todas as páginas
- [ ] Testar geração de PDF em todas as páginas de produto
- [ ] Verificar meta tags e dados estruturados (SEO)
- [ ] Adicionar botão "Voltar" no `ProductLayout.tsx`
- [ ] Adicionar botão "Voltar" no `BlogPost.tsx`
- [ ] Verificar fluxo de navegação de retorno em todas as páginas
- [ ] Criar página `Sinistro.tsx` com formulário de upload
- [ ] Adicionar rota `/sinistro` no `App.tsx`
- [ ] Adicionar link para "Aviso de Sinistro" no rodapé e menu
- [ ] Implementar componente de Upload Drag & Drop
- [x] Upgrade do projeto para `web-db-user` (Full-Stack)
- [x] Instalar `nodemailer` e `@types/nodemailer`
- [x] Criar rota de API `/api/sinistro/notify` no backend (via tRPC)
- [x] Implementar serviço de envio de e-mail com `nodemailer` + fallback `notifyOwner`
- [x] Atualizar `Sinistro.tsx` para enviar dados para a API real (tRPC)
- [ ] Configurar variáveis de ambiente para SMTP (SMTP_HOST, SMTP_USER, etc.) - Opcional
- [x] Sistema de notificação por e-mail para equipe de sinistros implementado
- [x] Integrar logo Livonius SVG branco fornecido pelo usuário
- [x] Baixar e integrar logo Livo MGA do site oficial
- [x] Criar imagens de produto modernas (tendências 2025/2026)
- [x] Substituir emojis/placeholders por visuais profissionais
- [x] Atualizar paleta de cores da Livo MGA: verde (#7AB72D) como destaque
- [x] Substituir azul (#0284C7) por verde nas páginas da Livo
- [x] Intercalar verde com preto e cores complementares
- [x] Atualizar Navigation.tsx para Livo com verde
- [x] Atualizar HomeLivo.tsx com nova paleta
- [x] Atualizar páginas de produto da Livo (Solar, Garantia, Agro, Engenharia)
- [x] Reverter imagens de produto para estilo anterior (preferido pelo usuário)

## Sistema de Cotação Inteligente
- [x] Pesquisar tendências de formulários interativos 2025/2026
- [x] Pesquisar dados necessários por ramo de seguro (RCO, Solar, Garantia, Agro, Engenharia)
- [x] Criar schema do banco de dados para cotações
- [x] Criar schema para analytics (cliques, tempo, abandono)
- [x] Implementar formulário faseado (wizard steps) com UI moderna
- [x] Campos dinâmicos por tipo de produto (RCO = Livonius, demais = Livo)
- [x] Integrar IA para extração de dados de documentos (upload + OCR)
- [x] Implementar normalização automática de dados
- [x] Implementar analytics detalhado
- [x] Preparar endpoints para integração MCP/CRM
- [x] Persistir cotações no banco de dados
- [x] Atualizar botões "Cotar Agora" para direcionar ao formulário
- [x] Testes vitest passando (25 testes)

## Salvamento Automático do Formulário
- [x] Criar hook useAutoSave para salvar progresso no localStorage
- [x] Implementar debounce para evitar salvamentos excessivos
- [x] Criar modal de recuperação de progresso ao retornar
- [x] Adicionar indicador visual de "salvando..." / "salvo"
- [x] Permitir limpar progresso salvo manualmente
- [x] Integrar auto-save no componente Cotacao.tsx
- [x] Testes vitest passando (41 testes)

## E-mail de Confirmação ao Cliente
- [x] Criar template HTML profissional para e-mail de confirmação
- [x] Criar função sendCotacaoConfirmation no emailService
- [x] Integrar envio na rota cotacao.submeter
- [x] Incluir protocolo, dados da cotação e próximos passos no e-mail
- [x] Testar envio de e-mail de confirmação
- [x] 42 testes vitest passando

## Redesign Formulário de Cotação - Experiência Conversacional
- [x] Pesquisar referências Typeform, Tally, formulários conversacionais 2025
- [x] Mudar tema para claro (fundo branco, cores de destaque Livonius/Livo)
- [x] Implementar experiência conversacional (uma pergunta por vez)
- [x] Reduzir campos ao mínimo essencial (6 etapas simples)
- [x] Adicionar transições suaves e micro-animações (framer-motion)
- [x] Formatação automática de CPF/CNPJ e WhatsApp
- [x] Design moderno com cards flutuantes e feedback visual
- [x] Cores dinâmicas baseadas no produto selecionado

## Busca Automática de CNPJ
- [x] Pesquisar API gratuita de consulta CNPJ (BrasilAPI)
- [x] Criar serviço cnpjService.ts no backend
- [x] Criar rota tRPC utils.consultarCNPJ
- [x] Integrar busca automática no formulário de cotação
- [x] Preencher automaticamente razão social, endereço, etc.
- [x] Feedback visual durante busca (loading, sucesso, erro)
- [x] 59 testes vitest passando

## Cadastro de Corretor/Parceiro
- [x] Pesquisar documentos necessários para cadastro de corretor
- [x] Criar schema do banco de dados para corretores (tabela corretores)
- [x] Criar rotas tRPC para cadastro de corretor
- [x] Implementar formulário conversacional de cadastro
- [x] Integrar busca automática de CNPJ (reutilizar)
- [x] Upload de documentos: Contrato Social, Comprovante Bancário PJ, Comprovante Bancário Sócios
- [x] Campos: CNPJ, Razão Social, Nome Fantasia, Endereço, E-mail, Telefone, Responsável
- [x] Notificação por e-mail ao receber novo cadastro
- [x] Salvar documentos no S3

## Reformulação do Formulário de Sinistro
- [x] Pesquisar documentos necessários por tipo de sinistro (RCO, Solar, Garantia, Agro, Engenharia)
- [x] Criar schema do banco de dados para sinistros (tabela sinistros)
- [x] Criar rotas tRPC para abertura de sinistro
- [x] Implementar formulário conversacional faseado por produto
- [x] Campos dinâmicos por tipo de produto/sinistro
- [x] Upload de documentos específicos por ramo (BO, laudos, fotos, etc.)
- [x] Notificação por e-mail ao receber novo sinistro
- [x] Salvar documentos no S3
- [x] Gerar protocolo único de sinistro
- [x] 80 testes vitest passando

## Aprimoramento com Catálogo Livo/Livonius MGA
- [ ] Extrair dados de produtos, seguradoras e links SUSEP do catálogo
- [ ] Atualizar formulário de cotação com campos específicos por produto
- [ ] Adicionar links das condições gerais ESSOR nas páginas de produto
- [ ] Incluir dados das seguradoras parceiras
- [ ] Atualizar campos de cotação RCO (frota, operação, histórico sinistros)
- [ ] Atualizar campos de cotação Solar (projeto, placas, inversor)
- [ ] Atualizar campos de cotação Garantia (faturamento, balanço, tipo garantia)
- [ ] Atualizar campos de cotação Agro/Penhor Rural (equipamentos, propriedade)
- [ ] Atualizar campos de cotação Engenharia (obra, ART, cronograma)
- [ ] Adicionar produtos Vida, Saúde e Odontológico ao catálogo
- [ ] Criar arquivo catalogoProdutos.ts com dados centralizados
- [ ] Atualizar páginas de produto com informações do catálogo

## Correção de SEO - Página Inicial (/)
- [x] Adicionar título otimizado (30-60 caracteres) com palavras-chave
- [x] Adicionar meta description (50-160 caracteres)
- [x] Adicionar meta keywords com palavras-chave relevantes
- [x] Adicionar Open Graph tags (og:title, og:description, og:image)
- [x] Adicionar Twitter Card tags
- [x] Adicionar canonical URL
- [x] Criar hook usePageMeta para gerenciar meta tags dinâmicas
- [x] Integrar usePageMeta em HomeLivonius.tsx
- [x] 80 testes vitest passando

## Adicionar Links de Sinistro e Cadastro de Corretor
- [x] Adicionar link "Abrir Sinistro" no menu de navegação (Navigation.tsx)
- [x] Adicionar link "Cadastro de Corretor" no menu de navegação (Portal do Corretor)
- [x] Adicionar botão "Abrir Sinistro" no hero/seção principal (HomeLivonius e HomeLivo)
- [x] Adicionar botão "Seja Parceiro" no menu de navegação
- [x] Links já existem no footer para Sinistro e Cadastro de Corretor
- [x] 80 testes vitest passando

## Correções - Fluxo de Sinistro
- [x] Remover botão "Abrir Sinistro" do hero (HomeLivonius e HomeLivo) - Não encontrado duplicado
- [x] Corrigir erro na consulta de CNPJ no fluxo de sinistro - Estrutura de dados corrigida
- [x] Melhorar visual do formulário de sinistro (tema claro, cores da marca) - Redesign completo
- [x] Implementar consulta automática de CNPJ com debounce - useEffect adicionado
- [x] Validar fluxo completo de sinistro - 80 testes vitest passando


## Auditoria Completa - Links, Espaçamentos e Mobile
- [ ] Verificar todos os links de botão (href, onClick, navegação)
- [ ] Testar navegação em HomeLivonius, HomeLivo, páginas de produto
- [ ] Ajustar espaçamentos (padding/margin) em toda interface
- [ ] Revisar responsividade mobile (breakpoints)
- [ ] Implementar menu hambúrguer funcional para mobile
- [ ] Testar menu hambúrguer em todos os tamanhos de tela

## Fluxos de Sinistro por Tipo de Seguro
- [ ] Documentar dados específicos por tipo de seguro (RCO, Solar, Garantia, Agro, Engenharia)
- [ ] Documentar documentos obrigatórios por tipo de sinistro
- [ ] Atualizar SinistroConversacional.tsx com campos dinâmicos por seguro
- [ ] Implementar validação de campos obrigatórios por tipo
- [ ] Implementar upload de documentos específicos por tipo
- [ ] Testar fluxo RCO (Livonius)
- [ ] Testar fluxo Solar (Livo)
- [ ] Testar fluxo Garantia (Livo)
- [ ] Testar fluxo Agro (Livo)
- [ ] Testar fluxo Engenharia (Livo)

## Status Atual - Auditoria Completa
- [x] Menu hambúrguer mobile implementado e funcional
- [x] Dados específicos por tipo de seguro documentados em sinistroData.ts
- [x] Documentos obrigatórios por tipo integrados
- [x] 80 testes vitest passando

## Atualizações de Conteúdo e Design - Solicitadas por Nanda
- [x] Cabeçalho: trocar "Livonius MGA Seguros" para "Livonius MGA"
- [x] Adicionar logo Grupo Livonius com complemento "Há mais de 135 anos construindo confiança..."
- [x] Adicionar pictograma de escudo em "Desde 1888"
- [x] Seção Livo: nova cor da paleta, RD Máquinas Agrícolas, Seguros Patrimoniais, Seguro Garantia
- [x] Botão "Conhecer a Livo MGA" → "Conheça a Livo"
- [x] Pictogramas: deixar somente "Seguro RCO"
- [x] Sobre nós: atualizar descrição com novo texto
- [x] Parceiros: trocar para "Uma parceria exclusiva" com logo ESSOR Seguros
- [x] Rodapé: atualizar texto do Grupo Livonius
- [x] Rodapé Produtos: deixar somente "SEGURO RCO"
- [x] Rodapé Contatos: adicionar canais RCO e Corporate, dar ênfase a sinistros

## Implementações Finais - Blog SEO/GEO/Áudio
- [x] Implementar SEO completo (meta tags, schema markup, keywords, Open Graph)
- [x] Implementar GEO (localização, referências geográficas)
- [x] Melhorar formatação de conteúdo (subtítulos, destaques, resumo)
- [x] Implementar áudio text-to-speech para artigos
- [x] Adicionar transcrição e controles de áudio
- [x] Testar acessibilidade e performance (102 testes vitest passando)

## Sistema de Cotacao Inteligente e Dinamico (PRIORITARIO)
- [x] Criar tipos e estrutura de dados para cotacao por produto
- [x] Implementar formulario conversacional multi-step com logica condicional
- [ ] Adicionar logica dinamica de campos por tipo de seguro (RCO especifico, Solar, Garantia, Agro, Engenharia, Saude)
- [x] Integrar busca de CNPJ (BrasilAPI) com auto-preenchimento
- [ ] Implementar upload e extracao de documentos com IA
- [ ] Criar payload estruturado para envio ao CRM e APIs de calculo
- [ ] Implementar calculo de premio (quando houver regra)
- [x] Integrar com backend tRPC para envio de cotacao
- [ ] Testar fluxo completo de cotacao por tipo de seguro
- [ ] Documentar API de cotacao e payload

## Autenticacao de Corretor e Dashboard
- [ ] Criar tabela de corretores com autenticacao (email/senha)
- [ ] Implementar login de corretor
- [ ] Criar dashboard de acompanhamento de cotacoes
- [ ] Listar historico de cotacoes com status
- [ ] Exibir dados e premios calculados
- [ ] Permitir download/exportacao de cotacoes
- [ ] Integrar com sistema de notificacoes

## Alterações Email do Marcelo - Fase 2
- [x] Inserir imagem realista de trator no produto "Penhor Rural e Benfeitorias"
- [x] Remover tópico "Despesas de Socorro" do catálogo de RCO
- [x] Substituir imagem abstrata da página Livonius por foto realista de ônibus

## Correções Urgentes - Comitê de Sócios (26/03)

### Site Livonius
- [x] Tagline: "137 anos" → "+ de 130 anos" (todos os locais)
- [x] Corrigir "três séculos" → "+ de 130 anos" no texto institucional
- [x] Seção Especialista: "transporte" → "transporte de passageiros"
- [x] Box Livo MGA: incluir todos os ramos (Saúde, Vida, Agro, Garantia, Propriedades, Responsabilidades)
- [ ] Melhorar/substituir imagem do hero (qualidade e impacto) - OPCIONAL
- [ ] Botão CTA: "SIMULAR RCO ONLINE" → "Simulador RCO Online" ou "Faça sua Cotação" - NÃO ENCONTRADO

### Site Livo MGA
- [x] Parceiros: "do mundo" → "do Brasil"
- [x] Seção Produtos: incluir portfólio completo (9 produtos listados)
