import React from 'react';
import { Navigation } from './Navigation';
import { BrandConnector } from './BrandConnector';
import { BrutalButton } from '@/components/ui/BrutalButton';
import { ArrowRight, CheckCircle2, HelpCircle, Download, Circle } from 'lucide-react';
import { Link } from 'wouter';
import { LeadChat } from './LeadChat';
import { generateProductPDF } from '@/lib/pdfGenerator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";


interface Coverage {
  title: string;
  description: string;
  included: boolean;
}

interface ProductLayoutProps {
  brand: 'livonius' | 'livo';
  title: string;
  subtitle: string;
  description: string;
  image?: string;
  icon: React.ReactNode;
  features: string[];
  coverages?: Coverage[];
  benefits: { title: string; description: string }[];
  targetAudience: string[];
  faq: { question: string; answer: string }[];
  ctaText?: string;
  ctaLink?: string;
  insurerName?: string;
  susepLink?: string;
  additionalInfo?: React.ReactNode;
}

export const ProductLayout: React.FC<ProductLayoutProps> = ({
  brand,
  title,
  subtitle,
  description,
  image,
  icon,
  features,
  coverages,
  benefits,
  targetAudience,
  faq,
  ctaText = "Solicitar Cotação",
  ctaLink = "#contato",
  insurerName,
  susepLink,
  additionalInfo
}) => {
  const handleDownloadPDF = () => {
    generateProductPDF({
      title,
      subtitle,
      description,
      features,
      benefits
    }, brand);
  };

  const isLivonius = brand === 'livonius';
  const brandColor = isLivonius ? '#056677' : '#7AB72D';
  const brandBg = isLivonius ? 'bg-[#056677]' : 'bg-[#7AB72D]';
  const brandText = isLivonius ? 'text-[#056677]' : 'text-[#7AB72D]';
  const brandBorder = isLivonius ? 'border-[#056677]' : 'border-[#7AB72D]';

  return (
    <div className="min-h-screen bg-white selection:bg-opacity-30" style={{ '--selection-color': brandColor } as React.CSSProperties}>
      <Navigation type={brand} />
      <div className="pt-20">
        <BrandConnector currentBrand={brand} />
      </div>

      {/* BACK BUTTON */}
      <div className="container pt-8">
        <button 
          onClick={() => window.history.back()} 
          className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#64748B] hover:text-[#353E4A] transition-colors group"
        >
          <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
          Voltar
        </button>
      </div>

      {/* HERO SECTION */}
      <header className="pt-20 pb-20 md:pt-32 md:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-[0.03]" 
             style={{ backgroundImage: `linear-gradient(${brandColor} 1px, transparent 1px), linear-gradient(90deg, ${brandColor} 1px, transparent 1px)`, backgroundSize: '40px 40px' }}>
        </div>

        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 animate-fade-in-up">
              <div className={`inline-flex items-center gap-2 px-3 py-1 border ${brandBorder}/20 ${brandBg}/5 mb-8 animate-fade-in-up delay-100`}>
                <span className={`w-2 h-2 ${brandBg}`}></span>
                <span className={`text-xs font-bold uppercase tracking-widest ${brandText}`}>{subtitle}</span>
              </div>
              
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-[#353E4A] leading-[1.1] mb-6 animate-fade-in-up delay-200">
                {title}
              </h1>
              
              <p className="text-xl text-[#64748B] font-light max-w-xl leading-relaxed mb-10 animate-fade-in-up delay-300">
                {description}
              </p>
              
              <div className="flex flex-wrap gap-4 animate-fade-in-up delay-300">
                <Link href="/cotacao">
                  <BrutalButton variant={isLivonius ? 'teal' : 'lime'} size="lg">
                    {ctaText} <ArrowRight className="ml-2 w-5 h-5" />
                  </BrutalButton>
                </Link>
                <BrutalButton variant="outline" size="lg" onClick={handleDownloadPDF}>
                  Baixar Ficha Técnica <Download className="ml-2 w-5 h-5" />
                </BrutalButton>
              </div>
            </div>

            <div className="lg:col-span-5 relative animate-fade-in-up delay-200">
              <div className={`aspect-square bg-white border border-[#CBD5E1] shadow-[16px_16px_0px_0px_${brandColor}] relative z-10 overflow-hidden`}>
                {image ? (
                  <img 
                    src={image} 
                    alt={title} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center p-12">
                     {/* Icon Container */}
                     <div className={`w-48 h-48 rounded-full ${brandBg}/10 flex items-center justify-center`}>
                        {/* Icon wrapper to avoid cloneElement issues */}
                        <div className={`w-24 h-24 ${brandText} flex items-center justify-center [&>svg]:w-full [&>svg]:h-full`}>
                          {icon}
                        </div>
                     </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* FEATURES GRID */}
      <section className="py-20 bg-[#FAFAFA] border-y border-[#CBD5E1]">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4 p-6 bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow">
                <div className={`mt-1 w-6 h-6 rounded-full ${brandBg}/10 flex items-center justify-center shrink-0`}>
                  <CheckCircle2 className={`w-4 h-4 ${brandText}`} />
                </div>
                <span className="font-medium text-[#353E4A]">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COVERAGES SECTION */}
      {coverages && coverages.length > 0 && (
        <section className="py-24">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl font-bold text-[#353E4A] mb-4">Coberturas Incluídas</h2>
              <p className="text-[#64748B]">Conheça todas as proteções oferecidas por este produto.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {coverages.map((coverage, index) => (
                <div key={index} className="p-6 border border-[#E2E8F0] rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3 mb-3">
                    {coverage.included ? (
                      <CheckCircle2 className={`w-6 h-6 ${brandText} shrink-0 mt-0.5`} />
                    ) : (
                      <Circle className="w-6 h-6 text-[#CBD5E1] shrink-0 mt-0.5" />
                    )}
                    <h4 className="font-bold text-lg text-[#353E4A]">{coverage.title}</h4>
                  </div>
                  <p className="text-[#64748B] leading-relaxed ml-9">{coverage.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* DEEP DIVE CONTENT */}
      <section className="py-24">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-4">
              <h3 className="font-display text-3xl font-bold text-[#353E4A] mb-6">Para quem é indicado?</h3>
              <ul className="space-y-4">
                {targetAudience.map((target, index) => (
                  <li key={index} className="flex items-center gap-3 text-[#64748B]">
                    <span className={`w-1.5 h-1.5 rounded-full ${brandBg}`}></span>
                    {target}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="lg:col-span-8">
              <h3 className="font-display text-3xl font-bold text-[#353E4A] mb-8">Principais Benefícios</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {benefits.map((benefit, index) => (
                  <div key={index}>
                    <h4 className={`font-bold text-lg ${brandText} mb-2`}>{benefit.title}</h4>
                    <p className="text-[#64748B] leading-relaxed">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ADDITIONAL INFO */}
      {additionalInfo && (
        <section className="py-24">
          <div className="container max-w-3xl">
            {additionalInfo}
          </div>
        </section>
      )}

      {/* FAQ SECTION */}
      <section className="py-24 bg-[#FAFAFA] border-t border-[#CBD5E1]">
        <div className="container max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-[#353E4A] mb-4">Dúvidas Frequentes</h2>
            <p className="text-[#64748B]">Tudo o que você precisa saber sobre este produto.</p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {faq.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-white border border-[#E2E8F0] px-6">
                <AccordionTrigger className="text-left font-medium text-[#353E4A] hover:no-underline py-6">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-[#64748B] pb-6 leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA FOOTER */}
      <section className={`py-24 ${brandBg} text-white text-center`}>
        <div className="container max-w-4xl">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-8">Proteja seu negócio hoje mesmo.</h2>
          <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
            Fale com nossos especialistas e receba uma proposta personalizada para sua necessidade.
          </p>
          <Link href="/cotacao">
            <BrutalButton variant="outline" className="bg-white text-[#353E4A] border-white hover:bg-transparent hover:text-white">
              Solicitar Cotação <ArrowRight className="ml-2 w-5 h-5" />
            </BrutalButton>
          </Link>
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
      
      {/* AI Lead Chat */}
      <LeadChat brand={brand} productName={title} />
    </div>
  );
};
