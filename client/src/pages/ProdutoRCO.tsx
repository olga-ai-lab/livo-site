import React from 'react';
import { ProductLayout } from '@/components/Common/ProductLayout';
import { SEO } from '@/components/Common/SEO';
import { Shield, FileText, ExternalLink } from 'lucide-react';
import { PRODUTO_RCO } from '@shared/catalogoProdutos';

export default function ProdutoRCO() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": PRODUTO_RCO.nome,
    "description": PRODUTO_RCO.descricao,
    "brand": {
      "@type": "Brand",
      "name": "Livonius MGA"
    },
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "priceCurrency": "BRL"
    }
  };

  return (
    <>
      <SEO 
        title={`${PRODUTO_RCO.nome} | Livonius MGA`}
        description={PRODUTO_RCO.descricao}
        type="product"
        schema={schema}
      />
      <ProductLayout
        brand="livonius"
        title={PRODUTO_RCO.nome}
        subtitle="Responsabilidade Civil Obrigatória + Acidentes Pessoais de Passageiros"
        description="A Livonius MGA é líder em RCO no Brasil há mais de 137 anos, oferecendo proteção completa para quem transporta vidas. Nosso seguro garante tranquilidade para tripulantes e passageiros, com atendimento ágil, humanizado e aceitação simplificada. Seguradora parceira: ESSOR."
        image="https://files.manuscdn.com/user_upload_by_module/session_file/310419663026937481/QfLacuFAkGgXYSXg.png"
        icon={<Shield />}
        insurerName={PRODUTO_RCO.seguradora}
        susepLink={PRODUTO_RCO.linkSUSEP}
        features={[
          "Cobertura Nacional",
          "Conformidade ANTT e demais poderes concedentes",
          "Atendimento Humanizado 24h",
          "Aceitação Simplificada",
          "Gestão Especializada de Sinistros",
          "Certificado Digital Imediato",
          "APP - Acidentes Pessoais de Passageiros",
          "Cobertura para Tripulantes"
        ]}
        coverages={PRODUTO_RCO.coberturas.map(cob => ({
          title: cob.titulo,
          description: cob.descricao,
          included: cob.obrigatoria
        }))}
        benefits={[
          {
            title: "Programa de Prevenção de Acidentes",
            description: "Avaliação detalhada dos riscos operacionais e implementação de medidas preventivas para aumentar a segurança da frota e reduzir sinistralidade."
          },
          {
            title: "Atendimento Humanizado às Vítimas",
            description: "Assistência prioritária e humanizada às vítimas em caso de acidentes, com suporte imediato no socorro e acompanhamento durante todo o processo."
          },
          {
            title: "Rede Nacional de Atendimento",
            description: "Ampla rede de prestadores de serviços em pontos estratégicos de todo o Brasil, garantindo atendimento rápido em qualquer região."
          },
          {
            title: "137 Anos de Expertise em Transporte",
            description: "Conte com a MGA que mais entende de transporte de passageiros no Brasil. Tradição desde 1888 aliada à tecnologia moderna."
          }
        ]}
        targetAudience={PRODUTO_RCO.publico_alvo}
        faq={[
          {
            question: "O que o seguro RCO/APP cobre?",
            answer: "O RCO cobre danos corporais, materiais e morais causados a passageiros e terceiros não transportados. O APP oferece indenização por morte acidental, invalidez permanente e despesas médico-hospitalares dos passageiros, conforme exigências legais da ANTT."
          },
          {
            question: "Qual a diferença entre RCO e APP?",
            answer: "O RCO (Responsabilidade Civil Obrigatória) cobre a responsabilidade da empresa por danos causados a passageiros. O APP (Acidentes Pessoais de Passageiros) é uma cobertura adicional que indeniza diretamente o passageiro ou seus beneficiários em caso de acidente, independente de culpa."
          },
          {
            question: "Como funciona o atendimento a sinistros?",
            answer: "Oferecemos uma central 24h com atendimento humanizado, focado em resolver rapidamente a situação e amparar as vítimas. Nossa equipe especializada acompanha todo o processo, desde o primeiro atendimento até a conclusão do sinistro."
          },
          {
            question: "O seguro é obrigatório?",
            answer: "Sim, o seguro RCO é exigido pela ANTT (Agência Nacional de Transportes Terrestres) e órgãos reguladores estaduais para operação legal de transporte de passageiros."
          },
          {
            question: "Qual a seguradora parceira?",
            answer: `Trabalhamos com a ${PRODUTO_RCO.seguradora}, seguradora sólida e especializada em seguros de transporte, garantindo segurança e agilidade na emissão e regulação de sinistros.`
          },
          {
            question: "Como consultar as condições gerais do produto?",
            answer: "As condições gerais completas estão disponíveis no site da SUSEP. Clique no link 'Consultar condições gerais' para acessar diretamente o registro do produto."
          }
        ]}
        additionalInfo={
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-600" />
              Documentação e Regulamentação
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                <strong>Seguradora:</strong> {PRODUTO_RCO.seguradora}
              </p>
              <p>
                <strong>Processo SUSEP:</strong> {PRODUTO_RCO.processoSUSEP}
              </p>
              <a 
                href={PRODUTO_RCO.linkSUSEP}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                Consultar condições gerais na SUSEP
              </a>
            </div>
          </div>
        }
      />
    </>
  );
}
