import React from 'react';
import { ProductLayout } from '@/components/Common/ProductLayout';
import { SEO } from '@/components/Common/SEO';
import { Sun } from 'lucide-react';

export default function ProdutoSolar() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Seguro Riscos de Engenharia Solar",
    "description": "Proteção completa para instalação e operação de sistemas fotovoltaicos. Do projeto à geração de energia.",
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
        title="Seguro Solar e Riscos de Engenharia"
        description="Proteja seu investimento em energia solar com a Livo MGA. Cobertura completa para instalação, danos físicos e perda de receita."
        type="product"
        schema={schema}
      />
      <ProductLayout
      brand="livo"
      title="Seguro Placas Solares"
      subtitle="Energia Renovável"
      description="Proteção completa para todo o sistema de energia solar, incluindo placas, inversores, estrutura e parte elétrica. Garantia de segurança para residências, propriedades rurais, indústrias e comércio."
      image="https://files.manuscdn.com/user_upload_by_module/session_file/310419663026937481/FZCTvQCzZSztpzfT.png"
      icon={<Sun />}
      features={[
        "Cobertura All Risks",
        "Danos Elétricos",
        "Vendaval e Granizo",
        "Roubo e Furto",
        "Perda de Receita",
        "Erro de Projeto"
      ]}
      benefits={[
        {
          title: "Proteção Completa do Sistema",
          description: "Inclusos itens como placas, inversor, estrutura e elétrica, garantindo a segurança total do investimento."
        },
        {
          title: "Ampla Cobertura Geográfica",
          description: "Garantia de segurança para instalações em residências, propriedades rurais, indústrias e comércio em geral."
        },
        {
          title: "Cobertura Básica Competitiva",
          description: "Proteção para danos de causa externa como incêndio, vendaval, raio, granizo, desmoronamento e queda de aeronaves."
        },
        {
          title: "Instalação e Montagem",
          description: "Cobertura específica para a fase de instalação, protegendo contra acidentes e erros de execução."
        }
      ]}
      targetAudience={[
        "Integradores Solares",
        "Usinas Fotovoltaicas",
        "Instalações Residenciais",
        "Indústrias e Comércios"
      ]}
      faq={[
        {
          question: "O que está coberto no seguro?",
          answer: "O seguro cobre danos materiais ao sistema (placas, inversores, cabos) causados por incêndio, vendaval, granizo, roubo, danos elétricos, entre outros."
        },
        {
          question: "Cobre danos durante a instalação?",
          answer: "Sim, oferecemos cobertura para Riscos de Engenharia durante a fase de instalação e montagem do sistema."
        },
        {
          question: "Equipamentos importados estão cobertos?",
          answer: "Sim, cobrimos equipamentos nacionais e importados, desde que devidamente regularizados."
        }
      ]}
      />
    </>
  );
}
