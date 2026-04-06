import React from 'react';
import { useRoute } from 'wouter';
import { Navigation } from '@/components/Common/Navigation';
import { BrandConnector } from '@/components/Common/BrandConnector';
import { BrutalButton } from '@/components/ui/BrutalButton';
import { ArrowLeft, ArrowRight, Calendar, Clock, Share2, Facebook, Linkedin, Twitter, User } from 'lucide-react';

export default function BlogPost() {
  const [match, params] = useRoute("/blog/:slug");
  
  // Mock data - in a real app, fetch based on slug
  const post = {
    title: 'RCO 2026: principais mudanças na regulamentação da ANTT',
    brand: 'livonius', // 'livonius' | 'livo' | 'grupo'
    category: 'Transportes',
    date: '12 Jan 2026',
    readTime: '5 min',
    author: 'Carlos Mendes',
    role: 'Diretor Técnico',
    content: `
      <p class="lead">O cenário regulatório para o transporte de passageiros está passando por uma transformação significativa. As novas resoluções da ANTT para 2026 trazem exigências que impactam diretamente a gestão de riscos das frotas.</p>

      <h2>O que muda na prática?</h2>
      <p>A principal alteração diz respeito aos limites de indenização para danos corporais. A partir de março de 2026, as empresas que operam linhas interestaduais precisarão adequar suas apólices para garantir a conformidade com os novos tetos estabelecidos.</p>
      
      <blockquote>
        "A segurança jurídica do transportador depende não apenas de ter um seguro, mas de ter a cobertura correta para o cenário atual."
      </blockquote>

      <p>Além disso, a digitalização dos processos de fiscalização exigirá que as apólices estejam integradas em tempo real com o sistema Monitriip. Isso significa que a emissão e a validação dos certificados de seguro precisarão ser instantâneas.</p>

      <h2>Impacto no custo operacional</h2>
      <p>Embora o aumento das coberturas possa sugerir um incremento no prêmio, a Livonius tem trabalhado em modelos de subscrição baseados em telemetria que permitem descontos para frotas com baixos índices de sinistralidade. É a tecnologia atuando a favor da redução de custos.</p>

      <h3>Pontos de atenção para o gestor de frota:</h3>
      <ul>
        <li>Revisão dos limites de RCO na renovação da apólice</li>
        <li>Integração dos dados da frota com a seguradora</li>
        <li>Treinamento dos motoristas para redução de sinistralidade</li>
      </ul>

      <p>Manter-se atualizado não é apenas uma questão de compliance, mas de sobrevivência e competitividade no mercado. A Livonius está preparada para apoiar seus parceiros nessa transição.</p>
    `
  };

  const isLivonius = post.brand === 'livonius';
  const isLivo = post.brand === 'livo';
  
  const brandColor = isLivonius ? '#056677' : isLivo ? '#0284C7' : '#353E4A';
  const brandBg = isLivonius ? 'bg-[#056677]' : isLivo ? 'bg-[#0284C7]' : 'bg-[#353E4A]';
  const brandText = isLivonius ? 'text-[#056677]' : isLivo ? 'text-[#0284C7]' : 'text-[#353E4A]';
  const selectionClass = isLivonius ? 'selection:bg-[#056677]' : isLivo ? 'selection:bg-[#0284C7]' : 'selection:bg-[#353E4A]';

  return (
    <div className={`min-h-screen bg-white ${selectionClass} selection:text-white`}>
      <Navigation type={post.brand as any} />
      <div className="pt-20">
        <BrandConnector currentBrand={post.brand as any} />
      </div>

      {/* BACK BUTTON */}
      <div className="container max-w-4xl mx-auto pt-8">
        <button 
          onClick={() => window.history.back()} 
          className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#64748B] hover:text-[#353E4A] transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Voltar
        </button>
      </div>

      {/* ARTICLE HERO */}
      <header className="relative pt-20 pb-20 overflow-hidden bg-[#FAFAFA] border-b border-[#CBD5E1]">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ backgroundImage: `linear-gradient(${brandColor} 1px, transparent 1px), linear-gradient(90deg, ${brandColor} 1px, transparent 1px)`, backgroundSize: '40px 40px' }}>
        </div>
        
        <div className="container relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 mb-8">
            <span className={`px-3 py-1 text-xs font-bold uppercase tracking-widest border ${brandText} border-current bg-white`}>
              {post.category}
            </span>
            <span className="h-px w-8 bg-[#CBD5E1]"></span>
            <span className="text-xs font-bold uppercase tracking-widest text-[#64748B]">
              {post.date}
            </span>
          </div>

          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-[#353E4A] leading-[1.1] mb-8">
            {post.title}
          </h1>

          <div className="flex items-center justify-center gap-8 text-sm text-[#64748B]">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full ${brandBg} flex items-center justify-center text-white`}>
                <User className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="font-bold text-[#353E4A]">{post.author}</div>
                <div className="text-xs">{post.role}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.readTime} de leitura</span>
            </div>
          </div>
        </div>
      </header>

      {/* CONTENT AREA */}
      <div className="container max-w-4xl mx-auto py-16 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Sidebar / Share */}
          <aside className="lg:col-span-2 lg:sticky lg:top-32 h-fit order-2 lg:order-1">
            <div className="flex lg:flex-col items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#94A3B8] lg:-rotate-90 lg:mb-4 whitespace-nowrap">Compartilhar</span>
              <button className="w-10 h-10 border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:bg-[#353E4A] hover:text-white hover:border-[#353E4A] transition-all">
                <Linkedin className="w-4 h-4" />
              </button>
              <button className="w-10 h-10 border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:bg-[#353E4A] hover:text-white hover:border-[#353E4A] transition-all">
                <Twitter className="w-4 h-4" />
              </button>
              <button className="w-10 h-10 border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:bg-[#353E4A] hover:text-white hover:border-[#353E4A] transition-all">
                <Facebook className="w-4 h-4" />
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <article className="lg:col-span-8 order-1 lg:order-2">
            <div 
              className="prose prose-lg max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:text-[#353E4A] prose-p:text-[#475569] prose-p:leading-relaxed prose-blockquote:border-l-4 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-[#353E4A] prose-li:text-[#475569]"
              style={{
                '--tw-prose-quote-borders': brandColor,
                '--tw-prose-bullets': brandColor,
              } as React.CSSProperties}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            
            {/* Tags */}
            <div className="mt-12 pt-8 border-t border-[#E2E8F0] flex gap-2">
              {['Regulação', 'ANTT', 'Seguros', 'Transporte'].map(tag => (
                <span key={tag} className="px-3 py-1 bg-[#F1F5F9] text-xs font-bold uppercase tracking-wide text-[#64748B] hover:bg-[#E2E8F0] cursor-pointer transition-colors">
                  #{tag}
                </span>
              ))}
            </div>
          </article>

          {/* Empty Column for Balance */}
          <div className="hidden lg:block lg:col-span-2 order-3"></div>
        </div>
      </div>

      {/* READ NEXT */}
      <section className="py-20 bg-[#FAFAFA] border-t border-[#CBD5E1]">
        <div className="container max-w-6xl">
          <div className="flex items-center justify-between mb-12">
            <h3 className="font-display text-2xl font-bold text-[#353E4A]">Continue Lendo</h3>
            <BrutalButton variant="outline" size="sm" onClick={() => window.location.href = '/blog'}>
              Ver Todos <ArrowRight className="ml-2 w-4 h-4" />
            </BrutalButton>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="group cursor-pointer">
                <div className="aspect-video bg-white border border-[#E2E8F0] mb-4 relative overflow-hidden">
                  <div className={`absolute inset-0 ${brandBg} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-display text-4xl font-bold opacity-10">0{i}</span>
                  </div>
                </div>
                <div className="text-xs font-bold uppercase tracking-widest text-[#94A3B8] mb-2">Transportes</div>
                <h4 className="font-display text-lg font-bold text-[#353E4A] group-hover:text-[#056677] transition-colors">
                  Gestão de riscos em frotas de ônibus: guia completo
                </h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER SIMPLE */}
      <footer className="bg-[#0F172A] text-white py-12 border-t border-[#334155]">
        <div className="container text-center">
          <div className="font-display font-bold text-xl mb-4">GRUPO LIVONIUS</div>
          <div className="text-sm text-[#64748B]">
            © 2026 Grupo Livonius. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
