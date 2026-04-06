# Auditoria Completa de UI/UX - Livonius e Livo MGA

## Data da Auditoria: 24/03/2026

---

## PROBLEMAS IDENTIFICADOS

### SITE LIVONIUS (www.livoniusmga.com.br)

#### 1. ESPAÇAMENTOS E MARGENS

**Problema 1.1: Seção Hero - Espaçamento Vertical Inadequado**
- **Localização:** Hero section (HomeLivonius.tsx, linhas 25-79)
- **Descrição:** Espaçamento entre "DESDE 1888" e título H1 é muito pequeno (8px)
- **Impacto:** Hierarquia visual confusa, elementos parecem colados
- **Resolução Necessária:** Aumentar gap para 16-24px
- **Status:** [ ] Pendente

**Problema 1.2: Stats Strip - Padding Insuficiente**
- **Localização:** Stats strip (HomeLivonius.tsx, linhas 82-98)
- **Descrição:** Padding vertical muito pequeno (py-8 = 32px), texto muito próximo das bordas
- **Impacto:** Texto parece comprimido, difícil leitura em mobile
- **Resolução Necessária:** Aumentar para py-12 (48px) em desktop, py-8 em mobile
- **Status:** [ ] Pendente

**Problema 1.3: Group Section (Livo MGA) - Espaçamento Horizontal**
- **Localização:** Group section (HomeLivonius.tsx, linhas 101-141)
- **Descrição:** Gap entre texto e box é inconsistente (gap-12), muito pequeno em tablet
- **Impacto:** Em tablet, elementos ficam muito próximos
- **Resolução Necessária:** Usar gap-16 e ajustar em breakpoints
- **Status:** [ ] Pendente

**Problema 1.4: Solutions Section - Card Gap**
- **Localização:** Solutions section (HomeLivonius.tsx, linhas 143-183)
- **Descrição:** Gap entre cards é 24px (gap-6), muito pequeno para 4 colunas
- **Impacto:** Cards parecem apertados, pouco espaço para respirar
- **Resolução Necessária:** Aumentar gap-6 para gap-8 (32px)
- **Status:** [ ] Pendente

**Problema 1.5: About Section - Espaçamento de Texto**
- **Localização:** About section (HomeLivonius.tsx, linhas 186-227)
- **Descrição:** Espaçamento entre parágrafos é 24px (space-y-6), abaixo do mínimo recomendado
- **Impacto:** Parágrafos parecem juntos, difícil separação visual
- **Resolução Necessária:** Aumentar para space-y-8 (32px)
- **Status:** [ ] Pendente

#### 2. ALINHAMENTO

**Problema 2.1: Hero - Alinhamento de Ícone com Texto**
- **Localização:** Hero section badge (HomeLivonius.tsx, linhas 35-38)
- **Descrição:** Ícone Shield não está perfeitamente alinhado verticalmente com texto "DESDE 1888"
- **Impacto:** Visual desalinhado, falta profissionalismo
- **Resolução Necessária:** Usar items-center e verificar line-height
- **Status:** [ ] Pendente

**Problema 2.2: Stats Strip - Alinhamento Vertical**
- **Localização:** Stats strip (HomeLivonius.tsx, linhas 82-98)
- **Descrição:** Valor (130+) e label não estão bem alinhados verticalmente
- **Impacto:** Parece desorganizado
- **Resolução Necessária:** Usar flex-col items-center justify-center
- **Status:** [ ] Pendente

**Problema 2.3: About Section - Grid Layout**
- **Localização:** About section grid (HomeLivonius.tsx, linhas 214-223)
- **Descrição:** Dois boxes (Nacional/Especialista) não estão alinhados horizontalmente
- **Impacto:** Layout assimétrico
- **Resolução Necessária:** Verificar grid-cols-2 e gap-8
- **Status:** [ ] Pendente

#### 3. TIPOGRAFIA

**Problema 3.1: Hierarquia de Títulos**
- **Localização:** Todas as seções
- **Descrição:** H1 (text-8xl = 96px) é muito grande, H2 (text-4xl = 36px) é pequeno demais
- **Impacto:** Hierarquia confusa, falta de proporção
- **Resolução Necessária:** Reduzir H1 para text-7xl (80px), aumentar H2 para text-5xl (48px)
- **Status:** [ ] Pendente

**Problema 3.2: Line-height de Títulos**
- **Localização:** H1 em Hero (HomeLivonius.tsx, linha 40)
- **Descrição:** leading-[0.9] é muito apertado, causa viúvas (palavras órfãs)
- **Impacto:** Títulos parecem comprimidos, difícil leitura
- **Resolução Necessária:** Aumentar para leading-[1.1]
- **Status:** [ ] Pendente

**Problema 3.3: Tamanho de Fonte em Mobile**
- **Localização:** Todas as seções
- **Descrição:** Fonte em mobile não reduz proporcionalmente (text-6xl em mobile = 60px)
- **Impacto:** Texto transborda em iPhone SE (375px)
- **Resolução Necessária:** Usar text-4xl em mobile, text-6xl em md, text-7xl em lg
- **Status:** [ ] Pendente

