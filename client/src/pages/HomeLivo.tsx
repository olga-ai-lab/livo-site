import React from 'react';
import { Navigation } from '@/components/Common/Navigation';
import { SectionHeader } from '@/components/Common/SectionHeader';
import { BrutalButton } from '@/components/ui/BrutalButton';
import { BrutalCard, BrutalCardContent, BrutalCardHeader, BrutalCardTitle, BrutalCardDescription } from '@/components/ui/BrutalCard';
import { ArrowRight, Sun, Briefcase, Tractor, HardHat, Heart, Zap, Building2, Shield } from 'lucide-react';
import { Link } from 'wouter';

export default function HomeLivo() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] selection:bg-[#7AB72D] selection:text-white">
      <Navigation type="livo" />
      
      {/* HERO SECTION */}
      <section className="pt-16 pb-24 md:pt-32 md:pb-40 relative overflow-hidden">
        {/* Dot Background Pattern */}
        <div className="absolute inset-0 z-0 opacity-[0.05]" 
             style={{ backgroundImage: 'radial-gradient(#7AB72D 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
        </div>

        <div className="container relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-12 items-center">
            <div className="md:col-span-1 lg:col-span-7 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#7AB72D]/20 bg-[#7AB72D]/5 mb-6 md:mb-8 animate-fade-in-up delay-100">
                <span className="w-2 h-2 bg-[#7AB72D]"></span>
                <span className="text-xs font-bold uppercase tracking-widest text-[#7AB72D]">Livo MGA</span>
              </div>
              
              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-[#1A1A1A] leading-[1.1] tracking-tight mb-6 md:mb-8 animate-fade-in-up delay-200">
                SEGUROS PARA <br/>
                <span className="text-[#7AB72D]">NEGÓCIOS</span> QUE <br/>
                NÃO PARAM.
              </h1>
              
              <p className="text-base md:text-lg text-[#64748B] font-light max-w-xl leading-relaxed mb-8 md:mb-10 border-l-4 border-[#7AB72D] pl-6 animate-fade-in-up delay-300">
                Soluções especializadas em Seguros de Saúde, Vida, Máquinas Agrícolas, Garantia, Propriedades e Responsabilidades. 
                Agilidade na cotação e segurança na operação.
              </p>
              
              <div className="flex flex-col md:flex-row gap-3 md:gap-4 animate-fade-in-up delay-300">
                <Link href="/cotacao">
                  <BrutalButton variant="lime" size="lg" className="hover:shadow-[0px_0px_20px_rgba(122,183,45,0.4)] transition-shadow duration-300">
                    Cotar Agora <ArrowRight className="ml-2 w-5 h-5" />
                  </BrutalButton>
                </Link>
                <BrutalButton variant="outline" size="lg" className="hover:text-[#7AB72D] hover:border-[#7AB72D]" onClick={() => window.location.href = '/livo/solar'}>
                  Conhecer Produtos
                </BrutalButton>
              </div>
            </div>

            <div className="md:col-span-1 lg:col-span-5 relative animate-fade-in-up delay-200">
              <div className="aspect-square md:aspect-[4/5] bg-white border border-[#CBD5E1] shadow-[16px_16px_0px_0px_#1A1A1A] relative z-10 overflow-hidden group hover:shadow-[24px_24px_0px_0px_#7AB72D] transition-all duration-500">
                <img 
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310419663026937481/TMB7qrRs2GaLNiTxJVAb3S/hero-livo-brasil-agro-CZFhwNocd4A7ivmPuUYKPe.webp" 
                  alt="Agricultura e energia renovável no Brasil" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              {/* Decorative Elements */}
              <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-[#7AB72D]/20 rounded-full blur-3xl animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* GROUP SECTION (CROSS-SELL) */}
      <section className="py-24 bg-[#1A1A1A] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ backgroundImage: 'linear-gradient(#7AB72D 1px, transparent 1px), linear-gradient(90deg, #7AB72D 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>
        <div className="container relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="text-white max-w-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-[1px] w-12 bg-[#7AB72D]"></div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7AB72D]">Grupo Livonius</span>
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">Transporte de passageiros?</h2>
              <p className="text-[#94A3B8] text-lg font-light leading-relaxed mb-8">
                A <strong className="text-white">Livonius MGA</strong> é líder nacional em seguros RCO para ônibus e vans. Proteção especializada para quem transporta vidas.
              </p>
              <BrutalButton variant="outline" className="text-white border-white hover:bg-white hover:text-[#1A1A1A]" onClick={() => window.location.href = '/livonius'}>
                Conhecer Livonius <ArrowRight className="ml-2 w-4 h-4" />
              </BrutalButton>
            </div>
            <div className="w-full md:w-auto">
              <div className="bg-[#2A2A2A] border border-[#3A3A3A] p-8 shadow-[8px_8px_0px_0px_#7AB72D] max-w-sm mx-auto md:mx-0">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-[#056677] rounded flex items-center justify-center">
                    <img src="/logo-livonius-branco.svg" alt="Livonius" className="w-8 h-8 object-contain" />
                  </div>
                  <div>
                    <div className="font-display font-bold text-xl text-white">LIVONIUS</div>
                    <div className="text-xs text-[#94A3B8] uppercase tracking-wider">MGA</div>
                  </div>
                </div>
                <ul className="space-y-3 text-[#CBD5E1] text-sm mb-6">
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#056677]"></div> RCO Ônibus</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#056677]"></div> APP Coletivo</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS SECTION */}
      <section className="py-32 bg-white" id="produtos">
        <div className="container">
          <SectionHeader 
            subtitle="Nossos Produtos"
            title={<>Soluções completas para <br/>cada segmento</>}
            description="Proteção desenhada sob medida para os riscos específicos do seu setor, com coberturas abrangentes e contratação simplificada."
            color="lime"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                icon: <Heart className="w-8 h-8" />,
                title: 'Saúde', 
                desc: 'Proteção completa em saúde. Coberturas abrangentes para empresas e colaboradores.',
                tag: 'Saúde',
                link: '/livo/saude'
              },
              { 
                icon: <Heart className="w-8 h-8" />,
                title: 'Vida', 
                desc: 'Seguros de vida com coberturas customizadas. Proteção financeira para sua família e negócio.',
                tag: 'Vida',
                link: '/livo/saude'
              },
              { 
                icon: <Tractor className="w-8 h-8" />,
                title: 'Máquinas Agrícolas', 
                desc: 'Proteção para máquinas e equipamentos agrícolas. Cobertura para RD e operações rurais.',
                tag: 'Rural',
                link: '/livo/agro'
              },
              { 
                icon: <Briefcase className="w-8 h-8" />,
                title: 'Garantia', 
                desc: 'Garantias contratuais, judiciais e licitações. Emissão ágil para não travar seus negócios.',
                tag: 'Corporativo',
                link: '/livo/garantia'
              },
              { 
                icon: <Building2 className="w-8 h-8" />,
                title: 'Propriedades', 
                desc: 'Proteção patrimonial completa. Cobertura para imóveis, conteúdo e responsabilidades.',
                tag: 'Patrimonial',
                link: '/livo/propriedades'
              },
              { 
                icon: <Shield className="w-8 h-8" />,
                title: 'Responsabilidades', 
                desc: 'Responsabilidade civil e profissional. Proteção contra riscos de terceiros.',
                tag: 'Responsabilidade',
                link: '/livo/propriedades'
              },
              { 
                icon: <Zap className="w-8 h-8" />,
                title: 'RD Placas Solares', 
                desc: 'Proteção para sistemas de energia solar. Cobertura completa de equipamentos e instalação.',
                tag: 'Energia',
                link: '/livo/solar'
              },
              { 
                icon: <HardHat className="w-8 h-8" />,
                title: 'Riscos de Engenharia', 
                desc: 'Proteção para obras e projetos. Cobertura de riscos de construção e instalação.',
                tag: 'Engenharia',
                link: '/livo/engenharia'
              },
              { 
                icon: <Tractor className="w-8 h-8" />,
                title: 'Agrícola', 
                desc: 'Proteção completa para operações agrícolas. Cobertura de safra e riscos rurais.',
                tag: 'Agronegócio',
                link: '/livo/agro'
              },
            ].map((item, i) => (
              <Link key={i} href={item.link}>
                <BrutalCard className="group h-full bg-[#FAFAFA] hover:bg-white border-[#E2E8F0] shadow-[4px_4px_0px_0px_#E2E8F0] hover:shadow-[6px_6px_0px_0px_#7AB72D] hover:border-[#7AB72D] cursor-pointer">
                  <BrutalCardHeader>
                    <div className="w-14 h-14 bg-[#7AB72D]/10 flex items-center justify-center mb-4 group-hover:bg-[#7AB72D] group-hover:text-white transition-colors duration-300 border border-[#7AB72D]/20">
                      {React.cloneElement(item.icon as React.ReactElement<any>, { strokeWidth: 1.5 })}
                    </div>
                    <div className="inline-block px-2 py-1 bg-white border border-[#E2E8F0] text-[10px] font-bold uppercase tracking-wider text-[#64748B] mb-2 w-fit group-hover:border-[#7AB72D] group-hover:text-[#7AB72D]">
                      {item.tag}
                    </div>
                    <BrutalCardTitle className="text-xl mb-2 group-hover:text-[#7AB72D] transition-colors">
                      {item.title}
                    </BrutalCardTitle>
                  </BrutalCardHeader>
                  <BrutalCardContent>
                    <BrutalCardDescription className="text-base leading-relaxed">
                      {item.desc}
                    </BrutalCardDescription>
                  </BrutalCardContent>
                </BrutalCard>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="py-16 md:py-32 bg-[#FAFAFA] border-y border-[#CBD5E1]" id="sobre">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <SectionHeader 
                subtitle="Sobre a Livo"
                title="Inovação com a solidez de um grupo centenário"
                description="A Livo MGA nasceu para expandir a expertise do Grupo Livonius para novos horizontes. Focamos em nichos corporativos que exigem alta especialização técnica."
                color="lime"
                className="mb-6 md:mb-8"
              />
              <div className="space-y-4 md:space-y-6 text-[#64748B] leading-relaxed text-sm md:text-base">
                <p>
                  Somos uma MGA ágil, desenhada para o mercado moderno. Nossa estrutura permite a criação de produtos sob medida e uma velocidade de resposta que o mercado corporativo exige.
                </p>
                <p>
                  Atuamos em parceria com as maiores seguradoras do Brasil, garantindo capacidade de subscrição e segurança financeira para riscos complexos em Energia, Agronegócio e Infraestrutura.
                </p>
              </div>
              <div className="mt-8 md:mt-10 grid grid-cols-2 gap-6 md:gap-8">
                <div>
                  <div className="font-display text-xs md:text-sm font-bold uppercase tracking-wider text-[#7AB72D] mb-1">Ágil</div>
                  <div className="text-xs md:text-sm text-[#64748B]">Cotações rápidas e digitais</div>
                </div>
                <div>
                  <div className="font-display text-xs md:text-sm font-bold uppercase tracking-wider text-[#7AB72D] mb-1">Técnica</div>
                  <div className="text-xs md:text-sm text-[#64748B]">Subscrição especializada</div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="bg-white border border-[#CBD5E1] p-6 md:p-8 shadow-[12px_12px_0px_0px_#1A1A1A]">
                <div className="text-xs font-bold uppercase tracking-widest text-[#64748B] mb-4">Parceiros de Negócios</div>
                <div className="grid grid-cols-2 gap-4 md:gap-6">
                  {['Essor', 'Amil', 'MetLife', 'Junto'].map((partner, i) => (
                    <div key={i} className="h-16 bg-[#FAFAFA] border border-[#E2E8F0] flex items-center justify-center font-display font-bold text-[#94A3B8] text-sm tracking-wider">
                      {partner}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-16 md:py-24 bg-[#7AB72D] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" 
             style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>
        <div className="container relative z-10 text-center">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">
            Sua empresa não pode parar.<br/>Nós garantimos isso.
          </h2>
          <p className="text-white/80 text-base md:text-lg max-w-2xl mx-auto mb-8 md:mb-10">
            Fale com nossos especialistas e descubra como proteger seu patrimônio e operações com eficiência.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <BrutalButton variant="outline" size="lg" className="bg-white text-[#1A1A1A] border-white hover:bg-[#1A1A1A] hover:text-white hover:border-[#1A1A1A]">
              Solicitar Cotação <ArrowRight className="ml-2 w-5 h-5" />
            </BrutalButton>
            <BrutalButton variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-[#7AB72D]" onClick={() => window.location.href = '/livo/solar'}>
              Ver Todos os Produtos
            </BrutalButton>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#1A1A1A] text-white py-16 border-t-4 border-[#7AB72D]">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#7AB72D] rounded flex items-center justify-center">
                  <img src="/logo-livo-header.webp" alt="Livo MGA" className="w-8 h-8 object-contain" />
                </div>
                <div>
                  <div className="font-display font-bold text-xl">LIVO MGA</div>
                  <div className="text-xs text-[#94A3B8] uppercase tracking-wider">Agro</div>
                </div>
              </div>
              <p className="text-[#94A3B8] text-sm leading-relaxed max-w-md">
                Parte do Grupo Livonius, com mais de 137 anos de tradição no mercado de seguros. 
                Especialistas em soluções corporativas para energia, agronegócio e infraestrutura.
              </p>
            </div>
            <div>
              <div className="font-display font-bold text-sm uppercase tracking-wider mb-4 text-[#7AB72D]">Produtos</div>
              <ul className="space-y-3 text-[#94A3B8] text-sm">
                <li><Link href="/livo/solar" className="hover:text-[#7AB72D] transition-colors">RD Placas Solares</Link></li>
                <li><Link href="/livo/garantia" className="hover:text-[#7AB72D] transition-colors">Seguro Garantia</Link></li>
                <li><Link href="/livo/engenharia" className="hover:text-[#7AB72D] transition-colors">Riscos de Engenharia</Link></li>
                <li><Link href="/livo/agro" className="hover:text-[#7AB72D] transition-colors">Agrícola</Link></li>
              </ul>
            </div>
            <div>
              <div className="font-display font-bold text-sm uppercase tracking-wider mb-4 text-[#7AB72D]">Legal</div>
              <ul className="space-y-3 text-[#94A3B8] text-sm">
                <li><a href="#" className="hover:text-[#7AB72D] transition-colors">Privacidade</a></li>
                <li><a href="#" className="hover:text-[#7AB72D] transition-colors">Termos</a></li>
                <li><Link href="/sinistro" className="hover:text-[#7AB72D] transition-colors">Aviso de Sinistro</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#2A2A2A] mt-12 pt-8 text-center text-[#64748B] text-xs">
            © 2024 Livo MGA - Grupo Livonius. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
