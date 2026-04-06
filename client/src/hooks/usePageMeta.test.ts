import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePageMeta } from './usePageMeta';

describe('usePageMeta', () => {
  beforeEach(() => {
    // Limpar document.title e meta tags antes de cada teste
    document.title = '';
    document.head.innerHTML = '';
  });

  it('deve atualizar o título da página', () => {
    const meta = {
      title: 'Test Page Title',
      description: 'Test description'
    };

    renderHook(() => usePageMeta(meta));

    expect(document.title).toBe('Test Page Title');
  });

  it('deve criar e atualizar meta description', () => {
    const meta = {
      title: 'Test Title',
      description: 'This is a test description'
    };

    renderHook(() => usePageMeta(meta));

    const metaDescription = document.querySelector('meta[name="description"]');
    expect(metaDescription?.getAttribute('content')).toBe('This is a test description');
  });

  it('deve criar e atualizar meta keywords', () => {
    const meta = {
      title: 'Test Title',
      description: 'Test description',
      keywords: 'test, keywords, seo'
    };

    renderHook(() => usePageMeta(meta));

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    expect(metaKeywords?.getAttribute('content')).toBe('test, keywords, seo');
  });

  it('deve criar e atualizar Open Graph tags', () => {
    const meta = {
      title: 'OG Title',
      description: 'OG Description',
      ogUrl: 'https://example.com'
    };

    renderHook(() => usePageMeta(meta));

    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');

    expect(ogTitle?.getAttribute('content')).toBe('OG Title');
    expect(ogDescription?.getAttribute('content')).toBe('OG Description');
    expect(ogUrl?.getAttribute('content')).toBe('https://example.com');
  });

  it('deve criar e atualizar Twitter Card tags', () => {
    const meta = {
      title: 'Twitter Title',
      description: 'Twitter Description'
    };

    renderHook(() => usePageMeta(meta));

    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');

    expect(twitterTitle?.getAttribute('content')).toBe('Twitter Title');
    expect(twitterDescription?.getAttribute('content')).toBe('Twitter Description');
  });

  it('deve atualizar meta tags quando props mudam', () => {
    const meta1 = {
      title: 'First Title',
      description: 'First description'
    };

    const { rerender } = renderHook(() => usePageMeta(meta1));

    expect(document.title).toBe('First Title');

    const meta2 = {
      title: 'Second Title',
      description: 'Second description'
    };

    rerender();
    // Simular a chamada do hook com novos dados
    renderHook(() => usePageMeta(meta2));

    expect(document.title).toBe('Second Title');
  });
});