**Problema 3.4: Contraste de Texto**
- **Localização:** Seção Group (HomeLivonius.tsx, linhas 113-117)
- **Descrição:** Texto #94A3B8 sobre fundo #0F172A tem contraste 3.2:1 (abaixo de 4.5:1)
- **Impacto:** Texto difícil de ler, não atende WCAG AA
- **Resolução Necessária:** Aumentar contraste para #CBD5E1 ou #E2E8F0
- **Status:** [ ] Pendente

#### 4. RESPONSIVIDADE - MOBILE (320px a 768px)

**Problema 4.1: Hero - Overflow de Texto**
- **Localização:** Hero H1 (HomeLivonius.tsx, linha 40)
- **Descrição:** "LÍDER EM SEGUROS RC ÔNIBUS NO BRASIL." transborda em iPhone SE (375px)
- **Impacto:** Texto ilegível, scroll horizontal indesejado
- **Resolução Necessária:** Reduzir para text-4xl em mobile
- **Status:** [ ] Pendente

**Problema 4.2: Hero - Botões Empilhados**
- **Localização:** Hero buttons (HomeLivonius.tsx, linhas 51-60)
- **Descrição:** Botões em flex-wrap gap-4, muito próximos em mobile
- **Impacto:** Difícil clicar, não atende mínimo 44x44px
- **Resolução Necessária:** Empilhar verticalmente (flex-col) em mobile, gap-3
- **Status:** [ ] Pendente

**Problema 4.3: Stats Strip - Cards Empilhados**
- **Localização:** Stats strip grid (HomeLivonius.tsx, linha 84)
- **Descrição:** grid-cols-2 md:grid-cols-4 causa quebra estranha em tablet
- **Impacto:** Layout inconsistente em 768px-1024px
- **Resolução Necessária:** Usar grid-cols-2 até 1024px, depois grid-cols-4
- **Status:** [ ] Pendente

**Problema 4.4: Group Section - Imagem Oculta**
- **Localização:** Group section box (HomeLivonius.tsx, linhas 124-137)
- **Descrição:** Box com lista de produtos é muito grande em mobile (max-w-sm = 448px)
- **Impacto:** Ocupa toda a largura em mobile, sem espaço para respirar
- **Resolução Necessária:** Usar max-w-full em mobile, max-w-sm em desktop
- **Status:** [ ] Pendente

**Problema 4.5: Solutions Section - Grid Responsivo**
- **Localização:** Solutions grid (HomeLivonius.tsx, linha 153)
- **Descrição:** grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mostra apenas 1 card em mobile
- **Impacto:** Página fica muito longa, usuário precisa scrollar muito
- **Resolução Necessária:** Manter grid-cols-1 em mobile, está correto
- **Status:** [x] OK

**Problema 4.6: About Section - Imagem Quebrada**
- **Localização:** About image (HomeLivonius.tsx, linhas 189-195)
- **Descrição:** Placeholder "1888" em aspect-[4/3] é muito grande em mobile
- **Impacto:** Imagem ocupa muita altura, quebra layout
- **Resolução Necessária:** Usar aspect-square em mobile, aspect-[4/3] em desktop
- **Status:** [ ] Pendente

#### 5. RESPONSIVIDADE - TABLET (768px a 1024px)

**Problema 5.1: Hero - Transição Confusa**
- **Localização:** Hero grid (HomeLivonius.tsx, linha 33)
- **Descrição:** lg:col-span-7 e lg:col-span-5 causam layout quebrado em 768px
- **Impacto:** Elementos empilham verticalmente, não aproveitam espaço
- **Resolução Necessária:** Usar md:col-span-6 para ambos em tablet
- **Status:** [ ] Pendente

**Problema 5.2: Group Section - Flex Quebrado**
- **Localização:** Group section flex (HomeLivonius.tsx, linha 106)
- **Descrição:** md:flex-row causa quebra em 768px, elementos não alinham bem
- **Impacto:** Texto e box não ficam lado a lado em tablet
- **Resolução Necessária:** Usar md:flex-row em 768px+
- **Status:** [ ] Pendente

#### 6. NAVEGAÇÃO E INTERAÇÕES

**Problema 6.1: Botão CTA - Sem Hover State**
- **Localização:** Todos os botões BrutalButton
- **Descrição:** Botões têm hover shadow, mas sem mudança de cor ou escala
- **Impacto:** Feedback visual insuficiente
- **Resolução Necessária:** Adicionar transition-transform scale-105 no hover
- **Status:** [ ] Pendente

**Problema 6.2: Links - Sem Underline**
- **Localização:** Todos os links <a>
- **Descrição:** Links não têm underline ou hover state visível
- **Impacto:** Usuário não sabe que é clicável
- **Resolução Necessária:** Adicionar hover:underline
- **Status:** [ ] Pendente

---

### SITE LIVO MGA (www.livomga.com.br)

#### 1. ESPAÇAMENTOS E MARGENS

