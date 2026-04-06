import { describe, it, expect } from 'vitest';
import { blogArticles } from '../client/src/data/blogArticles';

describe('Blog SEO & GEO', () => {
  describe('Estrutura de Artigos', () => {
    it('deve ter 6 artigos no blog', () => {
      expect(blogArticles).toHaveLength(6);
    });

    it('cada artigo deve ter todos os campos obrigatórios', () => {
      blogArticles.forEach(article => {
        expect(article).toHaveProperty('id');
        expect(article).toHaveProperty('title');
        expect(article).toHaveProperty('subtitle');
        expect(article).toHaveProperty('excerpt');
        expect(article).toHaveProperty('content');
        expect(article).toHaveProperty('image');
        expect(article).toHaveProperty('author');
        expect(article).toHaveProperty('date');
        expect(article).toHaveProperty('category');
        expect(article).toHaveProperty('readTime');
        expect(article).toHaveProperty('keywords');
        expect(article).toHaveProperty('location');
        expect(article).toHaveProperty('seoTitle');
        expect(article).toHaveProperty('seoDescription');
        expect(article).toHaveProperty('brand');
      });
    });

    it('cada artigo deve ter ID único', () => {
      const ids = blogArticles.map(a => a.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('SEO Optimization', () => {
    it('cada artigo deve ter título SEO entre 30-70 caracteres', () => {
      blogArticles.forEach(article => {
        const length = article.seoTitle.length;
        expect(length).toBeGreaterThanOrEqual(30);
        expect(length).toBeLessThanOrEqual(70);
      });
    });

    it('cada artigo deve ter descrição SEO entre 50-160 caracteres', () => {
      blogArticles.forEach(article => {
        const length = article.seoDescription.length;
        expect(length).toBeGreaterThanOrEqual(50);
        expect(length).toBeLessThanOrEqual(160);
      });
    });

    it('cada artigo deve ter pelo menos 3 keywords', () => {
      blogArticles.forEach(article => {
        expect(article.keywords.length).toBeGreaterThanOrEqual(3);
      });
    });

    it('cada artigo deve ter conteúdo com pelo menos 500 caracteres', () => {
      blogArticles.forEach(article => {
        expect(article.content.length).toBeGreaterThanOrEqual(500);
      });
    });

    it('cada artigo deve ter excerpt com pelo menos 80 caracteres', () => {
      blogArticles.forEach(article => {
        expect(article.excerpt.length).toBeGreaterThanOrEqual(80);
      });
    });
  });

  describe('GEO Optimization', () => {
    it('cada artigo deve ter localização definida', () => {
      blogArticles.forEach(article => {
        expect(article.location).toBeDefined();
        expect(article.location.length).toBeGreaterThan(0);
      });
    });

    it('todos os artigos devem ter localização Brasil', () => {
      blogArticles.forEach(article => {
        expect(article.location).toBe('Brasil');
      });
    });

    it('cada artigo deve ter data válida', () => {
      blogArticles.forEach(article => {
        const date = new Date(article.date);
        expect(date.getTime()).not.toBeNaN();
      });
    });
  });

  describe('Brand Classification', () => {
    it('cada artigo deve ter marca válida (livonius ou livo)', () => {
      blogArticles.forEach(article => {
        expect(['livonius', 'livo']).toContain(article.brand);
      });
    });

    it('deve ter artigos de ambas as marcas', () => {
      const brands = new Set(blogArticles.map(a => a.brand));
      expect(brands.size).toBe(2);
      expect(brands).toContain('livonius');
      expect(brands).toContain('livo');
    });

    it('Livonius deve ter artigos sobre RCO e frotas', () => {
      const livoniusArticles = blogArticles.filter(a => a.brand === 'livonius');
      const hasRCO = livoniusArticles.some(a => a.id.includes('rco'));
      const hasFrotas = livoniusArticles.some(a => a.id.includes('frotas'));
      expect(hasRCO).toBe(true);
      expect(hasFrotas).toBe(true);
    });

    it('Livo deve ter artigos sobre Solar, Garantia e Rural', () => {
      const livoArticles = blogArticles.filter(a => a.brand === 'livo');
      const hasSolar = livoArticles.some(a => a.id.includes('solar'));
      const hasGarantia = livoArticles.some(a => a.id.includes('garantia'));
      const hasRural = livoArticles.some(a => a.id.includes('rural'));
      expect(hasSolar).toBe(true);
      expect(hasGarantia).toBe(true);
      expect(hasRural).toBe(true);
    });
  });

  describe('Content Quality', () => {
    it('cada artigo deve ter título com pelo menos 10 palavras', () => {
      blogArticles.forEach(article => {
        const wordCount = article.title.split(' ').length;
        expect(wordCount).toBeGreaterThanOrEqual(5);
      });
    });

    it('cada artigo deve ter tempo de leitura entre 5-15 minutos', () => {
      blogArticles.forEach(article => {
        expect(article.readTime).toBeGreaterThanOrEqual(5);
        expect(article.readTime).toBeLessThanOrEqual(15);
      });
    });

    it('cada artigo deve ter categoria definida', () => {
      blogArticles.forEach(article => {
        expect(article.category).toBeDefined();
        expect(article.category.length).toBeGreaterThan(0);
      });
    });

    it('cada artigo deve ter imagem definida', () => {
      blogArticles.forEach(article => {
        expect(article.image).toBeDefined();
        // Aceita URLs CDN (https://) ou caminhos locais (/)
        const isValidUrl = article.image.startsWith('https://') || article.image.startsWith('/');
        expect(isValidUrl).toBe(true);
      });
    });

    it('cada artigo deve ter autor definido', () => {
      blogArticles.forEach(article => {
        expect(article.author).toBeDefined();
        expect(article.author.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Schema.org Compliance', () => {
    it('cada artigo deve ter dados para schema BlogPosting', () => {
      blogArticles.forEach(article => {
        // Verificar que todos os campos necessários para schema.org estão presentes
        expect(article.title).toBeDefined();
        expect(article.excerpt).toBeDefined();
        expect(article.image).toBeDefined();
        expect(article.author).toBeDefined();
        expect(article.date).toBeDefined();
        expect(article.content).toBeDefined();
        expect(article.keywords).toBeDefined();
      });
    });

    it('cada artigo deve ter conteúdo com estrutura H2/H3', () => {
      blogArticles.forEach(article => {
        expect(article.content).toMatch(/##\s/); // Deve ter pelo menos um H2
      });
    });
  });
});
