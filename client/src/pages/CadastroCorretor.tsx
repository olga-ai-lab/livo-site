import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { useAutoSave } from "@/hooks/useAutoSave";
import { RecoverProgressModal } from "@/components/RecoverProgressModal";
import { AutoSaveIndicator } from "@/components/AutoSaveIndicator";
import { Link } from "wouter";
import {
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  CreditCard,
  Upload,
  Check,
  ChevronRight,
  ChevronLeft,
  Loader2,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Building,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface FormData {
  // Dados da empresa
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  inscricaoEstadual: string;
  // Endereço
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  // Contato empresa
  telefoneEmpresa: string;
  emailEmpresa: string;
  website: string;
  // Responsável
  nomeResponsavel: string;
  cpfResponsavel: string;
  cargoResponsavel: string;
  telefoneResponsavel: string;
  emailResponsavel: string;
  // Dados bancários
  bancoNome: string;
  bancoCodigo: string;
  agencia: string;
  conta: string;
  tipoConta: "corrente" | "poupanca" | "";
  pixChave: string;
  // Documentos
  docContratoSocial: string;
  docComprovanteBancarioPJ: string;
  docComprovantesBancariosSocios: string[];
  // SUSEP
  susepNumero: string;
  observacoes: string;
}

const initialFormData: FormData = {
  cnpj: "",
  razaoSocial: "",
  nomeFantasia: "",
  inscricaoEstadual: "",
  cep: "",
  logradouro: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  estado: "",
  telefoneEmpresa: "",
  emailEmpresa: "",
  website: "",
  nomeResponsavel: "",
  cpfResponsavel: "",
  cargoResponsavel: "",
  telefoneResponsavel: "",
  emailResponsavel: "",
  bancoNome: "",
  bancoCodigo: "",
  agencia: "",
  conta: "",
  tipoConta: "",
  pixChave: "",
  docContratoSocial: "",
  docComprovanteBancarioPJ: "",
  docComprovantesBancariosSocios: [],
  susepNumero: "",
  observacoes: "",
};

// Cores da marca
const brandColors = {
  primary: "#0D9488", // Teal Livonius
  secondary: "#7AB72D", // Verde Livo
};

export default function CadastroCorretor() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [protocolo, setProtocolo] = useState("");
  const [error, setError] = useState("");
  const [showRecoverModal, setShowRecoverModal] = useState(false);
  
  // Busca de CNPJ
  const [cnpjBuscando, setCnpjBuscando] = useState(false);
  const [cnpjEncontrado, setCnpjEncontrado] = useState(false);
  const [cnpjErro, setCnpjErro] = useState("");

  // Auto-save
  const { lastSaved, isSaving, hasUnsavedChanges, hasSavedProgress, clearProgress, loadProgress } = useAutoSave(
    { step, formData },
    step,
    {
      key: "corretor-form",
      onRestore: (saved) => {
        if (saved && !submitSuccess) {
          setShowRecoverModal(true);
        }
      },
    }
  );

  // Verificar progresso salvo ao montar
  useEffect(() => {
    if (hasSavedProgress() && !submitSuccess) {
      setShowRecoverModal(true);
    }
  }, []);

  // Mutation para cadastrar corretor
  const cadastrarCorretor = trpc.corretor.cadastrar.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        setProtocolo(data.protocolo || "");
        setSubmitSuccess(true);
        clearProgress();
      } else {
        setError(data.message || "Erro ao cadastrar");
      }
      setIsSubmitting(false);
    },
    onError: (err) => {
      setError(err.message || "Erro ao cadastrar");
      setIsSubmitting(false);
    },
  });

  // Buscar CNPJ
  const buscarCNPJ = useCallback(async (cnpj: string) => {
    const cnpjLimpo = cnpj.replace(/\D/g, "");
    if (cnpjLimpo.length !== 14) return;

    setCnpjBuscando(true);
    setCnpjErro("");
    setCnpjEncontrado(false);

    try {
      const response = await fetch(
        `/api/trpc/utils.consultarCNPJ?input=${encodeURIComponent(JSON.stringify({ cnpj: cnpjLimpo }))}`
      );
      const result = await response.json();
      const data = result.result?.data;

      if (data?.success && data.dados) {
        const d = data.dados;
        setFormData((prev) => ({
          ...prev,
          razaoSocial: d.razaoSocial || "",
          nomeFantasia: d.nomeFantasia || "",
          logradouro: d.logradouro || "",
          numero: d.numero || "",
          complemento: d.complemento || "",
          bairro: d.bairro || "",
          cidade: d.cidade || "",
          estado: d.uf || "",
          cep: d.cep || "",
          telefoneEmpresa: d.telefone || "",
        }));
        setCnpjEncontrado(true);
      } else {
        setCnpjErro(data?.message || "CNPJ não encontrado");
      }
    } catch (err) {
      setCnpjErro("Erro ao consultar CNPJ");
    } finally {
      setCnpjBuscando(false);
    }
  }, []);

  // Formatar CNPJ
  const formatCNPJ = (value: string) => {
    const nums = value.replace(/\D/g, "").slice(0, 14);
    return nums
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  };

  // Formatar CPF
  const formatCPF = (value: string) => {
    const nums = value.replace(/\D/g, "").slice(0, 11);
    return nums
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1-$2");
  };

  // Formatar telefone
  const formatPhone = (value: string) => {
    const nums = value.replace(/\D/g, "").slice(0, 11);
    if (nums.length <= 10) {
      return nums.replace(/(\d{2})(\d{4})(\d)/, "($1) $2-$3");
    }
    return nums.replace(/(\d{2})(\d{5})(\d)/, "($1) $2-$3");
  };

  // Formatar CEP
  const formatCEP = (value: string) => {
    const nums = value.replace(/\D/g, "").slice(0, 8);
    return nums.replace(/(\d{5})(\d)/, "$1-$2");
  };

  // Handler de input
  const handleInput = (field: keyof FormData, value: string) => {
    let formatted = value;
    
    if (field === "cnpj") {
      formatted = formatCNPJ(value);
      if (formatted.replace(/\D/g, "").length === 14) {
        buscarCNPJ(formatted);
      }
    } else if (field === "cpfResponsavel") {
      formatted = formatCPF(value);
    } else if (field === "telefoneEmpresa" || field === "telefoneResponsavel") {
      formatted = formatPhone(value);
    } else if (field === "cep") {
      formatted = formatCEP(value);
    }
    
    setFormData((prev) => ({ ...prev, [field]: formatted }));
  };

  // Validação por step
  const canProceed = () => {
    switch (step) {
      case 1: // CNPJ
        return formData.cnpj.replace(/\D/g, "").length === 14;
      case 2: // Dados empresa
        return formData.razaoSocial.length >= 3 && formData.emailEmpresa.includes("@");
      case 3: // Responsável
        return (
          formData.nomeResponsavel.length >= 3 &&
          formData.telefoneResponsavel.replace(/\D/g, "").length >= 10 &&
          formData.emailResponsavel.includes("@")
        );
      case 4: // Dados bancários
        return true; // Opcional
      case 5: // Documentos
        return true; // Opcional por enquanto
      default:
        return true;
    }
  };

  // Submit
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError("");
    
    cadastrarCorretor.mutate({
      cnpj: formData.cnpj,
      razaoSocial: formData.razaoSocial,
      nomeFantasia: formData.nomeFantasia || undefined,
      inscricaoEstadual: formData.inscricaoEstadual || undefined,
      cep: formData.cep || undefined,
      logradouro: formData.logradouro || undefined,
      numero: formData.numero || undefined,
      complemento: formData.complemento || undefined,
      bairro: formData.bairro || undefined,
      cidade: formData.cidade || undefined,
      estado: formData.estado || undefined,
      telefoneEmpresa: formData.telefoneEmpresa || undefined,
      emailEmpresa: formData.emailEmpresa,
      website: formData.website || undefined,
      nomeResponsavel: formData.nomeResponsavel,
      cpfResponsavel: formData.cpfResponsavel || undefined,
      cargoResponsavel: formData.cargoResponsavel || undefined,
      telefoneResponsavel: formData.telefoneResponsavel,
      emailResponsavel: formData.emailResponsavel,
      bancoNome: formData.bancoNome || undefined,
      bancoCodigo: formData.bancoCodigo || undefined,
      agencia: formData.agencia || undefined,
      conta: formData.conta || undefined,
      tipoConta: formData.tipoConta || undefined,
      pixChave: formData.pixChave || undefined,
      docContratoSocial: formData.docContratoSocial || undefined,
      docComprovanteBancarioPJ: formData.docComprovanteBancarioPJ || undefined,
      docComprovantesBancariosSocios: formData.docComprovantesBancariosSocios.length > 0 
        ? formData.docComprovantesBancariosSocios 
        : undefined,
      susepNumero: formData.susepNumero || undefined,
      observacoes: formData.observacoes || undefined,
    });
  };

  // Recuperar progresso
  const handleRecover = (saved: any) => {
    if (saved) {
      setStep(saved.step || 0);
      setFormData(saved.formData || initialFormData);
    }
    setShowRecoverModal(false);
  };

  // Steps do formulário
  const steps = [
    { id: 0, title: "Início", icon: Sparkles },
    { id: 1, title: "CNPJ", icon: Building2 },
    { id: 2, title: "Empresa", icon: Building },
    { id: 3, title: "Responsável", icon: User },
    { id: 4, title: "Bancário", icon: CreditCard },
    { id: 5, title: "Documentos", icon: FileText },
    { id: 6, title: "Revisão", icon: Check },
  ];

  // Tela de sucesso
  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-lg w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="w-10 h-10 text-teal-600" />
          </motion.div>
          
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Cadastro Recebido!
          </h1>
          
          <p className="text-slate-600 mb-6">
            Seu cadastro foi enviado com sucesso. Nossa equipe irá analisar e entrar em contato em breve.
          </p>
          
          <div className="bg-slate-50 rounded-xl p-4 mb-8">
            <p className="text-sm text-slate-500 mb-1">Seu protocolo</p>
            <p className="text-2xl font-mono font-bold text-teal-600">{protocolo}</p>
          </div>
          
          <Link href="/">
            <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
              Voltar ao Início
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            <button className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Voltar</span>
            </button>
          </Link>
          
          <div className="flex items-center gap-4">
            <AutoSaveIndicator lastSaved={lastSaved} isSaving={isSaving} hasUnsavedChanges={hasUnsavedChanges} />
            <img
              src="/images/logo-livonius-branco.svg"
              alt="Grupo Livonius"
              className="h-8 invert"
            />
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-white border-b border-slate-100">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-2 overflow-x-auto">
            {steps.map((s, i) => (
              <div
                key={s.id}
                className={`flex items-center gap-2 ${
                  i <= step ? "text-teal-600" : "text-slate-300"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                    i < step
                      ? "bg-teal-600 text-white"
                      : i === step
                      ? "bg-teal-100 text-teal-600 ring-2 ring-teal-600"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {i < step ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className="hidden md:inline text-sm font-medium whitespace-nowrap">
                  {s.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="pt-32 pb-24 px-4">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {/* Step 0: Início */}
            {step === 0 && (
              <motion.div
                key="step-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                  <Briefcase className="w-10 h-10 text-white" />
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                  Seja um Corretor Parceiro
                </h1>
                
                <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
                  Junte-se ao Grupo Livonius e tenha acesso a produtos exclusivos e condições especiais.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {[
                    { icon: Building2, text: "Produtos exclusivos" },
                    { icon: CreditCard, text: "Comissões competitivas" },
                    { icon: User, text: "Suporte dedicado" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-xl p-4 shadow-sm border border-slate-100"
                    >
                      <item.icon className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                      <p className="text-sm text-slate-600">{item.text}</p>
                    </div>
                  ))}
                </div>
                
                <Button
                  onClick={() => setStep(1)}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-6 text-lg rounded-xl"
                >
                  Iniciar Cadastro
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            )}

            {/* Step 1: CNPJ */}
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
              >
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Qual o CNPJ da sua corretora?
                </h2>
                <p className="text-slate-600 mb-6">
                  Vamos buscar os dados automaticamente para facilitar seu cadastro.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <div className="relative">
                      <Input
                        id="cnpj"
                        value={formData.cnpj}
                        onChange={(e) => handleInput("cnpj", e.target.value)}
                        placeholder="00.000.000/0000-00"
                        className="text-lg py-6"
                      />
                      {cnpjBuscando && (
                        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-600 animate-spin" />
                      )}
                      {cnpjEncontrado && !cnpjBuscando && (
                        <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
                      )}
                    </div>
                    {cnpjErro && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {cnpjErro}
                      </p>
                    )}
                  </div>
                  
                  {cnpjEncontrado && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="bg-green-50 border border-green-200 rounded-xl p-4"
                    >
                      <p className="text-green-800 font-medium flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5" />
                        Empresa encontrada!
                      </p>
                      <p className="text-green-700 mt-1">{formData.razaoSocial}</p>
                      {formData.cidade && formData.estado && (
                        <p className="text-green-600 text-sm">
                          {formData.cidade} - {formData.estado}
                        </p>
                      )}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 2: Dados da Empresa */}
            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
              >
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Dados da Empresa
                </h2>
                <p className="text-slate-600 mb-6">
                  Confirme ou complete as informações da sua corretora.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="razaoSocial">Razão Social *</Label>
                    <Input
                      id="razaoSocial"
                      value={formData.razaoSocial}
                      onChange={(e) => handleInput("razaoSocial", e.target.value)}
                      placeholder="Nome da empresa"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="nomeFantasia">Nome Fantasia</Label>
                    <Input
                      id="nomeFantasia"
                      value={formData.nomeFantasia}
                      onChange={(e) => handleInput("nomeFantasia", e.target.value)}
                      placeholder="Nome comercial"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cidade">Cidade</Label>
                      <Input
                        id="cidade"
                        value={formData.cidade}
                        onChange={(e) => handleInput("cidade", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="estado">UF</Label>
                      <Input
                        id="estado"
                        value={formData.estado}
                        onChange={(e) => handleInput("estado", e.target.value)}
                        maxLength={2}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="emailEmpresa">E-mail da Empresa *</Label>
                    <Input
                      id="emailEmpresa"
                      type="email"
                      value={formData.emailEmpresa}
                      onChange={(e) => handleInput("emailEmpresa", e.target.value)}
                      placeholder="contato@empresa.com.br"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="telefoneEmpresa">Telefone</Label>
                    <Input
                      id="telefoneEmpresa"
                      value={formData.telefoneEmpresa}
                      onChange={(e) => handleInput("telefoneEmpresa", e.target.value)}
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Responsável */}
            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
              >
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Quem é o responsável pelo cadastro?
                </h2>
                <p className="text-slate-600 mb-6">
                  Informe os dados da pessoa que será nosso contato principal.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="nomeResponsavel">Nome Completo *</Label>
                    <Input
                      id="nomeResponsavel"
                      value={formData.nomeResponsavel}
                      onChange={(e) => handleInput("nomeResponsavel", e.target.value)}
                      placeholder="Seu nome completo"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cpfResponsavel">CPF</Label>
                    <Input
                      id="cpfResponsavel"
                      value={formData.cpfResponsavel}
                      onChange={(e) => handleInput("cpfResponsavel", e.target.value)}
                      placeholder="000.000.000-00"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cargoResponsavel">Cargo</Label>
                    <Input
                      id="cargoResponsavel"
                      value={formData.cargoResponsavel}
                      onChange={(e) => handleInput("cargoResponsavel", e.target.value)}
                      placeholder="Ex: Diretor, Sócio, Corretor"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="telefoneResponsavel">WhatsApp/Telefone *</Label>
                    <Input
                      id="telefoneResponsavel"
                      value={formData.telefoneResponsavel}
                      onChange={(e) => handleInput("telefoneResponsavel", e.target.value)}
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="emailResponsavel">E-mail *</Label>
                    <Input
                      id="emailResponsavel"
                      type="email"
                      value={formData.emailResponsavel}
                      onChange={(e) => handleInput("emailResponsavel", e.target.value)}
                      placeholder="seu@email.com.br"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Dados Bancários */}
            {step === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
              >
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Dados Bancários
                </h2>
                <p className="text-slate-600 mb-6">
                  Para recebimento de comissões. Pode preencher depois se preferir.
                </p>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bancoNome">Banco</Label>
                      <Input
                        id="bancoNome"
                        value={formData.bancoNome}
                        onChange={(e) => handleInput("bancoNome", e.target.value)}
                        placeholder="Nome do banco"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bancoCodigo">Código</Label>
                      <Input
                        id="bancoCodigo"
                        value={formData.bancoCodigo}
                        onChange={(e) => handleInput("bancoCodigo", e.target.value)}
                        placeholder="000"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="agencia">Agência</Label>
                      <Input
                        id="agencia"
                        value={formData.agencia}
                        onChange={(e) => handleInput("agencia", e.target.value)}
                        placeholder="0000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="conta">Conta</Label>
                      <Input
                        id="conta"
                        value={formData.conta}
                        onChange={(e) => handleInput("conta", e.target.value)}
                        placeholder="00000-0"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label>Tipo de Conta</Label>
                    <div className="flex gap-4 mt-2">
                      {["corrente", "poupanca"].map((tipo) => (
                        <button
                          key={tipo}
                          onClick={() => setFormData((prev) => ({ ...prev, tipoConta: tipo as any }))}
                          className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${
                            formData.tipoConta === tipo
                              ? "border-teal-600 bg-teal-50 text-teal-700"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          {tipo === "corrente" ? "Corrente" : "Poupança"}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="pixChave">Chave PIX</Label>
                    <Input
                      id="pixChave"
                      value={formData.pixChave}
                      onChange={(e) => handleInput("pixChave", e.target.value)}
                      placeholder="CNPJ, e-mail, telefone ou chave aleatória"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 5: Documentos */}
            {step === 5 && (
              <motion.div
                key="step-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
              >
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Documentos
                </h2>
                <p className="text-slate-600 mb-6">
                  Envie os documentos necessários para análise. Pode enviar depois se preferir.
                </p>
                
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-teal-300 transition-colors cursor-pointer">
                    <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-600 font-medium">Contrato Social</p>
                    <p className="text-slate-400 text-sm">PDF, JPG ou PNG até 10MB</p>
                  </div>
                  
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-teal-300 transition-colors cursor-pointer">
                    <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-600 font-medium">Comprovante Bancário PJ</p>
                    <p className="text-slate-400 text-sm">PDF, JPG ou PNG até 10MB</p>
                  </div>
                  
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-teal-300 transition-colors cursor-pointer">
                    <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-600 font-medium">Comprovantes Bancários dos Sócios</p>
                    <p className="text-slate-400 text-sm">Pode enviar múltiplos arquivos</p>
                  </div>
                  
                  <div>
                    <Label htmlFor="susepNumero">Número SUSEP (se houver)</Label>
                    <Input
                      id="susepNumero"
                      value={formData.susepNumero}
                      onChange={(e) => handleInput("susepNumero", e.target.value)}
                      placeholder="Número de registro na SUSEP"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="observacoes">Observações</Label>
                    <Textarea
                      id="observacoes"
                      value={formData.observacoes}
                      onChange={(e) => handleInput("observacoes", e.target.value)}
                      placeholder="Alguma informação adicional?"
                      rows={3}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 6: Revisão */}
            {step === 6 && (
              <motion.div
                key="step-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
              >
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Revise seu cadastro
                </h2>
                <p className="text-slate-600 mb-6">
                  Confira se todas as informações estão corretas antes de enviar.
                </p>
                
                <div className="space-y-6">
                  {/* Empresa */}
                  <div className="bg-slate-50 rounded-xl p-4">
                    <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-teal-600" />
                      Empresa
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-slate-500">CNPJ:</span>
                        <span className="ml-2 text-slate-900">{formData.cnpj}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Razão Social:</span>
                        <span className="ml-2 text-slate-900">{formData.razaoSocial}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">E-mail:</span>
                        <span className="ml-2 text-slate-900">{formData.emailEmpresa}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Cidade:</span>
                        <span className="ml-2 text-slate-900">{formData.cidade} - {formData.estado}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Responsável */}
                  <div className="bg-slate-50 rounded-xl p-4">
                    <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <User className="w-5 h-5 text-teal-600" />
                      Responsável
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-slate-500">Nome:</span>
                        <span className="ml-2 text-slate-900">{formData.nomeResponsavel}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Telefone:</span>
                        <span className="ml-2 text-slate-900">{formData.telefoneResponsavel}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">E-mail:</span>
                        <span className="ml-2 text-slate-900">{formData.emailResponsavel}</span>
                      </div>
                      {formData.cargoResponsavel && (
                        <div>
                          <span className="text-slate-500">Cargo:</span>
                          <span className="ml-2 text-slate-900">{formData.cargoResponsavel}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Bancário */}
                  {formData.bancoNome && (
                    <div className="bg-slate-50 rounded-xl p-4">
                      <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-teal-600" />
                        Dados Bancários
                      </h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-slate-500">Banco:</span>
                          <span className="ml-2 text-slate-900">{formData.bancoNome}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Agência:</span>
                          <span className="ml-2 text-slate-900">{formData.agencia}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Conta:</span>
                          <span className="ml-2 text-slate-900">{formData.conta}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {error && (
                  <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation buttons */}
          {step > 0 && (
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => setStep((s) => s - 1)}
                disabled={isSubmitting}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              
              {step < 6 ? (
                <Button
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!canProceed()}
                  className="bg-teal-600 hover:bg-teal-700 text-white"
                >
                  Continuar
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-teal-600 hover:bg-teal-700 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      Enviar Cadastro
                      <Check className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Modal de recuperação */}
      <RecoverProgressModal
        isOpen={showRecoverModal}
        onRecover={() => {
          const saved = loadProgress();
          if (saved) {
            setStep(saved.step || 0);
            setFormData((saved.data as any)?.formData || initialFormData);
          }
          setShowRecoverModal(false);
        }}
        onStartNew={() => {
          clearProgress();
          setShowRecoverModal(false);
        }}
        onClose={() => setShowRecoverModal(false)}
        savedInfo={hasSavedProgress() ? {
          timestamp: new Date(loadProgress()?.timestamp || Date.now()),
          step: loadProgress()?.step || 0,
          timeAgo: "agora",
        } : null}
      />
    </div>
  );
}
