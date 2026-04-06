import React, { useState, useRef } from 'react';
import { Navigation } from '@/components/Common/Navigation';
import { BrandConnector } from '@/components/Common/BrandConnector';
import { BrutalButton } from '@/components/ui/BrutalButton';
import { ArrowLeft, UploadCloud, FileText, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { SEO } from '@/components/Common/SEO';
import { trpc } from '@/lib/trpc';

interface FormData {
  nome: string;
  cpfCnpj: string;
  email: string;
  telefone: string;
  numeroApolice: string;
  dataOcorrido: string;
  relato: string;
}

export default function Sinistro() {
  const [brand, setBrand] = useState<'livonius' | 'livo'>('livonius');
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [protocolo, setProtocolo] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    cpfCnpj: '',
    email: '',
    telefone: '',
    numeroApolice: '',
    dataOcorrido: '',
    relato: '',
  });

  // Mutation para enviar sinistro
  const enviarSinistro = trpc.sinistro.enviar.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        setProtocolo(data.protocolo);
        setIsSuccess(true);
        window.scrollTo(0, 0);
      } else {
        setErrorMessage(data.message || 'Erro ao enviar sinistro. Tente novamente.');
      }
    },
    onError: (error) => {
      console.error('Erro ao enviar sinistro:', error);
      setErrorMessage('Erro de conexão. Por favor, tente novamente.');
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (fileList: FileList) => {
    const newFiles = Array.from(fileList);
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    // Validação básica
    if (!formData.nome || !formData.cpfCnpj || !formData.email || !formData.telefone || !formData.dataOcorrido || !formData.relato) {
      setErrorMessage('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Preparar dados para envio
    const sinistroData = {
      ...formData,
      marca: brand,
      arquivos: files.map(f => f.name),
    };

    // Enviar via tRPC
    enviarSinistro.mutate(sinistroData);
  };

  const isLivonius = brand === 'livonius';
  const brandColor = isLivonius ? '#056677' : '#0284C7';
  const brandBg = isLivonius ? 'bg-[#056677]' : 'bg-[#0284C7]';
  const brandText = isLivonius ? 'text-[#056677]' : 'text-[#0284C7]';
  const brandBorder = isLivonius ? 'border-[#056677]' : 'border-[#0284C7]';

  return (
    <div className="min-h-screen bg-white selection:bg-opacity-30" style={{ '--selection-color': brandColor } as React.CSSProperties}>
      <SEO 
        title="Aviso de Sinistro - Grupo Livonius"
        description="Canal oficial para abertura de sinistros. Envie sua documentação de forma rápida e segura."
      />
      
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
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Voltar
        </button>
      </div>

      {/* HEADER */}
      <header className="py-12 md:py-20 text-center">
        <div className="container max-w-4xl">
          <div className={`inline-flex items-center gap-2 px-3 py-1 border ${brandBorder}/20 ${brandBg}/5 mb-6`}>
            <AlertCircle className={`w-4 h-4 ${brandText}`} />
            <span className={`text-xs font-bold uppercase tracking-widest ${brandText}`}>Central de Apoio</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-[#353E4A] mb-6">
            Aviso de Sinistro
          </h1>
          <p className="text-xl text-[#64748B] font-light max-w-2xl mx-auto">
            Sabemos que este é um momento delicado. Nossa equipe está pronta para agilizar seu processo. Preencha o formulário abaixo para iniciar.
          </p>
        </div>
      </header>

      {/* BRAND SELECTOR */}
      <div className="container max-w-md mx-auto mb-12">
        <div className="grid grid-cols-2 bg-[#F1F5F9] p-1 rounded-lg">
          <button
            onClick={() => setBrand('livonius')}
            className={`py-2 text-sm font-bold uppercase tracking-wide transition-all rounded-md ${isLivonius ? 'bg-white text-[#056677] shadow-sm' : 'text-[#64748B] hover:text-[#353E4A]'}`}
          >
            Livonius
          </button>
          <button
            onClick={() => setBrand('livo')}
            className={`py-2 text-sm font-bold uppercase tracking-wide transition-all rounded-md ${!isLivonius ? 'bg-white text-[#0284C7] shadow-sm' : 'text-[#64748B] hover:text-[#353E4A]'}`}
          >
            Livo MGA
          </button>
        </div>
      </div>

      {/* FORM SECTION */}
      <section className="pb-24">
        <div className="container max-w-3xl">
          {isSuccess ? (
            <div className="bg-[#F0FDF4] border border-[#BBF7D0] p-8 md:p-12 text-center rounded-lg animate-fade-in-up">
              <div className="w-20 h-20 bg-[#DCFCE7] text-[#16A34A] rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="font-display text-3xl font-bold text-[#166534] mb-4">Solicitação Enviada!</h2>
              <p className="text-[#15803D] text-lg mb-8">
                Recebemos sua documentação com sucesso. O número do seu protocolo é <strong>#{protocolo}</strong>.
                <br />Nossa equipe entrará em contato em até 24 horas úteis.
              </p>
              <BrutalButton variant="outline" onClick={() => window.location.href = '/'}>
                Voltar ao Início
              </BrutalButton>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white border border-[#E2E8F0] shadow-xl p-8 md:p-12 rounded-xl relative overflow-hidden">
              {/* Decorative Top Border */}
              <div className={`absolute top-0 left-0 right-0 h-2 ${brandBg}`}></div>

              {/* Error Message */}
              {errorMessage && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {errorMessage}
                </div>
              )}

              <div className="space-y-8">
                {/* Personal Info */}
                <div>
                  <h3 className="font-display text-xl font-bold text-[#353E4A] mb-6 flex items-center gap-2">
                    <span className={`w-8 h-8 rounded-full ${brandBg} text-white flex items-center justify-center text-sm`}>1</span>
                    Dados do Segurado
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[#64748B] uppercase tracking-wide">Nome Completo / Razão Social *</label>
                      <input 
                        required 
                        type="text" 
                        name="nome"
                        value={formData.nome}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#353E4A] focus:ring-0 transition-colors outline-none" 
                        placeholder="Digite o nome" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[#64748B] uppercase tracking-wide">CPF / CNPJ *</label>
                      <input 
                        required 
                        type="text" 
                        name="cpfCnpj"
                        value={formData.cpfCnpj}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#353E4A] focus:ring-0 transition-colors outline-none" 
                        placeholder="000.000.000-00" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[#64748B] uppercase tracking-wide">E-mail *</label>
                      <input 
                        required 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#353E4A] focus:ring-0 transition-colors outline-none" 
                        placeholder="seu@email.com" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[#64748B] uppercase tracking-wide">Telefone *</label>
                      <input 
                        required 
                        type="tel" 
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#353E4A] focus:ring-0 transition-colors outline-none" 
                        placeholder="(00) 00000-0000" 
                      />
                    </div>
                  </div>
                </div>

                <hr className="border-[#E2E8F0]" />

                {/* Incident Info */}
                <div>
                  <h3 className="font-display text-xl font-bold text-[#353E4A] mb-6 flex items-center gap-2">
                    <span className={`w-8 h-8 rounded-full ${brandBg} text-white flex items-center justify-center text-sm`}>2</span>
                    Sobre o Sinistro
                  </h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-[#64748B] uppercase tracking-wide">Número da Apólice (Opcional)</label>
                        <input 
                          type="text" 
                          name="numeroApolice"
                          value={formData.numeroApolice}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#353E4A] focus:ring-0 transition-colors outline-none" 
                          placeholder="Ex: 123456789" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-[#64748B] uppercase tracking-wide">Data do Ocorrido *</label>
                        <input 
                          required 
                          type="date" 
                          name="dataOcorrido"
                          value={formData.dataOcorrido}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#353E4A] focus:ring-0 transition-colors outline-none" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[#64748B] uppercase tracking-wide">Relato do Ocorrido *</label>
                      <textarea 
                        required 
                        rows={4} 
                        name="relato"
                        value={formData.relato}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#353E4A] focus:ring-0 transition-colors outline-none resize-none" 
                        placeholder="Descreva brevemente o que aconteceu..."
                      ></textarea>
                    </div>
                  </div>
                </div>

                <hr className="border-[#E2E8F0]" />

                {/* Document Upload */}
                <div>
                  <h3 className="font-display text-xl font-bold text-[#353E4A] mb-6 flex items-center gap-2">
                    <span className={`w-8 h-8 rounded-full ${brandBg} text-white flex items-center justify-center text-sm`}>3</span>
                    Documentação
                  </h3>
                  
                  <div 
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${dragActive ? `border-[${brandColor}] bg-[${brandColor}]/5` : 'border-[#CBD5E1] hover:border-[#94A3B8]'}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input 
                      ref={inputRef}
                      type="file" 
                      multiple 
                      className="hidden" 
                      onChange={handleChange}
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    />
                    
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-[#F1F5F9] flex items-center justify-center ${dragActive ? 'scale-110' : ''} transition-transform`}>
                      <UploadCloud className={`w-8 h-8 ${brandText}`} />
                    </div>
                    
                    <p className="text-lg font-medium text-[#353E4A] mb-2">
                      Arraste e solte seus arquivos aqui
                    </p>
                    <p className="text-[#64748B] mb-6">
                      ou <button type="button" onClick={() => inputRef.current?.click()} className={`font-bold ${brandText} hover:underline`}>clique para selecionar</button>
                    </p>
                    <p className="text-xs text-[#94A3B8]">
                      Suportamos PDF, JPG, PNG e DOCX (Máx. 10MB)
                    </p>
                  </div>

                  {/* File List */}
                  {files.length > 0 && (
                    <div className="mt-6 space-y-3">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg animate-fade-in-up">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-10 h-10 bg-white border border-[#E2E8F0] rounded flex items-center justify-center shrink-0">
                              <FileText className="w-5 h-5 text-[#64748B]" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-[#353E4A] truncate">{file.name}</p>
                              <p className="text-xs text-[#64748B]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <button 
                            type="button"
                            onClick={() => removeFile(index)}
                            className="p-2 text-[#94A3B8] hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4">
                  <BrutalButton 
                    type="submit" 
                    variant={isLivonius ? 'teal' : 'azure'} 
                    className="w-full md:w-auto min-w-[200px]"
                    disabled={enviarSinistro.isPending}
                  >
                    {enviarSinistro.isPending ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Enviando...
                      </span>
                    ) : (
                      'Enviar Aviso de Sinistro'
                    )}
                  </BrutalButton>
                </div>

              </div>
            </form>
          )}
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
    </div>
  );
}
