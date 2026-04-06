import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAutoSave } from "@/hooks/useAutoSave";
import { 
  Bus, 
  Sun, 
  Shield, 
  Wheat, 
  HardHat,
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
  Sparkles,
  Building2,
  User,
  Phone,
  Mail,
  MessageCircle,
  Upload,
  FileText,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Tipos
type Produto = "rco" | "solar" | "garantia" | "agro" | "engenharia";
type TipoPessoa = "pf" | "pj";

interface FormData {
  produto: Produto | null;
  tipoPessoa: TipoPessoa | null;
  cpfCnpj: string;
  nome: string;
  nomeFantasia: string;
  email: string;
  whatsapp: string;
  observacoes: string;
  // Dados da empresa (preenchidos via CNPJ)
  endereco: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  telefoneEmpresa: string;
}

// Produtos com ícones e cores
const produtos = [
  { 
    id: "rco" as Produto, 
    nome: "RCO Ônibus", 
    descricao: "Responsabilidade Civil",
    icon: Bus, 
    marca: "livonius",
    cor: "#056677",
    corClara: "#E8F4F6"
  },
  { 
    id: "solar" as Produto, 
    nome: "Energia Solar", 
    descricao: "Sistemas Fotovoltaicos",
    icon: Sun, 
    marca: "livo",
    cor: "#7AB72D",
    corClara: "#F0F7E6"
  },
  { 
    id: "garantia" as Produto, 
    nome: "Seguro Garantia", 
    descricao: "Contratos e Judiciais",
    icon: Shield, 
    marca: "livo",
    cor: "#7AB72D",
    corClara: "#F0F7E6"
  },
  { 
    id: "agro" as Produto, 
    nome: "Penhor Rural e Benfeitorias - RD Máquinas e equipamentos", 
    descricao: "Proteção Agrícola",
    icon: Wheat, 
    marca: "livo",
    cor: "#7AB72D",
    corClara: "#F0F7E6"
  },
  { 
    id: "engenharia" as Produto, 
    nome: "Riscos de Engenharia", 
    descricao: "Obras e Construções",
    icon: HardHat, 
    marca: "livo",
    cor: "#7AB72D",
    corClara: "#F0F7E6"
  },
];

// Animações
const fadeSlide = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

export default function CotacaoConversacional() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    produto: null,
    tipoPessoa: null,
    cpfCnpj: "",
    nome: "",
    nomeFantasia: "",
    email: "",
    whatsapp: "",
    observacoes: "",
    endereco: "",
    bairro: "",
    cidade: "",
    uf: "",
    cep: "",
    telefoneEmpresa: ""
  });
  const [cnpjLoading, setCnpjLoading] = useState(false);
  const [cnpjError, setCnpjError] = useState<string | null>(null);
  const [cnpjSuccess, setCnpjSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [protocolo, setProtocolo] = useState<string | null>(null);
  const [cotacaoId, setCotacaoId] = useState<number | null>(null);

  // Auto-save
  const { lastSaved, isSaving, clearProgress } = useAutoSave(
    formData,
    step,
    { key: "cotacao-conversacional" }
  );

  // tRPC mutations
  const criarCotacao = trpc.cotacao.criar.useMutation();
  const submeterCotacao = trpc.cotacao.submeter.useMutation();

  // Cor atual baseada no produto selecionado
  const produtoAtual = produtos.find(p => p.id === formData.produto);
  const corPrimaria = produtoAtual?.cor || "#056677";
  const corClara = produtoAtual?.corClara || "#E8F4F6";
  const marca = produtoAtual?.marca || "livonius";

  // Handlers
  const handleProdutoSelect = (produto: Produto) => {
    setFormData(prev => ({ ...prev, produto }));
    setTimeout(() => setStep(1), 300);
  };

  const handleTipoPessoaSelect = (tipo: TipoPessoa) => {
    setFormData(prev => ({ ...prev, tipoPessoa: tipo }));
    setTimeout(() => setStep(2), 300);
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Busca automática de CNPJ
  const buscarCNPJ = async (cnpj: string) => {
    const cnpjLimpo = cnpj.replace(/\D/g, "");
    
    // Só busca se for CNPJ completo (14 dígitos)
    if (cnpjLimpo.length !== 14) {
      setCnpjError(null);
      setCnpjSuccess(false);
      return;
    }

    setCnpjLoading(true);
    setCnpjError(null);
    setCnpjSuccess(false);

    try {
      const resultado = await fetch(`/api/trpc/utils.consultarCNPJ?input=${encodeURIComponent(JSON.stringify({ json: { cnpj: cnpjLimpo } }))}`)
        .then(res => res.json());
      
      if (resultado.result?.data?.json?.success && resultado.result?.data?.json?.dados) {
        const dados = resultado.result.data.json.dados;
        
        setFormData(prev => ({
          ...prev,
          nome: dados.razaoSocial || prev.nome,
          nomeFantasia: dados.nomeFantasia || "",
          endereco: dados.endereco || "",
          bairro: dados.bairro || "",
          cidade: dados.cidade || "",
          uf: dados.uf || "",
          cep: dados.cep || "",
          telefoneEmpresa: dados.telefone || "",
          email: dados.email || prev.email,
        }));
        
        setCnpjSuccess(true);
        setCnpjError(null);
      } else {
        setCnpjError(resultado.result?.data?.json?.message || "CNPJ não encontrado");
        setCnpjSuccess(false);
      }
    } catch (error) {
      console.error("Erro ao buscar CNPJ:", error);
      setCnpjError("Erro ao consultar CNPJ. Tente novamente.");
      setCnpjSuccess(false);
    } finally {
      setCnpjLoading(false);
    }
  };

  // Handler específico para CNPJ com busca automática
  const handleCnpjChange = (value: string) => {
    const formatted = formatCpfCnpj(value);
    setFormData(prev => ({ ...prev, cpfCnpj: formatted }));
    
    // Se for PJ e CNPJ completo, buscar dados
    if (formData.tipoPessoa === "pj") {
      const cnpjLimpo = formatted.replace(/\D/g, "");
      if (cnpjLimpo.length === 14) {
        buscarCNPJ(formatted);
      } else {
        setCnpjSuccess(false);
        setCnpjError(null);
      }
    }
  };

  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => Math.max(0, prev - 1));
  };

  // Formatação de CPF/CNPJ
  const formatCpfCnpj = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (formData.tipoPessoa === "pf") {
      return numbers
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
        .slice(0, 14);
    } else {
      return numbers
        .replace(/(\d{2})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1/$2")
        .replace(/(\d{4})(\d{1,2})$/, "$1-$2")
        .slice(0, 18);
    }
  };

  // Formatação de WhatsApp
  const formatWhatsapp = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 15);
  };

  // Validações
  const isStepValid = () => {
    switch (step) {
      case 0: return !!formData.produto;
      case 1: return !!formData.tipoPessoa;
      case 2: 
        const cpfCnpjLen = formData.cpfCnpj.replace(/\D/g, "").length;
        return formData.tipoPessoa === "pf" ? cpfCnpjLen === 11 : cpfCnpjLen === 14;
      case 3: return formData.nome.length >= 3;
      case 4: return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
      case 5: return formData.whatsapp.replace(/\D/g, "").length >= 10;
      default: return true;
    }
  };

  // Submit
  const handleSubmit = async () => {
    if (!formData.produto || !formData.tipoPessoa) return;

    setIsSubmitting(true);
    try {
      // Criar cotação
      const cotacao = await criarCotacao.mutateAsync({
        marca: marca as "livonius" | "livo",
        produto: formData.produto,
        tipoPessoa: formData.tipoPessoa,
        cpfCnpj: formData.cpfCnpj.replace(/\D/g, ""),
        nomeRazaoSocial: formData.nome,
        telefone: formData.whatsapp.replace(/\D/g, ""),
        whatsapp: formData.whatsapp.replace(/\D/g, ""),
        email: formData.email,
        observacoes: formData.observacoes || undefined,
      });

      setCotacaoId(cotacao.id);

      // Submeter
      const resultado = await submeterCotacao.mutateAsync({ id: cotacao.id });
      setProtocolo(resultado.protocolo);
      setStep(7); // Tela de sucesso

      // Limpar auto-save
      clearProgress();
    } catch (error) {
      console.error("Erro ao enviar cotação:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Indicador de progresso
  const totalSteps = 7;
  const progress = Math.min((step / (totalSteps - 1)) * 100, 100);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header minimalista */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="container max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href={marca === "livonius" ? "/livonius" : "/livo"}>
            <button className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Voltar</span>
            </button>
          </Link>
          
          {step > 0 && step < 7 && (
            <div className="flex items-center gap-3">
              {isSaving && (
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Salvando...
                </span>
              )}
              {lastSaved && !isSaving && (
                <span className="text-xs text-gray-400">
                  Salvo automaticamente
                </span>
              )}
            </div>
          )}
        </div>

        {/* Barra de progresso */}
        {step > 0 && step < 7 && (
          <div className="h-1 bg-gray-100">
            <motion.div 
              className="h-full"
              style={{ backgroundColor: corPrimaria }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        )}
      </header>

      {/* Conteúdo principal */}
      <main className="flex-1 flex items-center justify-center pt-20 pb-32 px-4">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {/* Step 0: Seleção de Produto */}
            {step === 0 && (
              <motion.div key="step-0" {...fadeSlide} className="space-y-8">
                <div className="text-center space-y-3">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Sparkles className="w-10 h-10 mx-auto text-amber-500 mb-4" />
                  </motion.div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    Qual seguro você precisa?
                  </h1>
                  <p className="text-gray-500 text-lg">
                    Selecione o produto para começar sua cotação
                  </p>
                </div>

                <motion.div 
                  className="grid gap-4"
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                >
                  {produtos.map((produto) => {
                    const Icon = produto.icon;
                    return (
                      <motion.button
                        key={produto.id}
                        variants={staggerItem}
                        onClick={() => handleProdutoSelect(produto.id)}
                        className={cn(
                          "group relative flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-300",
                          "bg-white hover:shadow-lg",
                          formData.produto === produto.id 
                            ? "border-current shadow-lg" 
                            : "border-gray-100 hover:border-gray-200"
                        )}
                        style={{ 
                          borderColor: formData.produto === produto.id ? produto.cor : undefined,
                          backgroundColor: formData.produto === produto.id ? produto.corClara : undefined
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div 
                          className="w-14 h-14 rounded-xl flex items-center justify-center transition-colors"
                          style={{ backgroundColor: produto.corClara }}
                        >
                          <Icon 
                            className="w-7 h-7 transition-colors"
                            style={{ color: produto.cor }}
                          />
                        </div>
                        <div className="flex-1 text-left">
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {produto.nome}
                          </h3>
                          <p className="text-gray-500 text-sm">
                            {produto.descricao}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span 
                            className="text-xs font-medium px-2 py-1 rounded-full"
                            style={{ 
                              backgroundColor: produto.corClara,
                              color: produto.cor
                            }}
                          >
                            {produto.marca === "livonius" ? "Livonius" : "Livo MGA"}
                          </span>
                          <ChevronRight 
                            className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors"
                          />
                        </div>
                      </motion.button>
                    );
                  })}
                </motion.div>
              </motion.div>
            )}

            {/* Step 1: Tipo de Pessoa */}
            {step === 1 && (
              <motion.div key="step-1" {...fadeSlide} className="space-y-8">
                <div className="text-center space-y-3">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    Você é pessoa física ou jurídica?
                  </h1>
                  <p className="text-gray-500 text-lg">
                    Isso nos ajuda a personalizar sua cotação
                  </p>
                </div>

                <div className="flex justify-center">
                  {[
                    { id: "pj" as TipoPessoa, label: "Empresa", sublabel: "CNPJ", icon: Building2 },
                  ].map((tipo) => {
                    const Icon = tipo.icon;
                    return (
                      <motion.button
                        key={tipo.id}
                        onClick={() => handleTipoPessoaSelect(tipo.id)}
                        className={cn(
                          "group flex flex-col items-center gap-3 p-8 rounded-2xl border-2 transition-all duration-300",
                          "bg-white hover:shadow-lg",
                          formData.tipoPessoa === tipo.id 
                            ? "shadow-lg" 
                            : "border-gray-100 hover:border-gray-200"
                        )}
                        style={{ 
                          borderColor: formData.tipoPessoa === tipo.id ? corPrimaria : undefined,
                          backgroundColor: formData.tipoPessoa === tipo.id ? corClara : undefined
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div 
                          className="w-16 h-16 rounded-2xl flex items-center justify-center transition-colors"
                          style={{ backgroundColor: corClara }}
                        >
                          <Icon 
                            className="w-8 h-8"
                            style={{ color: corPrimaria }}
                          />
                        </div>
                        <div className="text-center">
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {tipo.label}
                          </h3>
                          <p className="text-gray-500 text-sm">
                            {tipo.sublabel}
                          </p>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                <button
                  onClick={handleBack}
                  className="mx-auto flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm">Voltar</span>
                </button>
              </motion.div>
            )}

            {/* Step 2: CPF/CNPJ */}
            {step === 2 && (
              <motion.div key="step-2" {...fadeSlide} className="space-y-8">
                <div className="text-center space-y-3">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    Qual seu {formData.tipoPessoa === "pf" ? "CPF" : "CNPJ"}?
                  </h1>
                  <p className="text-gray-500 text-lg">
                    {formData.tipoPessoa === "pj" 
                      ? "Vamos buscar os dados da sua empresa automaticamente"
                      : "Para identificação da cotação"}
                  </p>
                </div>

                <div className="max-w-md mx-auto space-y-6">
                  <div className="relative">
                    <Input
                      type="text"
                      value={formData.cpfCnpj}
                      onChange={(e) => handleCnpjChange(e.target.value)}
                      placeholder={formData.tipoPessoa === "pf" ? "000.000.000-00" : "00.000.000/0000-00"}
                      className="text-center text-2xl h-16 rounded-xl border-2 border-gray-200 focus:border-current transition-colors"
                      style={{ 
                        borderColor: (isStepValid() || cnpjSuccess) ? corPrimaria : cnpjError ? "#ef4444" : undefined,
                        backgroundColor: (isStepValid() || cnpjSuccess) ? corClara : cnpjError ? "#fef2f2" : undefined
                      }}
                      autoFocus
                    />
                    {/* Loading indicator */}
                    {cnpjLoading && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute right-4 top-1/2 -translate-y-1/2"
                      >
                        <Loader2 className="w-6 h-6 animate-spin" style={{ color: corPrimaria }} />
                      </motion.div>
                    )}
                    {/* Success indicator */}
                    {!cnpjLoading && (isStepValid() || cnpjSuccess) && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute right-4 top-1/2 -translate-y-1/2"
                      >
                        <Check className="w-6 h-6" style={{ color: corPrimaria }} />
                      </motion.div>
                    )}
                  </div>

                  {/* Erro de CNPJ */}
                  {cnpjError && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm text-center"
                    >
                      {cnpjError}
                    </motion.p>
                  )}

                  {/* Dados da empresa encontrados */}
                  {cnpjSuccess && formData.nome && formData.tipoPessoa === "pj" && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl border-2 text-left space-y-2"
                      style={{ borderColor: corPrimaria, backgroundColor: corClara }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Building2 className="w-5 h-5" style={{ color: corPrimaria }} />
                        <span className="font-semibold text-gray-900">Empresa encontrada!</span>
                      </div>
                      <p className="text-gray-800 font-medium">{formData.nome}</p>
                      {formData.nomeFantasia && (
                        <p className="text-gray-600 text-sm">{formData.nomeFantasia}</p>
                      )}
                      {formData.endereco && (
                        <p className="text-gray-500 text-sm">
                          {formData.endereco}, {formData.bairro} - {formData.cidade}/{formData.uf}
                        </p>
                      )}
                    </motion.div>
                  )}

                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={handleBack}
                      className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span className="text-sm">Voltar</span>
                    </button>

                    <Button
                      onClick={handleNext}
                      disabled={!isStepValid() || cnpjLoading}
                      className="px-8 h-12 rounded-xl text-white font-medium transition-all"
                      style={{ backgroundColor: corPrimaria }}
                    >
                      {cnpjLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Buscando...
                        </>
                      ) : (
                        <>
                          Continuar
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Nome */}
            {step === 3 && (
              <motion.div key="step-3" {...fadeSlide} className="space-y-8">
                <div className="text-center space-y-3">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    {formData.tipoPessoa === "pj" ? "Qual a razão social?" : "Qual seu nome completo?"}
                  </h1>
                  <p className="text-gray-500 text-lg">
                    Como devemos chamar você?
                  </p>
                </div>

                <div className="max-w-md mx-auto space-y-6">
                  <Input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => handleInputChange("nome", e.target.value)}
                    placeholder={formData.tipoPessoa === "pj" ? "Nome da empresa" : "Seu nome"}
                    className="text-center text-xl h-14 rounded-xl border-2 border-gray-200 focus:border-current transition-colors"
                    style={{ 
                      borderColor: isStepValid() ? corPrimaria : undefined,
                      backgroundColor: isStepValid() ? corClara : undefined
                    }}
                    autoFocus
                  />

                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={handleBack}
                      className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span className="text-sm">Voltar</span>
                    </button>

                    <Button
                      onClick={handleNext}
                      disabled={!isStepValid()}
                      className="px-8 h-12 rounded-xl text-white font-medium transition-all"
                      style={{ backgroundColor: corPrimaria }}
                    >
                      Continuar
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Email */}
            {step === 4 && (
              <motion.div key="step-4" {...fadeSlide} className="space-y-8">
                <div className="text-center space-y-3">
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: corClara }}
                  >
                    <Mail className="w-8 h-8" style={{ color: corPrimaria }} />
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    Qual seu e-mail?
                  </h1>
                  <p className="text-gray-500 text-lg">
                    Enviaremos a proposta por aqui
                  </p>
                </div>

                <div className="max-w-md mx-auto space-y-6">
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="seu@email.com"
                    className="text-center text-xl h-14 rounded-xl border-2 border-gray-200 focus:border-current transition-colors"
                    style={{ 
                      borderColor: isStepValid() ? corPrimaria : undefined,
                      backgroundColor: isStepValid() ? corClara : undefined
                    }}
                    autoFocus
                  />

                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={handleBack}
                      className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span className="text-sm">Voltar</span>
                    </button>

                    <Button
                      onClick={handleNext}
                      disabled={!isStepValid()}
                      className="px-8 h-12 rounded-xl text-white font-medium transition-all"
                      style={{ backgroundColor: corPrimaria }}
                    >
                      Continuar
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 5: WhatsApp */}
            {step === 5 && (
              <motion.div key="step-5" {...fadeSlide} className="space-y-8">
                <div className="text-center space-y-3">
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: corClara }}
                  >
                    <MessageCircle className="w-8 h-8" style={{ color: corPrimaria }} />
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    Qual seu WhatsApp?
                  </h1>
                  <p className="text-gray-500 text-lg">
                    Para entrarmos em contato rapidamente
                  </p>
                </div>

                <div className="max-w-md mx-auto space-y-6">
                  <Input
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) => handleInputChange("whatsapp", formatWhatsapp(e.target.value))}
                    placeholder="(00) 00000-0000"
                    className="text-center text-xl h-14 rounded-xl border-2 border-gray-200 focus:border-current transition-colors"
                    style={{ 
                      borderColor: isStepValid() ? corPrimaria : undefined,
                      backgroundColor: isStepValid() ? corClara : undefined
                    }}
                    autoFocus
                  />

                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={handleBack}
                      className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span className="text-sm">Voltar</span>
                    </button>

                    <Button
                      onClick={handleNext}
                      disabled={!isStepValid()}
                      className="px-8 h-12 rounded-xl text-white font-medium transition-all"
                      style={{ backgroundColor: corPrimaria }}
                    >
                      Continuar
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 6: Revisão e Envio */}
            {step === 6 && (
              <motion.div key="step-6" {...fadeSlide} className="space-y-8">
                <div className="text-center space-y-3">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    Tudo certo! Vamos revisar?
                  </h1>
                  <p className="text-gray-500 text-lg">
                    Confira seus dados antes de enviar
                  </p>
                </div>

                <div 
                  className="max-w-md mx-auto p-6 rounded-2xl space-y-4"
                  style={{ backgroundColor: corClara }}
                >
                  <div className="flex items-center gap-3 pb-4 border-b" style={{ borderColor: `${corPrimaria}20` }}>
                    {produtoAtual && (
                      <>
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center bg-white"
                        >
                          <produtoAtual.icon className="w-6 h-6" style={{ color: corPrimaria }} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{produtoAtual.nome}</p>
                          <p className="text-sm" style={{ color: corPrimaria }}>
                            {produtoAtual.marca === "livonius" ? "Livonius" : "Livo MGA"}
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">
                        {formData.tipoPessoa === "pf" ? "CPF" : "CNPJ"}
                      </span>
                      <span className="font-medium text-gray-900">{formData.cpfCnpj}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Nome</span>
                      <span className="font-medium text-gray-900">{formData.nome}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">E-mail</span>
                      <span className="font-medium text-gray-900">{formData.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">WhatsApp</span>
                      <span className="font-medium text-gray-900">{formData.whatsapp}</span>
                    </div>
                  </div>
                </div>

                <div className="max-w-md mx-auto space-y-4">
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full h-14 rounded-xl text-white font-medium text-lg transition-all"
                    style={{ backgroundColor: corPrimaria }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        Enviar Cotação
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>

                  <button
                    onClick={handleBack}
                    disabled={isSubmitting}
                    className="mx-auto flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm">Voltar e editar</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 7: Sucesso */}
            {step === 7 && protocolo && (
              <motion.div key="step-7" {...fadeSlide} className="space-y-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.6 }}
                  className="w-24 h-24 rounded-full flex items-center justify-center mx-auto"
                  style={{ backgroundColor: corClara }}
                >
                  <Check className="w-12 h-12" style={{ color: corPrimaria }} />
                </motion.div>

                <div className="space-y-3">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    Cotação enviada!
                  </h1>
                  <p className="text-gray-500 text-lg max-w-md mx-auto">
                    Nossa equipe entrará em contato em até <strong>24 horas úteis</strong> pelo WhatsApp ou e-mail.
                  </p>
                </div>

                <div 
                  className="inline-block px-6 py-4 rounded-2xl"
                  style={{ backgroundColor: corClara }}
                >
                  <p className="text-sm text-gray-500 mb-1">Seu protocolo</p>
                  <p 
                    className="text-2xl font-bold tracking-wider"
                    style={{ color: corPrimaria }}
                  >
                    {protocolo}
                  </p>
                </div>

                <div className="pt-4">
                  <Link href={marca === "livonius" ? "/livonius" : "/livo"}>
                    <Button
                      variant="outline"
                      className="rounded-xl h-12 px-8"
                    >
                      Voltar ao início
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer com marca */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gray-100 py-4">
        <div className="container max-w-4xl mx-auto px-4 flex items-center justify-center">
          <p className="text-sm text-gray-400">
            {marca === "livonius" ? "Livonius MGA Seguros" : "Livo MGA"} • Grupo Livonius
          </p>
        </div>
      </footer>
    </div>
  );
}
