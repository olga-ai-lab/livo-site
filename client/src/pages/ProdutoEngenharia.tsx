import React from 'react';
import { ProductLayout } from '@/components/Common/ProductLayout';
import { SEO } from '@/components/Common/SEO';
import { HardHat } from 'lucide-react';

export default function ProdutoEngenharia() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Seguro Riscos de Engenharia",
    "description": "Proteção para obras civis, instalação e montagem. Do canteiro de obras à entrega das chaves.",
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
        title="Seguro Riscos de Engenharia e Obras"
        description="Segurança total para sua construção com a Livo MGA. Cobertura para obras civis, instalação, montagem e responsabilidade civil."
        type="product"
        schema={schema}
      />
      <ProductLayout
      brand="livo"
      title="Riscos de Engenharia"
      subtitle="Construção Civil"
      description="Segurança total do início ao fim da obra. Proteção contra acidentes de origem súbita e imprevista durante a execução de obras civis, instalação e montagem."
      image="https://files.manuscdn.com/user_upload_by_module/session_file/310419663026937481/egZdXXDOawGFoMly.png"
      icon={<HardHat />}
      features={[
        "Obras Civis",
        "Instalação e Montagem",
        "Responsabilidade Civil",
        "Erro de Projeto",
        "Despesas Extraordinárias",
        "Propriedades Circunvizinhas"
      ]}
      benefits={[
        {
          title: "Cobertura All Risks",
          description: "Proteção ampla contra todos os riscos materiais não explicitamente excluídos na apólice."
        },
        {
          title: "Proteção a Terceiros",
          description: "Cobertura de Responsabilidade Civil Geral e Cruzada para danos a terceiros decorrentes da obra."
        },
        {
          title: "Manutenção",
          description: "Garantia estendida para o período de manutenção após a conclusão da obra."
        },
        {
          title: "Flexibilidade",
          description: "Apólices personalizadas para pequenas reformas até grandes obras de infraestrutura."
        }
      ]}
      targetAudience={[
        "Construtoras e Incorporadoras",
        "Empreiteiros",
        "Proprietários de Obras",
        "Instaladores Industriais"
      ]}
      faq={[
        {
          question: "O que o seguro cobre?",
          answer: "Cobre danos materiais à obra (incêndio, vendaval, desmoronamento), roubo de materiais e danos a terceiros."
        },
        {
          question: "Cobre erros de projeto?",
          answer: "Sim, oferecemos cobertura adicional para danos decorrentes de erros de projeto."
        },
        {
          question: "É obrigatório contratar?",
          answer: "Embora não seja obrigatório por lei em todos os casos, é frequentemente exigido em contratos de financiamento e licitações."
        }
      ]}
      />
    </>
  );
}
