import React from 'react';
import { Navigation } from '@/components/Common/Navigation';
import { BrutalCard, BrutalCardContent, BrutalCardHeader, BrutalCardTitle } from '@/components/ui/BrutalCard';
import { ArrowRight, Calendar, Clock } from 'lucide-react';

export default function BlogUnificado() {
  const posts = [
    { 
      id: 1, 
      brand: 'livonius', 
      cat: 'Transportes', 
      title: 'RCO 2026: principais mudanças na regulamentação da ANTT', 
      desc: 'Entenda o que muda para as empresas de transporte de passageiros com as novas resoluções.',
      date: '12 Jan 2026', 
      read: '5 min',
      image: '/blog-rco-2026-antt.jpg',
      keywords: 'RCO, ANTT, transporte, regulamentação, ônibus'
    },
    { 
      id: 2, 
      brand: 'livo', 
      cat: 'Solar', 
      title: 'Como proteger sua usina fotovoltaica em 2026', 
      desc: 'Riscos climáticos e elétricos estão aumentando. Saiba como blindar seu investimento em energia solar.',
      date: '10 Jan 2026', 
      read: '4 min',
      image: '/blog-solar-2026-protection.jpg',
      keywords: 'energia solar, fotovoltaica, seguros, proteção'
    },
    { 
      id: 3, 
      brand: 'grupo', 
      cat: 'Mercado', 
      title: 'MGAs digitais: o futuro do mercado de seguros no Brasil', 
      desc: 'Como a tecnologia está transformando a subscrição de riscos e a relação com corretores.',
      date: '8 Jan 2026', 
      read: '6 min',
      image: '/blog-mgas-digital-future.jpg',
      keywords: 'MGA, seguros, transformação digital, tecnologia'
    },
    { 
      id: 4, 
      brand: 'livonius', 
      cat: 'Frota', 
      title: 'Gestão de riscos em frotas de ônibus: guia completo', 
      desc: 'Práticas essenciais para reduzir a sinistralidade e aumentar a eficiência operacional.',
      date: '5 Jan 2026', 
      read: '5 min',
      image: '/blog-frota-risco.jpg',
      keywords: 'gestão de frotas, ônibus, sinistralidade, riscos'
    },
    { 
      id: 5, 
      brand: 'livo', 
      cat: 'Agrícola', 
      title: 'Seguro rural: tendências e projeções para a safra 2026', 
      desc: 'O que esperar do clima e do mercado para o próximo ciclo produtivo.',
      date: '3 Jan 2026', 
      read: '4 min',
      image: '/blog-seguro-rural-safra.jpg',
      keywords: 'seguro rural, agronegócio, safra, penhor rural'
    },
    { 
      id: 6, 
      brand: 'livo', 
      cat: 'Garantia', 
      title: 'Seguro garantia em licitações: tudo que você precisa saber', 
      desc: 'Como utilizar o seguro garantia para participar de concorrências públicas com segurança.',
      date: '2 Jan 2026', 
      read: '5 min',
      image: '/blog-garantia-licitacoes.jpg',
      keywords: 'seguro garantia, licitações, concorrências, públicas'
    },
  ];

  // SEO Meta Tags
  React.useEffect(() => {
    document.title = 'Blog Livonius e Livo MGA | Conteúdo Especializado em Seguros';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Artigos, análises e novidades sobre seguros RCO, solar, agrícola e garantia. Conteúdo especializado para corretores e empresas.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navigation type="blog" />
      
      {/* HERO SECTION */}
      <section className="pt-48 pb-32 bg-[#FAFAFA] border-b-2 border-[#E2E8F0]">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            {/* Breadcrumb */}
            <nav className="mb-8" aria-label="Breadcrumb">
              <ol className="flex justify-center items-center gap-2 text-sm text-[#64748B]">
                <li><a href="/" className="hover:text-[#0D7C7C] transition-colors">Home</a></li>
                <li className="text-[#CBD5E1]">/</li>
                <li className="text-[#0D7C7C] font-semibold">Blog</li>
              </ol>
            </nav>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#1A1A1A] leading-tight mb-8 tracking-tight">
              Conteúdo Especializado em Seguros
            </h1>
            
            {/* Subheading */}
            <p className="text-xl md:text-2xl text-[#4A5568] leading-relaxed max-w-3xl mx-auto mb-12">
              Artigos, análises e novidades sobre o mercado de seguros das empresas <span className="font-semibold text-[#0D7C7C]">Livonius MGA</span> e <span className="font-semibold text-[#B8D61A]">Livo MGA</span>.
            </p>
            
            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-3">
              {['Todos', 'Transportes', 'Solar', 'Agrícola', 'Mercado', 'Institucional'].map((cat, i) => (
                <button 
                  key={cat}
                  className={`px-6 py-3 text-sm font-bold uppercase tracking-wider border-2 transition-all rounded-sm
                    ${i === 0 
                      ? 'bg-[#0D7C7C] text-white border-[#0D7C7C] shadow-lg hover:shadow-xl' 
                      : 'bg-white text-[#0D7C7C] border-[#0D7C7C] hover:bg-[#0D7C7C] hover:text-white hover:shadow-lg'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* POSTS GRID */}
      <section className="py-32 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {posts.map((post) => {
              const isLivonius = post.brand === 'livonius';
              const isLivo = post.brand === 'livo';
              const brandColor = isLivonius ? '#0D7C7C' : isLivo ? '#B8D61A' : '#1A1A1A';
              const brandBg = isLivonius ? 'bg-[#0D7C7C]' : isLivo ? 'bg-[#B8D61A]' : 'bg-[#1A1A1A]';
              const brandText = isLivonius ? 'text-[#0D7C7C]' : isLivo ? 'text-[#B8D61A]' : 'text-[#1A1A1A]';

              return (
                <article 
                  key={post.id}
                  className="group h-full flex flex-col"
                >
                  <BrutalCard 
                    className="h-full flex flex-col hover:shadow-2xl transition-all duration-300 cursor-pointer"
                    onClick={() => window.location.href = `/blog/post-${post.id}`}
                  >
                    {/* Image Container */}
                    <div className="relative h-64 w-full overflow-hidden bg-gradient-to-br from-[#E2E8F0] to-[#CBD5E1]">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Overlay on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <span className={`inline-block px-4 py-2 ${brandBg} ${isLivo ? 'text-[#1A1A1A]' : 'text-white'} text-xs font-bold uppercase tracking-widest rounded-sm shadow-md`}>
                          {post.cat}
                        </span>
                      </div>

                      {/* Brand Badge */}
                      <div className="absolute top-4 right-4">
                        <span className="inline-block px-3 py-1 bg-white/95 text-[#1A1A1A] text-xs font-bold uppercase tracking-widest rounded-sm">
                          {post.brand === 'livonius' ? 'LIVONIUS' : post.brand === 'livo' ? 'LIVO' : 'GRUPO'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <BrutalCardHeader className="pt-8 pb-4 flex-grow">
                      <h2 className={`text-2xl font-bold leading-snug mb-4 group-hover:${brandText} transition-colors line-clamp-3`}>
                        {post.title}
                      </h2>
                      <p className="text-base text-[#4A5568] leading-relaxed line-clamp-3">
                        {post.desc}
                      </p>
                    </BrutalCardHeader>
                    
                    {/* Footer */}
                    <BrutalCardContent className="pt-6 pb-8 border-t-2 border-[#E2E8F0]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6 text-sm text-[#64748B] font-medium">
                          <span className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#0D7C7C]" />
                            {post.date}
                          </span>
                          <span className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-[#0D7C7C]" />
                            {post.read}
                          </span>
                        </div>
                        <ArrowRight className={`w-5 h-5 ${brandText} opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300`} />
                      </div>
                    </BrutalCardContent>
                  </BrutalCard>
                </article>
              );
            })}
          </div>
          
          {/* Load More Button */}
          <div className="flex justify-center">
            <button className="px-8 py-4 text-sm font-bold uppercase tracking-widest text-white bg-[#0D7C7C] border-2 border-[#0D7C7C] hover:bg-white hover:text-[#0D7C7C] transition-all duration-300 shadow-lg hover:shadow-xl rounded-sm">
              Carregar Mais Artigos
            </button>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-32 bg-gradient-to-r from-[#0D7C7C] to-[#056677] text-white">
        <div className="container max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Receba Nossas Atualizações
            </h2>
            <p className="text-lg text-white/90 leading-relaxed">
              Inscreva-se para receber as últimas notícias do mercado de seguros e novidades do Grupo Livonius diretamente no seu e-mail.
            </p>
          </div>
          
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Seu melhor e-mail" 
              className="flex-1 h-14 px-6 bg-white/10 border-2 border-white/30 text-white placeholder:text-white/60 focus:border-white focus:ring-0 outline-none rounded-sm transition-all"
              required
            />
            <button 
              type="submit"
              className="h-14 px-8 bg-white text-[#0D7C7C] font-bold uppercase tracking-wider hover:bg-[#B8D61A] hover:text-[#1A1A1A] transition-all duration-300 whitespace-nowrap rounded-sm shadow-lg hover:shadow-xl"
            >
              Inscrever
            </button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0F172A] text-white py-16 border-t-2 border-[#334155]">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              <h3 className="font-bold text-lg mb-4 text-[#B8D61A]">GRUPO LIVONIUS</h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed">
                Há mais de 135 anos garantindo segurança do transporte de passageiros no Brasil, com tradição, solidez e inovação.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider mb-4">Navegação</h4>
              <ul className="space-y-2 text-sm text-[#94A3B8]">
                <li><a href="/" className="hover:text-[#B8D61A] transition-colors">Home</a></li>
                <li><a href="/blog" className="hover:text-[#B8D61A] transition-colors">Blog</a></li>
                <li><a href="#contato" className="hover:text-[#B8D61A] transition-colors">Contato</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider mb-4">Empresas</h4>
              <ul className="space-y-2 text-sm text-[#94A3B8]">
                <li><a href="https://livoniusmga.com.br" className="hover:text-[#B8D61A] transition-colors">Livonius MGA</a></li>
                <li><a href="https://livomga.com.br" className="hover:text-[#B8D61A] transition-colors">Livo MGA</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-[#334155] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[#64748B]">
              © 2026 Grupo Livonius. Todos os direitos reservados.
            </p>
            <p className="text-sm text-[#64748B]">
              Blog Oficial | Conteúdo Especializado em Seguros
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