**Problema 1.1: Hero - Espaçamento Vertical**
- **Localização:** Hero section (HomeLivo.tsx, linhas 14-79)
- **Descrição:** Espaçamento entre badge e H1 é muito pequeno (8px)
- **Impacto:** Hierarquia visual confusa
- **Resolução Necessária:** Aumentar para 16-24px
- **Status:** [ ] Pendente

**Problema 1.2: Products Section - Grid Gap**
- **Localização:** Products grid (HomeLivo.tsx, linha 132)
- **Descrição:** gap-6 (24px) é pequeno para 3 colunas
- **Impacto:** Cards parecem apertados
- **Resolução Necessária:** Aumentar para gap-8 (32px)
- **Status:** [ ] Pendente

**Problema 1.3: About Section - Espaçamento de Texto**
- **Localização:** About section (HomeLivo.tsx, linhas 200-207)
- **Descrição:** space-y-6 (24px) entre parágrafos é pequeno
- **Impacto:** Parágrafos parecem juntos
- **Resolução Necessária:** Aumentar para space-y-8 (32px)
- **Status:** [ ] Pendente

#### 2. ALINHAMENTO

**Problema 2.1: Products Grid - Alinhamento de Cards**
- **Localização:** Products section (HomeLivo.tsx, linha 132)
- **Descrição:** Cards não estão alinhados verticalmente em 3 colunas
- **Impacto:** Layout assimétrico
- **Resolução Necessária:** Verificar h-full em BrutalCard
- **Status:** [ ] Pendente

**Problema 2.2: About Section - Grid Layout**
- **Localização:** About grid (HomeLivo.tsx, linhas 191-231)
- **Descrição:** order-1 lg:order-2 causa confusão em tablet
- **Impacto:** Ordem de leitura confusa
- **Resolução Necessária:** Simplificar para grid-cols-1 lg:grid-cols-2
- **Status:** [ ] Pendente

#### 3. TIPOGRAFIA

**Problema 3.1: Hierarquia de Títulos**
- **Localização:** Todas as seções
- **Descrição:** H1 (text-8xl = 96px) é muito grande, H2 (text-4xl = 36px) é pequeno
- **Impacto:** Hierarquia confusa
- **Resolução Necessária:** Reduzir H1 para text-7xl, aumentar H2 para text-5xl
- **Status:** [ ] Pendente

**Problema 3.2: Contraste de Texto**
- **Localização:** Seção Group (HomeLivo.tsx, linhas 94-99)
- **Descrição:** Texto #94A3B8 sobre fundo #1A1A1A tem contraste baixo
- **Impacto:** Texto difícil de ler
- **Resolução Necessária:** Aumentar para #CBD5E1 ou #E2E8F0
- **Status:** [ ] Pendente

#### 4. RESPONSIVIDADE - MOBILE

**Problema 4.1: Hero - Overflow de Texto**
- **Localização:** Hero H1 (HomeLivo.tsx, linha 29)
- **Descrição:** "SEGUROS PARA NEGÓCIOS QUE NÃO PARAM." transborda em mobile
- **Impacto:** Texto ilegível
- **Resolução Necessária:** Reduzir para text-4xl em mobile
- **Status:** [ ] Pendente

**Problema 4.2: Hero - Product Grid Quebrado**
- **Localização:** Hero product grid (HomeLivo.tsx, linhas 52-72)
- **Descrição:** grid-cols-2 é muito apertado em mobile (375px)
- **Impacto:** Boxes muito pequenos, difícil clicar
- **Resolução Necessária:** Usar grid-cols-1 em mobile
- **Status:** [ ] Pendente

**Problema 4.3: Products Section - 3 Colunas em Mobile**
- **Localização:** Products grid (HomeLivo.tsx, linha 132)
- **Descrição:** lg:grid-cols-3 mostra 3 colunas em mobile
- **Impacto:** Cards muito pequenos, ilegíveis
- **Resolução Necessária:** Usar grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- **Status:** [ ] Pendente

---

## RESUMO DE PROBLEMAS POR CATEGORIA

| Categoria | Livonius | Livo | Total |
|-----------|----------|------|-------|
| Espaçamentos | 5 | 3 | 8 |
| Alinhamento | 3 | 2 | 5 |
| Tipografia | 4 | 2 | 6 |
| Responsividade Mobile | 6 | 3 | 9 |
| Responsividade Tablet | 2 | 1 | 3 |
| Navegação | 2 | 0 | 2 |
| **TOTAL** | **22** | **11** | **33** |

---

## PRÓXIMAS ETAPAS

1. [ ] Corrigir espaçamentos e margens
2. [ ] Corrigir alinhamento de elementos
3. [ ] Corrigir tipografia e hierarquia
4. [ ] Testar responsividade em mobile (375px, 390px, 360px)
5. [ ] Testar responsividade em tablet (768px, 810px, 1024px)
6. [ ] Testar responsividade em desktop (1280px, 1440px, 1920px)
7. [ ] Validar contraste de cores (WCAG AA)
8. [ ] Gerar screenshots antes/depois
9. [ ] Criar relatório final

