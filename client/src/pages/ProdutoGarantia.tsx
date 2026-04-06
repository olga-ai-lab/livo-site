import React from 'react';
import { ProductLayout } from '@/components/Common/ProductLayout';
import { SEO } from '@/components/Common/SEO';
import { Briefcase } from 'lucide-react';

export default function ProdutoGarantia() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Seguro Garantia",
    "description": "A alternativa inteligente à fiança bancária para contratos públicos e privados.",
    "brand": {
      "@type": "Brand",
      "name": "Livo MGA"
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
        title="Seguro Garantia Contratual e Judicial"
        description="Substitua a fiança bancária pelo Seguro Garantia da Livo MGA. Menor custo, não bloqueia limite de crédito e emissão ágil."
        type="product"
        schema={schema}
      />
      <ProductLayout
      brand="livo"
      title="Seguro Garantia"
      subtitle="Corporate Solutions"
      description="A alternativa inteligente à fiança bancária. Garanta o cumprimento de contratos públicos e privados sem comprometer seu capital de giro e com taxas mais competitivas."
      image="https://files.manuscdn.com/user_upload_by_module/session_file/310419663026937481/dsOlNxEmpQKaJnpX.png"
      icon={<Briefcase />}
      features={[
        "Garantia Contratual",
        "Garantia Judicial",
        "Garantia Licitante",
        "Emissão Online",
        "Taxas Competitivas",
        "Não Bloqueia Limite"
      ]}
      benefits={[
        {
          title: "Preservação de Capital",
          description: "Não compromete o limite de crédito bancário da empresa, liberando recursos para outras operações."
        },
        {
          title: "Custo Reduzido",
          description: "Taxas significativamente menores em comparação com a fiança bancária tradicional."
        },
        {
          title: "Agilidade na Contratação",
          description: "Processo de análise e emissão simplificado, ideal para prazos curtos de licitações."
        },
        {
          title: "Segurança Jurídica",
          description: "Garantia aceita em processos judiciais e contratos públicos conforme a legislação vigente."
        }
      ]}
      targetAudience={[
        "Empresas Licitantes",
        "Construtoras",
        "Prestadores de Serviço",
        "Réus em Processos Judiciais"
      ]}
      faq={[
        {
          question: "O que é o Seguro Garantia?",
          answer: "É um seguro que garante o cumprimento das obrigações assumidas pelo tomador em um contrato ou processo judicial."
        },
        {
          question: "Qual a vantagem sobre a fiança bancária?",
          answer: "O Seguro Garantia tem custo menor e não consome o limite de crédito da empresa junto aos bancos."
        },
        {
          question: "Quanto tempo leva para emitir?",
          answer: "Para cadastros aprovados, a emissão pode ser feita no mesmo dia através da nossa plataforma."
        }
      ]}
      />
    </>
  );
}
