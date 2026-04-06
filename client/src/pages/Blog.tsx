import React, { useState, useMemo } from 'react';
import { Navigation } from '@/components/Common/Navigation';
import { blogArticles } from '@/data/blogArticles';
import { Search, Filter, Calendar, Clock, User, Tag, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  // Extrair categorias únicas
  const categories = useMemo(() => {
    return Array.from(new Set(blogArticles.map(a => a.category)));
  }, []);

  // Filtrar artigos
  const filteredArticles = useMemo(() => {
    return blogArticles.filter(article => {
      const matchesSearch = 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = !selectedCategory || article.category === selectedCategory;
      const matchesBrand = !selectedBrand || article.brand === selectedBrand;
      
      return matchesSearch && matchesCategory && matchesBrand;
    });
  }, [searchTerm, selectedCategory, selectedBrand]);

  // SEO Meta Tags
  React.useEffect(() => {
    document.title = 'Blog | Livonius MGA & Livo MGA - Artigos sobre Seguros';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        'Conheça artigos especializados sobre RCO, Energia Solar, Seguro Garantia, Agronegócio e muito mais. Conteúdo educativo para corretores e empresas.'
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navigation type="blog" />

      {/* HERO SECTION */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-teal-50 to-white border-b border-teal-100">
        <div className="container max-w-6xl mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-gray-600">
              <li><a href="/" className="hover:text-teal-600 transition-colors">Home</a></li>
              <li className="text-gray-400">/</li>
              <li className="text-teal-600 font-semibold">Blog</li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Blog Especializado em Seguros
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Conteúdo técnico e educativo sobre RCO, Energia Solar, Garantia, Agronegócio e muito mais.
              Fique atualizado com as tendências do mercado de seguros.
            </p>
          </div>
        </div>
      </section>

      {/* SEARCH & FILTERS */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="container max-w-6xl mx-auto px-4">
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar artigos, palavras-chave..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            {/* Brand Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedBrand(null)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedBrand === null
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todas as Marcas
              </button>
              <button
                onClick={() => setSelectedBrand('livonius')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedBrand === 'livonius'
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Livonius
              </button>
              <button
                onClick={() => setSelectedBrand('livo')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedBrand === 'livo'
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Livo MGA
              </button>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === null
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Filter className="w-4 h-4 inline mr-2" />
                Todas as Categorias
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-6 text-sm text-gray-600">
            Mostrando <span className="font-semibold text-gray-900">{filteredArticles.length}</span> de <span className="font-semibold text-gray-900">{blogArticles.length}</span> artigos
          </div>
        </div>
      </section>

      {/* ARTICLES GRID */}
      <section className="py-16 bg-white">
        <div className="container max-w-6xl mx-auto px-4">
          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map(article => (
                <Link key={article.id} href={`/blog/${article.id}`}>
                  <a className="group h-full">
                    <article className="h-full flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg hover:border-teal-300 transition-all duration-300">
                      {/* Image */}
                      <div className="relative h-48 bg-gradient-to-br from-teal-100 to-blue-100 overflow-hidden">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* Brand Badge */}
                        <div className="absolute top-4 right-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                            article.brand === 'livonius' ? 'bg-teal-600' : 'bg-green-600'
                          }`}>
                            {article.brand === 'livonius' ? 'Livonius' : 'Livo MGA'}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-6 flex flex-col">
                        {/* Category & Date */}
                        <div className="flex items-center justify-between mb-3 text-xs text-gray-500">
                          <span className="inline-block bg-gray-100 px-2 py-1 rounded">
                            {article.category}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(article.date).toLocaleDateString('pt-BR')}
                          </span>
                        </div>

                        {/* Title */}
                        <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors line-clamp-2">
                          {article.title}
                        </h2>

                        {/* Excerpt */}
                        <p className="text-sm text-gray-600 mb-4 flex-1 line-clamp-3">
                          {article.excerpt}
                        </p>

                        {/* Keywords */}
                        <div className="mb-4 flex flex-wrap gap-2">
                          {article.keywords.slice(0, 2).map(keyword => (
                            <span key={keyword} className="inline-flex items-center gap-1 text-xs bg-teal-50 text-teal-700 px-2 py-1 rounded">
                              <Tag className="w-3 h-3" />
                              {keyword}
                            </span>
                          ))}
                          {article.keywords.length > 2 && (
                            <span className="text-xs text-gray-500 px-2 py-1">
                              +{article.keywords.length - 2} mais
                            </span>
                          )}
                        </div>

                        {/* Meta Info */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs text-gray-500">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {article.author}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {article.readTime} min
                            </span>
                          </div>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </article>
                  </a>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-gray-600 mb-4">Nenhum artigo encontrado com esses filtros.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory(null);
                  setSelectedBrand(null);
                }}
                className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                Limpar Filtros
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-16 bg-gradient-to-r from-teal-600 to-blue-600">
        <div className="container max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Quer receber nossos artigos por e-mail?
          </h2>
          <p className="text-teal-100 mb-8 max-w-2xl mx-auto">
            Inscreva-se em nossa newsletter e fique atualizado com as tendências do mercado de seguros.
          </p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Seu e-mail"
              className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="px-6 py-3 bg-white text-teal-600 font-bold rounded-lg hover:bg-gray-100 transition-colors">
              Inscrever
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
