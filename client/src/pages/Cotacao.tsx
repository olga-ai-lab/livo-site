import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Bus, 
  Sun, 
  Shield, 
  Tractor, 
  HardHat,
  ArrowRight,
  ArrowLeft,
  Upload,
  FileText,
  Check,
  Loader2,
  Sparkles,
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  X,
  CheckCircle2,
} from "lucide-react";
import { nanoid } from "nanoid";
import { useAutoSave } from "@/hooks/useAutoSave";
import { RecoverProgressModal } from "@/components/RecoverProgressModal";
import { AutoSaveIndicator } from "@/components/AutoSaveIndicator";
import { Cloud } from "lucide-react";

// Tipos
type Marca = "livonius" | "livo";
type Produto = "rco" | "solar" | "garantia" | "agro" | "engenharia";
type TipoPessoa = "pf" | "pj";

interface ProdutoInfo {
  id: Produto;
  nome: string;
  descricao: string;
  icon: React.ReactNode;
  marca: Marca;
  cor: string;
}

// Configuração dos produtos
const produtos: ProdutoInfo[] = [
  {
    id: "rco",
    nome: "RCO - Ônibus",
    descricao: "Responsabilidade Civil do Transportador",
    icon: <Bus className="w-8 h-8" />,
    marca: "livonius",
    cor: "from-amber-500 to-orange-600",
  },
  {
    id: "solar",
    nome: "Energia Solar",
    descricao: "Proteção para sistemas fotovoltaicos",
    icon: <Sun className="w-8 h-8" />,
    marca: "livo",
    cor: "from-lime-500 to-green-600",
  },
  {
    id: "garantia",
    nome: "Seguro Garantia",
    descricao: "Garantias contratuais e judiciais",
    icon: <Shield className="w-8 h-8" />,
    marca: "livo",
    cor: "from-lime-500 to-green-600",
  },
  {
    id: "agro",
    nome: "Penhor Rural e Benfeitorias - RD Máquinas e equipamentos",
    descricao: "Proteção para bens agrícolas",
    icon: <Tractor className="w-8 h-8" />,
    marca: "livo",
    cor: "from-lime-500 to-green-600",
  },
  {
    id: "engenharia",
    nome: "Riscos de Engenharia",
    descricao: "Cobertura para obras e construções",
    icon: <HardHat className="w-8 h-8" />,
    marca: "livo",
    cor: "from-lime-500 to-green-600",
  },
];

