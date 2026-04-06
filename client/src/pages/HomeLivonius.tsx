import React from 'react';
import { Navigation } from '@/components/Common/Navigation';
import { SectionHeader } from '@/components/Common/SectionHeader';
import { BrutalButton } from '@/components/ui/BrutalButton';
import { BrutalCard, BrutalCardContent, BrutalCardHeader, BrutalCardTitle, BrutalCardDescription } from '@/components/ui/BrutalCard';
import { ArrowRight, Shield, Truck, Users, BarChart3 } from 'lucide-react';
import { BrandConnector } from '@/components/Common/BrandConnector';
import { Link } from 'wouter';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function HomeLivonius() {
  usePageMeta({
    title: 'Seguros RCO, Solar e Garantia | Livonius e Livo MGA',
    description: 'Soluções de seguros especializados: RCO para ônibus, energia solar, garantia, agro e engenharia. Cotações rápidas e fáceis com a Livonius e Livo MGA.',
    keywords: 'seguro RCO, seguro ônibus, seguro solar, seguro garantia, seguro agro, seguro engenharia, cotação seguro, seguros empresariais',
    ogUrl: 'https://grupo-livonius.manus.space'
  });
  return (
    <div className="min-h-screen bg-[#FAFAFA] selection:bg-[#056677] selection:text-white">
      <Navigation type="livonius" />
      <div className="pt-20">
        <BrandConnector currentBrand="livonius" />
      </div>
      
      {/* HERO SECTION */}
      <section className="pt-16 pb-24 md:pt-32 md:pb-40 relative overflow-hidden">
        {/* Grid Background Pattern */}
        <div className="absolute inset-0 z-0 opacity-[0.03]" 
             style={{ backgroundImage: 'linear-gradient(#056677 1px, transparent 1px), linear-gradient(90deg, #056677 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>

        <div className="container relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-12 items-center">
            <div className="md:col-span-1 lg:col-span-7 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#056677]/20 bg-[#056677]/5 mb-6 md:mb-8 animate-fade-in-up delay-100">
                <Shield className="w-4 h-4 text-[#056677]" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#056677]">Desde 1888</span>
              </div>
              
              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-[#353E4A] leading-[1.1] tracking-tight mb-6 md:mb-8 animate-fade-in-up delay-200">
                LÍDER EM <br/>
                <span className="text-[#056677]">SEGUROS RC ÔNIBUS</span> <br/>
                NO BRASIL.
              </h1>
              
              <p className="text-base md:text-lg text-[#64748B] font-light max-w-xl leading-relaxed mb-8 md:mb-10 border-l-4 border-[#056677] pl-6 animate-fade-in-up delay-300">
                Especialistas em Responsabilidade Civil Ônibus para transporte de passageiros. 
                Humanização e Segurança para a sua frota.
              </p>
              
              <div className="flex flex-col md:flex-row gap-3 md:gap-4 animate-fade-in-up delay-300">
                <Link href="/cotacao">
                  <BrutalButton variant="teal" size="lg" className="hover:shadow-[0px_0px_20px_rgba(5,102,119,0.4)] transition-shadow duration-300">
                    Cotar Agora <ArrowRight className="ml-2 w-5 h-5" />
                  </BrutalButton>
                </Link>
                <BrutalButton variant="outline" size="lg" onClick={() => window.location.href = '/livonius/rco'}>
                  Nossas Soluções
                </BrutalButton>
              </div>
            </div>

            <div className="md:col-span-1 lg:col-span-5 relative animate-fade-in-up delay-200">
              <div className="aspect-square bg-white border border-[#CBD5E1] shadow-[16px_16px_0px_0px_#056677] relative z-10 overflow-hidden group hover:shadow-[24px_24px_0px_0px_#056677] transition-all duration-500">
                <img 
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310419663026937481/TMB7qrRs2GaLNiTxJVAb3S/hero-livonius-onibus-br-6ST5Ju5AA7HUR8tphK5zvd.webp" 
                  alt="Ônibus moderno em rodovia brasileira" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              {/* Decorative Elements */}
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#056677]/20 rounded-full blur-3xl animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <div className="border-y border-[#CBD5E1] bg-white">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#CBD5E1]">
            {[
              { label: 'Anos de História', value: '130+' },
              { label: 'Corretores Ativos', value: '5K+' },
              { label: 'Passageiros/Dia', value: '2M+' },
              { label: 'Sinistros Pagos', value: 'R$2B+' },
            ].map((stat, i) => (
              <div key={i} className="py-6 md:py-12 px-4 md:px-6 text-center group hover:bg-[#FAFAFA] transition-colors">
                <div className="font-display text-3xl md:text-5xl font-bold text-[#056677] mb-3 group-hover:scale-110 transition-transform duration-300">{stat.value}</div>
                <div className="text-xs font-bold uppercase tracking-widest text-[#64748B]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* GROUP SECTION (CROSS-SELL) */}
      <section className="py-24 md:py-32 bg-[#0F172A] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ backgroundImage: 'linear-gradient(#056677 1px, transparent 1px), linear-gradient(90deg, #056677 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>
        <div className="container relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
            <div className="text-white max-w-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-[1px] w-12 bg-[#056677]"></div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#056677]">Grupo Livonius</span>
              </div>

              <p className="text-[#E2E8F0] text-base md:text-lg font-light leading-relaxed mb-3">
                <strong className="text-white">Parceria exclusiva com a Essor</strong>
              </p>
              <p className="text-[#E2E8F0] text-base md:text-lg font-light leading-relaxed mb-8 md:mb-10">
                Conheça a <strong className="text-white">Livo MGA</strong>, nossa empresa especializada em Seguros de Saúde, Vida, Máquinas Agrícolas, Garantia, Propriedades e Responsabilidades. A mesma solidez, novos horizontes.
              </p>
              <BrutalButton variant="outline" className="text-white border-white hover:bg-white hover:text-[#0F172A]" onClick={() => window.location.href = '/livo'}>
                Conheça a Livo <ArrowRight className="ml-2 w-4 h-4" />
              </BrutalButton>
            </div>
            <div className="w-full md:w-auto">
              <div className="bg-[#1E293B] border border-[#334155] p-6 md:p-8 shadow-[8px_8px_0px_0px_#056677] max-w-full md:max-w-sm mx-auto md:mx-0">
                <div className="flex items-center gap-4 mb-6 md:mb-8">
                  <div className="w-12 h-12 bg-[#7AB72D] rounded flex items-center justify-center flex-shrink-0">
                    <img src="/logo-livo-header.webp" alt="Livo MGA" className="w-10 h-10 object-contain" />
                  </div>
                  <div>
                    <div className="font-display font-bold text-lg md:text-xl text-white">LIVO MGA</div>
                  </div>
                </div>
                <ul className="space-y-2 md:space-y-3 text-[#E2E8F0] text-sm mb-6">
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#7AB72D] flex-shrink-0"></div> <span>Seguros de Saúde</span></li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#7AB72D] flex-shrink-0"></div> <span>Vida</span></li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#7AB72D] flex-shrink-0"></div> <span>Máquinas Agrícolas</span></li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#7AB72D] flex-shrink-0"></div> <span>Garantia</span></li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#7AB72D] flex-shrink-0"></div> <span>Propriedades</span></li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#7AB72D] flex-shrink-0"></div> <span>Responsabilidades</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOLUTIONS SECTION */}
      <section className="py-16 md:py-32 bg-[#FAFAFA]" id="solucoes">
        <div className="container">
          <SectionHeader 
            subtitle="Nossas Soluções"
            title={<>Proteção completa para <br/>transporte de passageiros</>}
            description="Produtos desenhados especificamente para as necessidades do setor de transporte coletivo, com a solidez de quem entende do negócio."
            color="teal"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-8 md:mt-12">
            {[
              { 
                icon: <Shield className="w-8 h-8" />,
                title: 'Seguro RCO', 
                desc: 'Responsabilidade Civil Ônibus exigida pela ANTT. Cobertura nacional para linhas regulares e fretamento.',
                tag: 'RC Ônibus'
              },
            ].map((item, i) => (
              <BrutalCard key={i} className="group h-full bg-white">
                <BrutalCardHeader>
                  <div className="w-14 h-14 bg-[#056677]/10 flex items-center justify-center mb-4 group-hover:bg-[#056677] group-hover:text-white transition-colors duration-300 border border-[#056677]/20">
                    {React.cloneElement(item.icon as React.ReactElement<any>, { strokeWidth: 1.5 })}
                  </div>
                  <div className="inline-block px-2 py-1 bg-[#F1F5F9] text-[10px] font-bold uppercase tracking-wider text-[#64748B] mb-2 w-fit">
                    {item.tag}
                  </div>
                  <BrutalCardTitle className="text-xl mb-2 group-hover:text-[#056677] transition-colors">
                    {item.title}
                  </BrutalCardTitle>
                </BrutalCardHeader>
                <BrutalCardContent>
                  <BrutalCardDescription className="text-base leading-relaxed">
                    {item.desc}
                  </BrutalCardDescription>
                </BrutalCardContent>
              </BrutalCard>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="py-16 md:py-32 bg-white border-y border-[#CBD5E1]" id="sobre">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="aspect-square md:aspect-[4/3] bg-[#F1F5F9] border border-[#CBD5E1] relative z-10">
                {/* Placeholder for About Image */}
                <div className="absolute inset-0 flex items-center justify-center text-[#CBD5E1]">
                  <span className="font-display text-6xl md:text-9xl font-bold opacity-20" style={{color: '#303741'}}>1888</span>
                </div>
              </div>
              <div className="hidden md:block absolute -bottom-6 -right-6 w-full h-full border-2 border-[#056677] z-0"></div>
            </div>
            <div className="order-1 lg:order-2">
              <SectionHeader 
                subtitle="Sobre Nós"
                title="Tradição que evolui com o mercado"
                description="A Livonius é a mais antiga MGA do Brasil, com uma trajetória iniciada em 1888 e construída sobre pilares sólidos de confiança, especialização e compromisso com a proteção."
                color="teal"
                className="mb-6 md:mb-8"
              />
              <div className="space-y-4 md:space-y-6 text-[#64748B] leading-relaxed text-sm md:text-base">
                <p>
                  Ao longo de sua história de mais de 130 anos, evoluímos de uma sociedade de socorros mútuos para se consolidar como referência nacional em seguros para transporte de passageiros. Essa transformação reflete a capacidade de adaptação da empresa às mudanças do mercado, sem abrir mão de seus valores fundamentais.
                </p>
                <p>
                  Atualmente, alinhamos nossa experiência a novas necessidades, atrelando tecnologia de ponta, oferecendo cotações ágeis, subscrição precisa e um atendimento consultivo, profundamente conectado à realidade do mercado.
                </p>
              </div>
              <div className="mt-8 md:mt-10 grid grid-cols-2 gap-6 md:gap-8">
                <div>
                  <div className="font-display text-2xl md:text-3xl font-bold text-[#056677] mb-1">Nacional</div>
                  <div className="text-xs md:text-sm text-[#64748B]">Atuação em todo o Brasil</div>
                </div>
                <div>
                  <div className="font-display text-2xl md:text-3xl font-bold text-[#056677] mb-1">Especialista</div>
                  <div className="text-xs md:text-sm text-[#64748B]">Foco total em transporte de passageiros</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PARTNERS SECTION */}
      <section className="py-16 md:py-24 bg-[#FAFAFA]" id="parceiros">
        <div className="container">
          <div className="text-center mb-8 md:mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#64748B]">Uma parceria exclusiva</span>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-24">
            {/* Partner Logo - ESSOR Only */}
            <div className="text-2xl font-display font-bold text-[#353E4A]">ESSOR</div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-16 md:py-32 bg-[#056677] text-white relative overflow-hidden" id="contato">
        <div className="absolute inset-0 opacity-10" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}>
        </div>
        
        <div className="container relative z-10 text-center">
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8 max-w-4xl mx-auto leading-tight">
            Pronto para proteger sua operação com quem entende de transporte?
          </h2>
          <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto mb-8 md:mb-12 font-light">
            Cotação rápida, atendimento especializado e as melhores condições do mercado para sua frota.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <BrutalButton className="bg-white text-[#056677] hover:bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]" size="lg">
              Falar com Especialista
            </BrutalButton>
            <BrutalButton variant="outline" className="text-white border-white hover:bg-white/10 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]" size="lg">
              Simular RCO Online
            </BrutalButton>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0F172A] text-white py-20 border-t border-[#334155]">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <h3 className="font-display text-2xl font-bold mb-6">GRUPO LIVONIUS ®</h3>
              <p className="text-[#94A3B8] max-w-sm leading-relaxed">
                Líder em RC Ônibus no Brasil há mais de 10 anos. Garantindo segurança do transporte de passageiros com tradição, solidez e inovação.
              </p>
            </div>
            <div>
              <h4 className="font-bold uppercase tracking-widest text-sm mb-6 text-[#056677]">Produtos</h4>
              <ul className="space-y-4 text-[#94A3B8]">
                <li><a href="#" className="hover:text-white transition-colors">SEGURO RCO</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold uppercase tracking-widest text-sm mb-6 text-[#056677]">Contato</h4>
              <ul className="space-y-4 text-[#94A3B8]">
                <li><strong>RCO:</strong> 0800 700 8000</li>
                <li><strong>Corporate:</strong> contato@livonius.com.br</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-[#334155] flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[#64748B]">
            <p>© 2026 Grupo Livonius. Todos os direitos reservados.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white">Privacidade</a>
              <a href="#" className="hover:text-white">Termos</a>
              <a href="#" className="hover:text-white">Compliance</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
