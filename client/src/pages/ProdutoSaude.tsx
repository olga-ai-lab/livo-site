import React from 'react';
import { ProductLayout } from '@/components/Common/ProductLayout';
import { SEO } from '@/components/Common/SEO';
import { Heart } from 'lucide-react';

export default function ProdutoSaude() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Seguro de Saúde e Vida",
    "description": "Proteção completa para sua saúde e bem-estar. Cobertura abrangente em saúde e vida para você e sua família.",
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
        title="Seguro de Saúde e Vida | Livo MGA"
        description="Proteção completa em saúde e vida. Cobertura abrangente para você e sua família com atendimento humanizado."
        type="product"
        schema={schema}
      />
      <ProductLayout
      brand="livo"
      title="Seguro de Saúde e Vida"
      subtitle="Bem-estar e Proteção"
      description="Proteção completa para sua saúde e bem-estar. Cobertura abrangente em saúde e vida para você e sua família, com acesso a uma rede de prestadores de qualidade e atendimento humanizado."
      image="https://private-us-east-1.manuscdn.com/sessionFile/YZYA0TPpOrYHxjWrHLUp6U/sandbox/tbjFRjvSwEdEyueFnC3OO5-img-1_1770391885000_na1fn_cHJvZHV0by1zYXVkZS12aWRh.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvWVpZQTBUUHBPcllIeGpXckhMVXA2VS9zYW5kYm94L3RiakZSanZTd0VkRXl1ZUZuQzNPTzUtaW1nLTFfMTc3MDM5MTg4NTAwMF9uYTFmbl9jSEp2WkhWMGJ5MXpZWFZrWlMxMmFXUmgucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=oy4tBH7PnvRAg6mVEp~5HkVAClJc7tFAwlDYT2ZlgtTf9~q5p6UwdH0KDwaWIeFjSjDxQM6S4PltftcIzCipTPeNXzGOTZnDYHc4zH-5Z75Rbf0carKrpRVkpXPkzmqD1ey6JrJhualSI1zjfWSXJmEm3r-dMjxEuW40A5iZdTu5QRWyzJeoQiT6ik38R3GHwtHbaZAuaOxTJPFR6AMPM6NAXOkj~x3lc-CFxg3E-UODvfixaTJSCT-4lNKMuYg3hCTWRJgJ5TIhJUEcW8OR9i8XBqwt4CZdbyF8EoWLR3i4Dn-K-18iuJM0zTyccUdt18~rm-Uwi1xN9kXtFZS0rA__"
      icon={<Heart />}
      features={[
        "Cobertura Ambulatorial",
        "Internação Hospitalar",
        "Cobertura Odontológica",
        "Cobertura Oftalmológica",
        "Seguro de Vida",
        "Assistência 24h",
        "Rede de Prestadores",
        "Cobertura Nacional"
      ]}
      benefits={[
        {
          title: "Proteção Completa em Saúde",
          description: "Cobertura abrangente em ambulatório, internação, odontologia e oftalmologia, garantindo acesso a cuidados de qualidade."
        },
        {
          title: "Seguro de Vida Integrado",
          description: "Proteção financeira para sua família em caso de morte acidental ou invalidez permanente."
        },
        {
          title: "Rede de Prestadores Ampla",
          description: "Acesso a hospitais, clínicas e consultórios de qualidade em todo o Brasil, com atendimento sem burocracia."
        },
        {
          title: "Assistência 24 Horas",
          description: "Suporte contínuo e humanizado para orientação médica, agendamento de consultas e emergências."
        }
      ]}
      targetAudience={[
        "Pessoas Físicas",
        "Famílias",
        "Microempresários",
        "Profissionais Autônomos",
        "Pequenas Empresas"
      ]}
      faq={[
        {
          question: "Qual é a cobertura de saúde incluída?",
          answer: "O seguro cobre consultas ambulatoriais, internação hospitalar, cirurgias, exames diagnósticos, odontologia e oftalmologia, com acesso a uma ampla rede de prestadores."
        },
        {
          question: "O seguro de vida está incluído?",
          answer: "Sim, o seguro inclui cobertura de vida com indenização por morte acidental e invalidez permanente, protegendo financeiramente sua família."
        },
        {
          question: "Há cobertura para pré-existentes?",
          answer: "Sim, oferecemos cobertura para condições pré-existentes após período de carência, com análise individual de cada caso."
        },
        {
          question: "Como funciona o atendimento?",
          answer: "Você pode agendar consultas diretamente com prestadores da rede ou ligar para nossa central 24h para orientação médica e agendamento."
        },
        {
          question: "Qual é o período de carência?",
          answer: "O período de carência varia conforme o tipo de cobertura: 30 dias para consultas, 180 dias para cirurgias eletivas e 24 horas para emergências."
        },
        {
          question: "Posso incluir dependentes?",
          answer: "Sim, você pode incluir cônjuge, filhos e outros dependentes na apólice, com cobertura completa em saúde e vida."
        }
      ]}
      />
    </>
  );
}