// Campos específicos por produto
const camposPorProduto: Record<Produto, { label: string; name: string; type: string; placeholder?: string; options?: string[] }[]> = {
  rco: [
    { label: "Quantidade de Veículos", name: "quantidadeVeiculos", type: "number", placeholder: "Ex: 10" },
    { label: "Tipo de Veículo", name: "tipoVeiculo", type: "select", options: ["Ônibus", "Micro-ônibus", "Van"] },
    { label: "Tipo de Operação", name: "tipoOperacao", type: "select", options: ["Urbano", "Rodoviário", "Fretamento", "Turismo", "Escolar"] },
    { label: "Registro ANTT/DER", name: "registroANTT", type: "text", placeholder: "Número do registro" },
    { label: "Capacidade Média de Passageiros", name: "capacidadePassageiros", type: "number", placeholder: "Ex: 45" },
  ],
  solar: [
    { label: "Potência Instalada (kWp)", name: "potenciaInstalada", type: "number", placeholder: "Ex: 5.5" },
    { label: "Quantidade de Painéis", name: "quantidadePaineis", type: "number", placeholder: "Ex: 12" },
    { label: "Tipo de Instalação", name: "tipoInstalacao", type: "select", options: ["Residencial", "Comercial", "Industrial", "Rural"] },
    { label: "Valor Total do Sistema (R$)", name: "valorSistema", type: "number", placeholder: "Ex: 25000" },
    { label: "Data de Instalação", name: "dataInstalacao", type: "date" },
  ],
  garantia: [
    { label: "Tipo de Garantia", name: "tipoGarantia", type: "select", options: ["Contratual", "Judicial", "Licitante", "Aduaneira"] },
    { label: "Valor da Garantia (R$)", name: "valorGarantia", type: "number", placeholder: "Ex: 100000" },
    { label: "Prazo do Contrato (meses)", name: "prazoContrato", type: "number", placeholder: "Ex: 12" },
    { label: "Objeto do Contrato", name: "objetoContrato", type: "textarea", placeholder: "Descreva o objeto do contrato" },
    { label: "Beneficiário", name: "beneficiario", type: "text", placeholder: "Nome do órgão ou empresa" },
  ],
  agro: [
    { label: "Tipo de Bem", name: "tipoBem", type: "select", options: ["Máquinas Agrícolas", "Benfeitorias", "Equipamentos", "Silos", "Armazéns"] },
    { label: "Descrição do Bem", name: "descricaoBem", type: "textarea", placeholder: "Descreva os bens a serem segurados" },
    { label: "Valor de Mercado (R$)", name: "valorMercado", type: "number", placeholder: "Ex: 500000" },
    { label: "Localização na Propriedade", name: "localizacao", type: "text", placeholder: "Ex: Fazenda São João, Galpão 2" },
    { label: "Número do CAR", name: "numeroCar", type: "text", placeholder: "Cadastro Ambiental Rural" },
  ],
  engenharia: [
    { label: "Tipo de Obra", name: "tipoObra", type: "select", options: ["Construção Civil", "Instalação", "Montagem", "Reforma", "Ampliação"] },
    { label: "Valor Total da Obra (R$)", name: "valorObra", type: "number", placeholder: "Ex: 1000000" },
    { label: "Prazo de Execução (meses)", name: "prazoExecucao", type: "number", placeholder: "Ex: 24" },
    { label: "Endereço da Obra", name: "enderecoObra", type: "text", placeholder: "Endereço completo" },
    { label: "Descrição do Projeto", name: "descricaoProjeto", type: "textarea", placeholder: "Descreva brevemente o projeto" },
  ],
};

// Coberturas por produto
const coberturasPorProduto: Record<Produto, string[]> = {
  rco: [
    "Danos Corporais a Passageiros",
    "Danos Materiais a Passageiros",
    "Danos a Terceiros Não Transportados",
    "Danos a Bagagens",
    "APP - Acidentes Pessoais de Passageiros",
    "Despesas Médicas e Hospitalares",
  ],
  solar: [
    "Danos Elétricos",
    "Vendaval e Granizo",
    "Roubo e Furto",
    "Incêndio",
    "Perda de Receita",
    "Responsabilidade Civil",
  ],
  garantia: [
    "Garantia de Execução",
    "Garantia de Manutenção",
    "Garantia de Adiantamento",
    "Garantia de Retenção",
  ],
  agro: [
    "Incêndio e Raio",
    "Roubo e Furto",
    "Danos Elétricos",
    "Vendaval",
    "Alagamento",
    "Quebra de Máquinas",
  ],
  engenharia: [
    "Danos Materiais",
    "Responsabilidade Civil",
    "Erro de Projeto",
    "Despesas Extraordinárias",
    "Propriedades Circunvizinhas",
    "Equipamentos",
  ],
};

