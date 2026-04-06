import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, Download } from 'lucide-react';

interface BlogArticleProps {
  id: string;
  title: string;
  subtitle: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  category: string;
  readTime: number;
  keywords: string[];
  location?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export const BlogArticle: React.FC<BlogArticleProps> = ({
  id,
  title,
  subtitle,
  excerpt,
  content,
  image,
  author,
  date,
  category,
  readTime,
  keywords,
  location = 'Brasil',
  seoTitle,
  seoDescription,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  // SEO Meta Tags
  useEffect(() => {
    document.title = seoTitle || `${title} | Blog Livo & Livonius`;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', seoDescription || excerpt);
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywords.join(', '));
    }

    // Open Graph
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute('content', excerpt);

    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) ogImage.setAttribute('content', image);

    // Schema.org JSON-LD
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: title,
      description: excerpt,
      image: image,
      author: {
        '@type': 'Person',
        name: author,
      },
      datePublished: date,
      articleBody: content,
      keywords: keywords,
      geo: {
        '@type': 'Place',
        name: location,
      },
    };

    const scriptTag = document.createElement('script');
    scriptTag.type = 'application/ld+json';
    scriptTag.textContent = JSON.stringify(schema);
    document.head.appendChild(scriptTag);

    return () => {
      document.head.removeChild(scriptTag);
    };
  }, [title, excerpt, content, image, author, date, keywords, location, seoTitle, seoDescription]);

  // Text-to-Speech
  const synthesizeAudio = async () => {
    setIsSynthesizing(true);
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: content, articleId: id }),
      });
      const data = await response.json();
      setAudioUrl(data.audioUrl);
      setIsPlaying(true);
    } catch (error) {
      console.error('Erro ao sintetizar áudio:', error);
    } finally {
      setIsSynthesizing(false);
    }
  };

  // Extrair resumo automático (primeiros 3 parágrafos)
  const paragraphs = content.split('\n\n').slice(0, 3);
  const summary = paragraphs.join('\n\n');

  // Extrair destaques (frases em negrito)
  const highlights = content.match(/\*\*(.*?)\*\*/g) || [];

  return (
    <article className="bg-white">
      {/* SEO Breadcrumb */}
      <nav className="container mx-auto px-4 py-4 text-sm text-gray-600">
        <a href="/" className="hover:text-teal-600">Home</a>
        <span className="mx-2">/</span>
        <a href="/blog" className="hover:text-teal-600">Blog</a>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{title}</span>
      </nav>

      {/* Hero Image */}
      <div className="relative w-full h-96 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>

      {/* Article Header */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Meta Info */}
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full">{category}</span>
            <span>{new Date(date).toLocaleDateString('pt-BR')}</span>
            <span>{readTime} min de leitura</span>
            <span>📍 {location}</span>
          </div>

          {/* H1 Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {title}
          </h1>

          {/* H2 Subtitle */}
          <h2 className="text-xl text-gray-700 mb-6 font-semibold">
            {subtitle}
          </h2>

          {/* Author Info */}
          <div className="flex items-center gap-4 pb-8 border-b border-gray-200">
            <div>
              <p className="font-semibold text-gray-900">Por {author}</p>
              <p className="text-sm text-gray-600">Especialista em Seguros</p>
            </div>
          </div>
        </div>
      </div>

      {/* Audio Player */}
      <div className="container mx-auto px-4 py-6 bg-gray-50">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <Volume2 className="w-5 h-5 text-teal-600" />
          <button
            onClick={synthesizeAudio}
            disabled={isSynthesizing}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                Pausar Leitura
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Ouvir Artigo
              </>
            )}
          </button>
          {isSynthesizing && <span className="text-gray-600">Preparando áudio...</span>}
          {audioUrl && (
            <a
              href={audioUrl}
              download
              className="flex items-center gap-2 px-4 py-2 border border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50"
            >
              <Download className="w-4 h-4" />
              Baixar Áudio
            </a>
          )}
        </div>
      </div>

      {/* Summary Box */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-blue-50 border-l-4 border-teal-600 p-6 rounded">
          <h3 className="font-bold text-gray-900 mb-3">📋 Resumo do Artigo</h3>
          <p className="text-gray-700 leading-relaxed">{summary}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto prose prose-lg max-w-none">
          {/* Parse content with proper formatting */}
          {content.split('\n\n').map((paragraph, idx) => {
            if (paragraph.startsWith('##')) {
              return (
                <h2 key={idx} className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                  {paragraph.replace(/^##\s/, '')}
                </h2>
              );
            }
            if (paragraph.startsWith('###')) {
              return (
                <h3 key={idx} className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                  {paragraph.replace(/^###\s/, '')}
                </h3>
              );
            }
            return (
              <p key={idx} className="text-gray-700 leading-relaxed mb-6">
                {paragraph}
              </p>
            );
          })}
        </div>
      </div>

      {/* Highlights Box */}
      {highlights.length > 0 && (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto bg-yellow-50 border border-yellow-200 p-6 rounded">
            <h3 className="font-bold text-gray-900 mb-4">⭐ Pontos-Chave</h3>
            <ul className="space-y-2">
              {highlights.slice(0, 5).map((highlight, idx) => (
                <li key={idx} className="flex items-start gap-3 text-gray-700">
                  <span className="text-teal-600 font-bold mt-1">✓</span>
                  <span>{highlight.replace(/\*\*/g, '')}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Keywords */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h3 className="font-bold text-gray-900 mb-4">🏷️ Palavras-Chave</h3>
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword, idx) => (
              <span
                key={idx}
                className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm hover:bg-teal-200 cursor-pointer"
              >
                #{keyword}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-teal-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Interessado em conhecer nossas soluções?</h3>
          <p className="text-teal-100 mb-6">Fale com um especialista e descubra como proteger seu negócio</p>
          <button className="bg-white text-teal-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100">
            Solicitar Cotação
          </button>
        </div>
      </div>
    </article>
  );
};
