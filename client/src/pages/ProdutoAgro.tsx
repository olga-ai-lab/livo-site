import React from 'react';
import { ProductLayout } from '@/components/Common/ProductLayout';
import { SEO } from '@/components/Common/SEO';
import { Tractor } from 'lucide-react';

export default function ProdutoAgro() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Seguro Agrícola e Equipamentos",
    "description": "Proteção completa para máquinas agrícolas, benfeitorias e produção rural.",
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
        title="Seguro Agrícola e Máquinas Rurais"
        description="Proteja sua safra e equipamentos com o Seguro Agro da Livo MGA. Cobertura para tratores, colheitadeiras e riscos climáticos."
        type="product"
        schema={schema}
      />
      <ProductLayout
      brand="livo"
      title="Seguro Penhor Rural e Benfeitorias"
      subtitle="Agronegócio"
      description="Proteção completa para quem planta, colhe e move o país. Seguros para máquinas agrícolas, benfeitorias e equipamentos, garantindo a continuidade da produção."
      image="https://files.manuscdn.com/user_upload_by_module/session_file/310419663026937481/pCoUtkahpTpEuQQP.png"
      icon={<Tractor />}
      features={[
        "Máquinas Agrícolas",
        "Benfeitorias",
        "Penhor Rural",
        "Riscos Diversos",
        "Roubo e Furto",
        "Danos Elétricos"
      ]}
      benefits={[
        {
          title: "Cobertura Abrangente",
          description: "Proteção contra incêndio, raio, explosão, vendaval, granizo, alagamento e roubo/furto qualificado."
        },
        {
          title: "Condições para Frotistas",
          description: "Descontos e condições especiais para frotas a partir de 6 itens segurados."
        },
        {
          title: "Desconto Fidelidade",
          description: "Condições especiais e descontos progressivos para renovações internas."
        },
        {
          title: "Operação Próxima à Água",
          description: "Cobertura específica para equipamentos que operam em proximidade a rios e lagos."
        }
      ]}
      targetAudience={[
        "Produtores Rurais",
        "Cooperativas Agrícolas",
        "Locadores de Máquinas",
        "Usinas de Açúcar e Álcool"
      ]}
      faq={[
        {
          question: "Quais equipamentos podem ser segurados?",
          answer: "Tratores, colheitadeiras, pulverizadores, plantadeiras, pivôs de irrigação e equipamentos estacionários."
        },
        {
          question: "Cobre roubo e furto?",
          answer: "Sim, oferecemos cobertura para roubo e furto qualificado mediante arrombamento."
        },
        {
          question: "É possível segurar equipamentos antigos?",
          answer: "Sim, analisamos caso a caso, permitindo a proteção de frotas com diferentes idades."
        }
      ]}
      />
    </>
  );
}