// Componente principal
export default function Cotacao() {
  const [, navigate] = useLocation();
  const [sessionId] = useState(() => nanoid());
  const [currentStep, setCurrentStep] = useState(0);
  const [startTime] = useState(() => Date.now());
  const [stepStartTime, setStepStartTime] = useState(() => Date.now());
  
  // Estado do formulário
  const [produto, setProduto] = useState<Produto | null>(null);
  const [tipoPessoa, setTipoPessoa] = useState<TipoPessoa>("pj");
  const [formData, setFormData] = useState({
    cpfCnpj: "",
    nomeRazaoSocial: "",
    nomeFantasia: "",
    telefone: "",
    whatsapp: "",
    email: "",
    melhorHorario: "",
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    observacoes: "",
  });
  const [dadosProduto, setDadosProduto] = useState<Record<string, any>>({});
  const [coberturas, setCoberturas] = useState<string[]>([]);
  const [arquivos, setArquivos] = useState<File[]>([]);
  const [cotacaoId, setCotacaoId] = useState<number | null>(null);
  const [protocolo, setProtocolo] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);
  const [showRecoverModal, setShowRecoverModal] = useState(false);

  // Dados combinados para auto-save
  const formDataForSave = useMemo(() => ({
    produto,
    tipoPessoa,
    formData,
    dadosProduto,
    coberturas,
    cotacaoId,
    protocolo,
  }), [produto, tipoPessoa, formData, dadosProduto, coberturas, cotacaoId, protocolo]);

  // Hook de auto-save
  const {
    isSaving,
    lastSaved,
    hasUnsavedChanges,
    loadProgress,
    clearProgress,
    hasSavedProgress,
    getSavedProgressInfo,
    saveNow,
  } = useAutoSave(formDataForSave, currentStep, {
    key: 'cotacao-progress',
    debounceMs: 1500,
  });

  // Verificar se há progresso salvo ao montar
  useEffect(() => {
    if (hasSavedProgress() && currentStep === 0 && !sucesso) {
      setShowRecoverModal(true);
    }
  }, []);

  // Handlers do modal de recuperação
  const handleRecoverProgress = () => {
    const saved = loadProgress();
    if (saved) {
      const data = saved.data as typeof formDataForSave;
      if (data.produto) setProduto(data.produto);
      if (data.tipoPessoa) setTipoPessoa(data.tipoPessoa);
      if (data.formData) setFormData(data.formData);
      if (data.dadosProduto) setDadosProduto(data.dadosProduto);
      if (data.coberturas) setCoberturas(data.coberturas);
      if (data.cotacaoId) setCotacaoId(data.cotacaoId);
      if (data.protocolo) setProtocolo(data.protocolo);
      setCurrentStep(saved.step);
      trackEvent("progress_recovered", { step: saved.step });
    }
    setShowRecoverModal(false);
  };

  const handleStartNew = () => {
    clearProgress();
    setShowRecoverModal(false);
    trackEvent("progress_discarded");
  };

  // Mutations
  const criarCotacao = trpc.cotacao.criar.useMutation();
  const atualizarCotacao = trpc.cotacao.atualizar.useMutation();
  const submeterCotacao = trpc.cotacao.submeter.useMutation();
  const uploadDocumento = trpc.cotacao.uploadDocumento.useMutation();
  const registrarAnalytics = trpc.analytics.registrar.useMutation();

  // Registrar analytics
  const trackEvent = useCallback((eventType: string, eventData?: Record<string, any>) => {
    registrarAnalytics.mutate({
      sessionId,
      eventType: eventType as any,
      eventData,
      produto: produto || undefined,
      stepNumber: currentStep,
      timeOnStep: Math.floor((Date.now() - stepStartTime) / 1000),
      totalTimeOnForm: Math.floor((Date.now() - startTime) / 1000),
      userAgent: navigator.userAgent,
      deviceType: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? "mobile" : "desktop",
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      referrer: document.referrer,
      landingPage: window.location.href,
    });
  }, [sessionId, produto, currentStep, stepStartTime, startTime, registrarAnalytics]);

  // Registrar visualização da página
  useEffect(() => {
    trackEvent("page_view");
  }, []);

  // Buscar CEP
  const buscarCep = async (cep: string) => {
    const cepLimpo = cep.replace(/\D/g, "");
    if (cepLimpo.length !== 8) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        setFormData(prev => ({
          ...prev,
          logradouro: data.logradouro || "",
          bairro: data.bairro || "",
          cidade: data.localidade || "",
          estado: data.uf || "",
        }));
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
    }
  };

  // Handlers
  const handleProdutoSelect = async (produtoId: Produto) => {
    setProduto(produtoId);
    trackEvent("form_start", { produto: produtoId });
    
    const produtoInfo = produtos.find(p => p.id === produtoId);
    if (produtoInfo) {
      // Criar cotação no banco
      try {
        const result = await criarCotacao.mutateAsync({
          marca: produtoInfo.marca,
          produto: produtoId,
          tipoPessoa,
          cpfCnpj: "",
          nomeRazaoSocial: "",
          telefone: "",
          email: "",
        });
        
        setCotacaoId(result.id);
        setProtocolo(result.protocolo);
      } catch (error) {
        console.error("Erro ao criar cotação:", error);
      }
    }
    
    setCurrentStep(1);
    setStepStartTime(Date.now());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === "cep" && value.replace(/\D/g, "").length === 8) {
      buscarCep(value);
    }
  };

  const handleDadosProdutoChange = (name: string, value: any) => {
    setDadosProduto(prev => ({ ...prev, [name]: value }));
  };

  const handleCoberturaToggle = (cobertura: string) => {
    setCoberturas(prev => 
      prev.includes(cobertura)
        ? prev.filter(c => c !== cobertura)
        : [...prev, cobertura]
    );
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setArquivos(prev => [...prev, ...files]);
    trackEvent("file_upload", { count: files.length });

    // Upload para S3
    if (cotacaoId) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = async () => {
          const base64 = (reader.result as string).split(",")[1];
          try {
            await uploadDocumento.mutateAsync({
              cotacaoId,
              nomeOriginal: file.name,
              mimeType: file.type,
              base64,
            });
          } catch (error) {
            console.error("Erro ao fazer upload:", error);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleRemoveFile = (index: number) => {
    setArquivos(prev => prev.filter((_, i) => i !== index));
  };

  const handleNext = async () => {
    trackEvent("step_complete", { step: currentStep });
    
    // Salvar dados no banco
    if (cotacaoId) {
      const produtoInfo = produtos.find(p => p.id === produto);
      await atualizarCotacao.mutateAsync({
        id: cotacaoId,
        dados: {
          ...formData,
          marca: produtoInfo?.marca,
          produto: produto!,
          tipoPessoa,
          dadosProduto,
          coberturas,
        },
      });
    }
    
    setCurrentStep(prev => prev + 1);
    setStepStartTime(Date.now());
    trackEvent("step_view", { step: currentStep + 1 });
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
    setStepStartTime(Date.now());
  };

  const handleSubmit = async () => {
    if (!cotacaoId) return;

    trackEvent("form_submit");

    try {
      const result = await submeterCotacao.mutateAsync({ id: cotacaoId });
      setProtocolo(result.protocolo);
      setSucesso(true);
      setCurrentStep(5);
      // Limpar progresso salvo após sucesso
      clearProgress();
    } catch (error) {
      console.error("Erro ao submeter cotação:", error);
    }
  };

  // Formatadores
  const formatCpfCnpj = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (tipoPessoa === "pf") {
      return numbers
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
        .substring(0, 14);
    } else {
      return numbers
        .replace(/(\d{2})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1/$2")
        .replace(/(\d{4})(\d{1,2})$/, "$1-$2")
        .substring(0, 18);
    }
  };

  const formatTelefone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .substring(0, 15);
  };

  const formatCep = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(/(\d{5})(\d)/, "$1-$2").substring(0, 9);
  };

  // Renderização dos steps
  const steps = [
    { title: "Produto", icon: <Sparkles className="w-5 h-5" /> },
    { title: "Identificação", icon: <User className="w-5 h-5" /> },
    { title: "Detalhes", icon: <FileText className="w-5 h-5" /> },
    { title: "Coberturas", icon: <Shield className="w-5 h-5" /> },
    { title: "Revisão", icon: <Check className="w-5 h-5" /> },
  ];

  const produtoSelecionado = produtos.find(p => p.id === produto);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate("/")}
            className="text-white/80 hover:text-white transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar</span>
          </button>
          
          <h1 className="text-xl font-bold text-white">
            Solicitar Cotação
          </h1>
          
          <div className="w-24 flex justify-end">
            {currentStep > 0 && currentStep < 5 && (
              <AutoSaveIndicator
                isSaving={isSaving}
                lastSaved={lastSaved}
                hasUnsavedChanges={hasUnsavedChanges}
              />
            )}
          </div>
        </div>
      </header>

      {/* Modal de Recuperação de Progresso */}
      <RecoverProgressModal
        isOpen={showRecoverModal}
        onRecover={handleRecoverProgress}
        onStartNew={handleStartNew}
        onClose={() => setShowRecoverModal(false)}
        savedInfo={getSavedProgressInfo()}
      />

      {/* Progress Steps */}
      {currentStep > 0 && currentStep < 5 && (
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-2 md:gap-4">
            {steps.slice(1).map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`
                  flex items-center gap-2 px-3 py-2 rounded-full transition-all
                  ${index + 1 < currentStep 
                    ? "bg-green-500/20 text-green-400" 
                    : index + 1 === currentStep 
                      ? `bg-gradient-to-r ${produtoSelecionado?.cor || "from-amber-500 to-orange-600"} text-white`
                      : "bg-white/5 text-white/40"
                  }
                `}>
                  {index + 1 < currentStep ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    step.icon
                  )}
                  <span className="hidden md:inline text-sm font-medium">{step.title}</span>
                </div>
                {index < steps.length - 2 && (
                  <div className={`w-8 md:w-16 h-0.5 mx-2 ${
                    index + 1 < currentStep ? "bg-green-500/50" : "bg-white/10"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* Step 0: Seleção de Produto */}
          {currentStep === 0 && (
            <motion.div
              key="step-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Qual produto você deseja cotar?
                </h2>
                <p className="text-white/60 text-lg">
                  Selecione o tipo de seguro para começar sua cotação
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {produtos.map((prod) => (
                  <motion.button
                    key={prod.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleProdutoSelect(prod.id)}
                    className={`
                      relative p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm
                      hover:bg-white/10 transition-all text-left group overflow-hidden
                    `}
                  >
                    <div className={`
                      absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity
                      bg-gradient-to-br ${prod.cor}
                    `} style={{ opacity: 0.1 }} />
                    
                    <div className={`
                      w-14 h-14 rounded-xl bg-gradient-to-br ${prod.cor}
                      flex items-center justify-center text-white mb-4
                    `}>
                      {prod.icon}
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2">
                      {prod.nome}
                    </h3>
                    <p className="text-white/60 text-sm mb-4">
                      {prod.descricao}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className={`
                        text-xs font-medium px-2 py-1 rounded-full
                        ${prod.marca === "livonius" 
                          ? "bg-amber-500/20 text-amber-400" 
                          : "bg-lime-500/20 text-lime-400"
                        }
                      `}>
                        {prod.marca === "livonius" ? "Livonius" : "Livo MGA"}
                      </span>
                      <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 1: Identificação */}
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${produtoSelecionado?.cor} flex items-center justify-center text-white`}>
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Seus Dados</h3>
                      <p className="text-white/60 text-sm">Informações de identificação</p>
                    </div>
                  </div>

                  {/* Apenas Pessoa Jurídica */}
                  <p className="text-white/70 text-sm mb-4">Somos especializados em seguros para Pessoa Jurídica (CNPJ)</p>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-white/80">CNPJ</Label>
                      <Input
                        name="cpfCnpj"
                        value={formatCpfCnpj(formData.cpfCnpj)}
                        onChange={(e) => setFormData(prev => ({ ...prev, cpfCnpj: e.target.value }))}
                        placeholder="00.000.000/0000-00"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                      />
                    </div>

                    <div>
                      <Label className="text-white/80">Razão Social</Label>
                      <Input
                        name="nomeRazaoSocial"
                        value={formData.nomeRazaoSocial}
                        onChange={handleInputChange}
                        placeholder="Razão social da empresa"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                      />
                    </div>

                    {tipoPessoa === "pj" && (
                      <div>
                        <Label className="text-white/80">Nome Fantasia</Label>
                        <Input
                          name="nomeFantasia"
                          value={formData.nomeFantasia}
                          onChange={handleInputChange}
                          placeholder="Nome fantasia (opcional)"
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-white/80">Telefone</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                          <Input
                            name="telefone"
                            value={formatTelefone(formData.telefone)}
                            onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                            placeholder="(00) 00000-0000"
                            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-white/80">WhatsApp</Label>
                        <Input
                          name="whatsapp"
                          value={formatTelefone(formData.whatsapp)}
                          onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                          placeholder="(00) 00000-0000"
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-white/80">E-mail</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                        <Input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="seu@email.com"
                          className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-white/80">Melhor Horário para Contato</Label>
                      <Select
                        value={formData.melhorHorario}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, melhorHorario: value }))}
                      >
                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                          <SelectValue placeholder="Selecione um horário" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manha">Manhã (8h - 12h)</SelectItem>
                          <SelectItem value="tarde">Tarde (12h - 18h)</SelectItem>
                          <SelectItem value="noite">Noite (18h - 21h)</SelectItem>
                          <SelectItem value="qualquer">Qualquer horário</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Endereço */}
                    <div className="pt-4 border-t border-white/10">
                      <div className="flex items-center gap-2 mb-4">
                        <MapPin className="w-5 h-5 text-white/60" />
                        <span className="text-white/80 font-medium">Endereço</span>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label className="text-white/80">CEP</Label>
                          <Input
                            name="cep"
                            value={formatCep(formData.cep)}
                            onChange={(e) => setFormData(prev => ({ ...prev, cep: e.target.value }))}
                            onBlur={() => buscarCep(formData.cep)}
                            placeholder="00000-000"
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label className="text-white/80">Logradouro</Label>
                          <Input
                            name="logradouro"
                            value={formData.logradouro}
                            onChange={handleInputChange}
                            placeholder="Rua, Avenida, etc."
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-4 mt-4">
                        <div>
                          <Label className="text-white/80">Número</Label>
                          <Input
                            name="numero"
                            value={formData.numero}
                            onChange={handleInputChange}
                            placeholder="123"
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                          />
                        </div>
                        <div className="col-span-3">
                          <Label className="text-white/80">Complemento</Label>
                          <Input
                            name="complemento"
                            value={formData.complemento}
                            onChange={handleInputChange}
                            placeholder="Sala, Andar, etc."
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div>
                          <Label className="text-white/80">Bairro</Label>
                          <Input
                            name="bairro"
                            value={formData.bairro}
                            onChange={handleInputChange}
                            placeholder="Bairro"
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                          />
                        </div>
                        <div>
                          <Label className="text-white/80">Cidade</Label>
                          <Input
                            name="cidade"
                            value={formData.cidade}
                            onChange={handleInputChange}
                            placeholder="Cidade"
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                          />
                        </div>
                        <div>
                          <Label className="text-white/80">Estado</Label>
                          <Input
                            name="estado"
                            value={formData.estado}
                            onChange={handleInputChange}
                            placeholder="UF"
                            maxLength={2}
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between mt-8">
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Voltar
                    </Button>
                    <Button
                      onClick={handleNext}
                      disabled={!formData.cpfCnpj || !formData.nomeRazaoSocial || !formData.telefone || !formData.email}
                      className={`bg-gradient-to-r ${produtoSelecionado?.cor} text-white`}
                    >
                      Continuar
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Detalhes do Produto */}
          {currentStep === 2 && produto && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${produtoSelecionado?.cor} flex items-center justify-center text-white`}>
                      {produtoSelecionado?.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Detalhes do Seguro</h3>
                      <p className="text-white/60 text-sm">{produtoSelecionado?.nome}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {camposPorProduto[produto].map((campo) => (
                      <div key={campo.name}>
                        <Label className="text-white/80">{campo.label}</Label>
                        {campo.type === "select" ? (
                          <Select
                            value={dadosProduto[campo.name] || ""}
                            onValueChange={(value) => handleDadosProdutoChange(campo.name, value)}
                          >
                            <SelectTrigger className="bg-white/5 border-white/10 text-white">
                              <SelectValue placeholder="Selecione uma opção" />
                            </SelectTrigger>
                            <SelectContent>
                              {campo.options?.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : campo.type === "textarea" ? (
                          <Textarea
                            value={dadosProduto[campo.name] || ""}
                            onChange={(e) => handleDadosProdutoChange(campo.name, e.target.value)}
                            placeholder={campo.placeholder}
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 min-h-[100px]"
                          />
                        ) : (
                          <Input
                            type={campo.type}
                            value={dadosProduto[campo.name] || ""}
                            onChange={(e) => handleDadosProdutoChange(campo.name, e.target.value)}
                            placeholder={campo.placeholder}
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                          />
                        )}
                      </div>
                    ))}

                    {/* Upload de Documentos */}
                    <div className="pt-4 border-t border-white/10">
                      <div className="flex items-center gap-2 mb-4">
                        <Upload className="w-5 h-5 text-white/60" />
                        <span className="text-white/80 font-medium">Documentos (opcional)</span>
                      </div>
                      <p className="text-white/50 text-sm mb-4">
                        Envie documentos como lista de veículos, notas fiscais ou projetos para agilizar sua cotação.
                        Nossa IA irá extrair os dados automaticamente.
                      </p>

                      <label className="block">
                        <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center cursor-pointer hover:border-white/40 transition-colors">
                          <Upload className="w-10 h-10 text-white/40 mx-auto mb-3" />
                          <p className="text-white/60">
                            Arraste arquivos ou <span className="text-amber-400">clique para selecionar</span>
                          </p>
                          <p className="text-white/40 text-sm mt-1">
                            PDF, imagens ou planilhas (máx. 10MB cada)
                          </p>
                        </div>
                        <input
                          type="file"
                          multiple
                          accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.csv"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>

                      {arquivos.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {arquivos.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                              <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-white/60" />
                                <span className="text-white/80 text-sm">{file.name}</span>
                              </div>
                              <button
                                onClick={() => handleRemoveFile(index)}
                                className="text-white/40 hover:text-red-400 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between mt-8">
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Voltar
                    </Button>
                    <Button
                      onClick={handleNext}
                      className={`bg-gradient-to-r ${produtoSelecionado?.cor} text-white`}
                    >
                      Continuar
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Coberturas */}
          {currentStep === 3 && produto && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${produtoSelecionado?.cor} flex items-center justify-center text-white`}>
                      <Shield className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Coberturas Desejadas</h3>
                      <p className="text-white/60 text-sm">Selecione as coberturas de interesse</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {coberturasPorProduto[produto].map((cobertura) => (
                      <label
                        key={cobertura}
                        className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                          coberturas.includes(cobertura)
                            ? "border-amber-500 bg-amber-500/10"
                            : "border-white/10 bg-white/5 hover:bg-white/10"
                        }`}
                      >
                        <Checkbox
                          checked={coberturas.includes(cobertura)}
                          onCheckedChange={() => handleCoberturaToggle(cobertura)}
                          className="border-white/40 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                        />
                        <span className={`font-medium ${
                          coberturas.includes(cobertura) ? "text-amber-400" : "text-white/80"
                        }`}>
                          {cobertura}
                        </span>
                      </label>
                    ))}
                  </div>

                  <div className="mt-6">
                    <Label className="text-white/80">Observações Adicionais</Label>
                    <Textarea
                      name="observacoes"
                      value={formData.observacoes}
                      onChange={handleInputChange}
                      placeholder="Descreva necessidades específicas ou informações adicionais..."
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 min-h-[100px] mt-2"
                    />
                  </div>

                  <div className="flex justify-between mt-8">
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Voltar
                    </Button>
                    <Button
                      onClick={handleNext}
                      className={`bg-gradient-to-r ${produtoSelecionado?.cor} text-white`}
                    >
                      Revisar
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 4: Revisão */}
          {currentStep === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${produtoSelecionado?.cor} flex items-center justify-center text-white`}>
                      <Check className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Revisar e Enviar</h3>
                      <p className="text-white/60 text-sm">Confira os dados antes de enviar</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Produto */}
                    <div className="p-4 bg-white/5 rounded-xl">
                      <h4 className="text-white/60 text-sm mb-2">Produto</h4>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${produtoSelecionado?.cor} flex items-center justify-center text-white`}>
                          {produtoSelecionado?.icon}
                        </div>
                        <div>
                          <p className="text-white font-medium">{produtoSelecionado?.nome}</p>
                          <p className="text-white/50 text-sm">
                            {produtoSelecionado?.marca === "livonius" ? "Livonius" : "Livo MGA"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Dados do Cliente */}
                    <div className="p-4 bg-white/5 rounded-xl">
                      <h4 className="text-white/60 text-sm mb-3">Dados do Cliente</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-white/50">{tipoPessoa === "pf" ? "CPF" : "CNPJ"}</span>
                          <p className="text-white">{formatCpfCnpj(formData.cpfCnpj)}</p>
                        </div>
                        <div>
                          <span className="text-white/50">{tipoPessoa === "pf" ? "Nome" : "Razão Social"}</span>
                          <p className="text-white">{formData.nomeRazaoSocial}</p>
                        </div>
                        <div>
                          <span className="text-white/50">Telefone</span>
                          <p className="text-white">{formatTelefone(formData.telefone)}</p>
                        </div>
                        <div>
                          <span className="text-white/50">E-mail</span>
                          <p className="text-white">{formData.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Detalhes do Seguro */}
                    {Object.keys(dadosProduto).length > 0 && (
                      <div className="p-4 bg-white/5 rounded-xl">
                        <h4 className="text-white/60 text-sm mb-3">Detalhes do Seguro</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          {Object.entries(dadosProduto).map(([key, value]) => {
                            const campo = camposPorProduto[produto!].find(c => c.name === key);
                            return (
                              <div key={key}>
                                <span className="text-white/50">{campo?.label || key}</span>
                                <p className="text-white">{value}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Coberturas */}
                    {coberturas.length > 0 && (
                      <div className="p-4 bg-white/5 rounded-xl">
                        <h4 className="text-white/60 text-sm mb-3">Coberturas Selecionadas</h4>
                        <div className="flex flex-wrap gap-2">
                          {coberturas.map((cobertura) => (
                            <span
                              key={cobertura}
                              className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm"
                            >
                              {cobertura}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Documentos */}
                    {arquivos.length > 0 && (
                      <div className="p-4 bg-white/5 rounded-xl">
                        <h4 className="text-white/60 text-sm mb-3">Documentos Anexados</h4>
                        <div className="space-y-2">
                          {arquivos.map((file, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <FileText className="w-4 h-4 text-white/40" />
                              <span className="text-white/80">{file.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between mt-8">
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Voltar
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={submeterCotacao.isPending}
                      className={`bg-gradient-to-r ${produtoSelecionado?.cor} text-white`}
                    >
                      {submeterCotacao.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          Enviar Cotação
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 5: Sucesso */}
          {currentStep === 5 && sucesso && (
            <motion.div
              key="step-5"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-lg mx-auto text-center"
            >
              <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${produtoSelecionado?.cor} flex items-center justify-center mx-auto mb-6`}>
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-4">
                Cotação Enviada!
              </h2>
              
              <p className="text-white/60 text-lg mb-6">
                Sua solicitação foi recebida com sucesso. Nossa equipe entrará em contato em breve.
              </p>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
                <p className="text-white/50 text-sm mb-2">Número do Protocolo</p>
                <p className="text-2xl font-mono font-bold text-amber-400">
                  {protocolo}
                </p>
                <p className="text-white/40 text-sm mt-2">
                  Guarde este número para acompanhar sua cotação
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Voltar ao Início
                </Button>
                <Button
                  onClick={() => {
                    setCurrentStep(0);
                    setProduto(null);
                    setFormData({
                      cpfCnpj: "",
                      nomeRazaoSocial: "",
                      nomeFantasia: "",
                      telefone: "",
                      whatsapp: "",
                      email: "",
                      melhorHorario: "",
                      cep: "",
                      logradouro: "",
                      numero: "",
                      complemento: "",
                      bairro: "",
                      cidade: "",
                      estado: "",
                      observacoes: "",
                    });
                    setDadosProduto({});
                    setCoberturas([]);
                    setArquivos([]);
                    setCotacaoId(null);
                    setProtocolo(null);
                    setSucesso(false);
                  }}
                  className={`bg-gradient-to-r ${produtoSelecionado?.cor} text-white`}
                >
                  Nova Cotação
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
