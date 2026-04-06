import jsPDF from 'jspdf';

interface ProductData {
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  benefits: { title: string; description: string }[];
}

export const generateProductPDF = (data: ProductData, brand: 'livonius' | 'livo') => {
  const doc = new jsPDF();
  const isLivonius = brand === 'livonius';
  const primaryColor = isLivonius ? '#056677' : '#0284C7';
  
  // Header Background
  doc.setFillColor(primaryColor);
  doc.rect(0, 0, 210, 40, 'F');
  
  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(data.title, 20, 20);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(data.subtitle.toUpperCase(), 20, 30);
  
  // Description
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(12);
  doc.text(doc.splitTextToSize(data.description, 170), 20, 60);
  
  // Features
  let yPos = 90;
  doc.setTextColor(primaryColor);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Principais Características', 20, yPos);
  
  yPos += 10;
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  data.features.forEach((feature) => {
    doc.text(`• ${feature}`, 25, yPos);
    yPos += 8;
  });
  
  // Benefits
  yPos += 15;
  doc.setTextColor(primaryColor);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Benefícios Exclusivos', 20, yPos);
  
  yPos += 10;
  data.benefits.forEach((benefit) => {
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(benefit.title, 25, yPos);
    
    yPos += 6;
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(doc.splitTextToSize(benefit.description, 160), 25, yPos);
    
    yPos += 15;
  });
  
  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFillColor(240, 240, 240);
  doc.rect(0, pageHeight - 20, 210, 20, 'F');
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(8);
  doc.text('Grupo Livonius - Tradição e Inovação desde 1888', 105, pageHeight - 10, { align: 'center' });
  
  doc.save(`${data.title.replace(/\s+/g, '_').toLowerCase()}.pdf`);
};
