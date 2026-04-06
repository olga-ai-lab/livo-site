import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAutoSave } from "@/hooks/useAutoSave";
import { AutoSaveIndicator } from "@/components/AutoSaveIndicator";
import { RecoverProgressModal } from "@/components/RecoverProgressModal";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Bus,
  Sun,
  Shield,
  Wheat,
  HardHat,
  Upload,
  FileText,
  AlertTriangle,
  User,
  Building2,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Loader2,
  CheckCircle,
  X,
} from "lucide-react";

// Tipos
type TipoPessoa = "pf" | "pj";
type Produto = "rco" | "solar" | "garantia" | "agro" | "engenharia";
type TipoDano = "material" | "corporal" | "ambos";

interface FormData {
  // Produto
  produto: Produto | "";
  
  // Identificação do segurado
  tipoPessoa: TipoPessoa | "";
  cpfCnpj: string;
  nome: string;
  email: string;
  whatsapp: string;
  
  // Dados da empresa (se PJ)
  razaoSocial: string;
  nomeFantasia: string;
  endereco: string;
  cidade: string;
  uf: string;
  
  // Dados do sinistro
  numeroApolice: string;
  dataOcorrencia: string;
  horaOcorrencia: string;
  localOcorrencia: string;
  descricaoOcorrencia: string;
  
  // Específicos RCO
  tipoDano: TipoDano | "";
  placaVeiculo: string;
  numeroLinha: string;
  nomeMotorista: string;
  cpfMotorista: string;
  
  // Vítimas (RCO)
  vitimas: Array<{
    nome: string;
    cpf: string;
    telefone: string;
    tipoLesao: string;
  }>;
  
  // Documentos
  documentos: Array<{
    tipo: string;
    arquivo: File | null;
    nome: string;
  }>;
}

const initialFormData: FormData = {
  produto: "",
  tipoPessoa: "",
  cpfCnpj: "",
  nome: "",
  email: "",
  whatsapp: "",
  razaoSocial: "",
  nomeFantasia: "",
  endereco: "",
  cidade: "",
  uf: "",
  numeroApolice: "",
  dataOcorrencia: "",
  horaOcorrencia: "",
  localOcorrencia: "",
  descricaoOcorrencia: "",
  tipoDano: "",
  placaVeiculo: "",
  numeroLinha: "",
  nomeMotorista: "",
  cpfMotorista: "",
  vitimas: [],
  documentos: [],
};

// Documentos necessários por produto e tipo de dano
const documentosPorProduto: Record<string, Array<{ tipo: string; obrigatorio: boolean; descricao: string }>> = {
  rco_material: [
    { tipo: "boletim_ocorrencia", obrigatorio: true, descricao: "Boletim de Ocorrência" },
    { tipo: "cnh_motorista", obrigatorio: true, descricao: "CNH do Motorista" },
    { tipo: "fotos_danos", obrigatorio: true, descricao: "Fotos dos Danos" },
    { tipo: "orcamentos", obrigatorio: true, descricao: "3 Orçamentos de Reparo" },
    { tipo: "nota_fiscal", obrigatorio: false, descricao: "Nota Fiscal do Bem Danificado" },
  ],
  rco_corporal: [
    { tipo: "boletim_ocorrencia", obrigatorio: true, descricao: "Boletim de Ocorrência" },
    { tipo: "cnh_motorista", obrigatorio: true, descricao: "CNH do Motorista" },
    { tipo: "laudo_medico", obrigatorio: true, descricao: "Laudo Médico / Atestado" },
    { tipo: "documentos_vitima", obrigatorio: true, descricao: "RG e CPF da Vítima" },
    { tipo: "comprovante_despesas", obrigatorio: false, descricao: "Comprovantes de Despesas Médicas" },
  ],
  rco_ambos: [
    { tipo: "boletim_ocorrencia", obrigatorio: true, descricao: "Boletim de Ocorrência" },
    { tipo: "cnh_motorista", obrigatorio: true, descricao: "CNH do Motorista" },
    { tipo: "fotos_danos", obrigatorio: true, descricao: "Fotos dos Danos Materiais" },
    { tipo: "orcamentos", obrigatorio: true, descricao: "3 Orçamentos de Reparo" },
    { tipo: "laudo_medico", obrigatorio: true, descricao: "Laudo Médico / Atestado" },
    { tipo: "documentos_vitima", obrigatorio: true, descricao: "RG e CPF da(s) Vítima(s)" },
  ],
  solar: [
    { tipo: "boletim_ocorrencia", obrigatorio: true, descricao: "Boletim de Ocorrência (se aplicável)" },
    { tipo: "fotos_danos", obrigatorio: true, descricao: "Fotos dos Equipamentos Danificados" },
    { tipo: "laudo_tecnico", obrigatorio: true, descricao: "Laudo Técnico do Sistema" },
    { tipo: "nota_fiscal_equipamentos", obrigatorio: true, descricao: "Nota Fiscal dos Equipamentos" },
    { tipo: "orcamentos", obrigatorio: true, descricao: "Orçamentos de Reparo/Substituição" },
  ],
  garantia: [
    { tipo: "contrato", obrigatorio: true, descricao: "Contrato Garantido" },
    { tipo: "notificacao_inadimplencia", obrigatorio: true, descricao: "Notificação de Inadimplência" },
    { tipo: "documentos_cobranca", obrigatorio: true, descricao: "Documentos de Cobrança" },
    { tipo: "comprovante_pagamentos", obrigatorio: false, descricao: "Comprovantes de Pagamentos Realizados" },
  ],
  agro: [
    { tipo: "boletim_ocorrencia", obrigatorio: false, descricao: "Boletim de Ocorrência (se aplicável)" },
    { tipo: "laudo_vistoria", obrigatorio: true, descricao: "Laudo de Vistoria" },
    { tipo: "fotos_danos", obrigatorio: true, descricao: "Fotos dos Danos" },
    { tipo: "nota_fiscal_produtos", obrigatorio: true, descricao: "Nota Fiscal dos Produtos/Equipamentos" },
    { tipo: "relatorio_producao", obrigatorio: false, descricao: "Relatório de Produção" },
  ],
  engenharia: [
    { tipo: "boletim_ocorrencia", obrigatorio: true, descricao: "Boletim de Ocorrência" },
    { tipo: "laudo_tecnico", obrigatorio: true, descricao: "Laudo Técnico de Engenharia" },
    { tipo: "fotos_danos", obrigatorio: true, descricao: "Fotos dos Danos" },
    { tipo: "cronograma_obra", obrigatorio: true, descricao: "Cronograma da Obra" },
    { tipo: "orcamentos", obrigatorio: true, descricao: "Orçamentos de Reparo" },
    { tipo: "art_rrt", obrigatorio: false, descricao: "ART/RRT do Responsável Técnico" },
  ],
};

// Produtos disponíveis
const produtos = [
  { id: "rco" as Produto, nome: "RCO - Ônibus", icon: Bus, marca: "livonius", cor: "teal" },
  { id: "solar" as Produto, nome: "Energia Solar", icon: Sun, marca: "livo", cor: "lime" },
  { id: "garantia" as Produto, nome: "Seguro Garantia", icon: Shield, marca: "livo", cor: "lime" },
  { id: "agro" as Produto, nome: "Penhor Rural", icon: Wheat, marca: "livo", cor: "lime" },
  { id: "engenharia" as Produto, nome: "Riscos de Engenharia", icon: HardHat, marca: "livo", cor: "lime" },
];

export default function SinistroConversacional() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [protocolo, setProtocolo] = useState("");
  const [showRecoverModal, setShowRecoverModal] = useState(false);
  
  // CNPJ lookup
  const [cnpjBuscando, setCnpjBuscando] = useState(false);
  const [cnpjEncontrado, setCnpjEncontrado] = useState(false);
  const [cnpjErro, setCnpjErro] = useState("");
  
  // Vítima atual sendo adicionada
  const [novaVitima, setNovaVitima] = useState({ nome: "", cpf: "", telefone: "", tipoLesao: "" });

  // Auto-save
  const { lastSaved, isSaving, hasUnsavedChanges, hasSavedProgress, clearProgress, loadProgress } = useAutoSave(
    { step, formData },
    step,
    {
      key: "sinistro-form",
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

  // Efeito para consultar CNPJ automaticamente quando preenchido
  useEffect(() => {
    if (formData.tipoPessoa === "pj" && step === 2) {
      const cnpjLimpo = formData.cpfCnpj.replace(/\D/g, "");
      if (cnpjLimpo.length === 14) {
        // Debounce de 500ms para nao fazer requisicoes a cada caractere
        const timer = setTimeout(() => {
          buscarCNPJ(cnpjLimpo);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [formData.cpfCnpj, formData.tipoPessoa, step]);

  // Mutation para registrar sinistro
  const registrarSinistro = trpc.sinistroNovo.abrir.useMutation({
    onSuccess: (data: { protocolo: string }) => {
      setProtocolo(data.protocolo);
      setSubmitSuccess(true);
      clearProgress();
      toast.success("Sinistro registrado com sucesso!");
    },
    onError: (error: { message?: string }) => {
      toast.error(error.message || "Erro ao registrar sinistro");
    },
  });

  // Query para consultar CNPJ
  const consultarCNPJ = trpc.utils.consultarCNPJ.useQuery(
    { cnpj: formData.cpfCnpj.replace(/\D/g, "") },
    {
      enabled: false,
      retry: false,
    }
  );

  // Cor baseada no produto
  const corProduto = formData.produto === "rco" ? "teal" : "lime";
  const bgGradient = formData.produto === "rco" 
    ? "from-teal-500 to-teal-600" 
    : "from-lime-500 to-lime-600";

  // Formatação de CPF/CNPJ
  const formatCpfCnpj = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (formData.tipoPessoa === "pf") {
      return numbers
        .slice(0, 11)
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    } else {
      return numbers
        .slice(0, 14)
        .replace(/(\d{2})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1/$2")
        .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
    }
  };

  // Formatação de WhatsApp
  const formatWhatsApp = (value: string) => {
    const numbers = value.replace(/\D/g, "").slice(0, 11);
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  };

  // Buscar CNPJ
  const buscarCNPJ = async (cnpj: string) => {
    const cnpjLimpo = cnpj.replace(/\D/g, "");
    if (cnpjLimpo.length !== 14) return;

    setCnpjBuscando(true);
    setCnpjErro("");
    setCnpjEncontrado(false);

    try {
      const response = await fetch(`/api/trpc/utils.consultarCNPJ?input=${encodeURIComponent(JSON.stringify({ cnpj: cnpjLimpo }))}`);
      const result = await response.json();
      
      if (result.result?.data) {
        const dados = result.result.data;
        setFormData(prev => ({
          ...prev,
          razaoSocial: dados.razaoSocial || "",
          nomeFantasia: dados.nomeFantasia || "",
          endereco: dados.endereco || "",
          cidade: dados.cidade || "",
          uf: dados.uf || "",
        }));
        setCnpjEncontrado(true);
      } else {
        setCnpjErro("CNPJ não encontrado");
      }
    } catch (error) {
      setCnpjErro("Erro ao buscar CNPJ");
    } finally {
      setCnpjBuscando(false);
    }
  };

  // Handler de input
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Adicionar vítima
  const adicionarVitima = () => {
    if (novaVitima.nome && novaVitima.cpf) {
      setFormData(prev => ({
        ...prev,
        vitimas: [...prev.vitimas, novaVitima],
      }));
      setNovaVitima({ nome: "", cpf: "", telefone: "", tipoLesao: "" });
    }
  };

  // Remover vítima
  const removerVitima = (index: number) => {
    setFormData(prev => ({
      ...prev,
      vitimas: prev.vitimas.filter((_, i) => i !== index),
    }));
  };

  // Obter documentos necessários
  const getDocumentosNecessarios = () => {
    if (formData.produto === "rco") {
      const tipoDano = formData.tipoDano || "material";
      return documentosPorProduto[`rco_${tipoDano}`] || documentosPorProduto.rco_material;
    }
    return documentosPorProduto[formData.produto] || [];
  };

  // Validação por step
  const canProceed = () => {
    switch (step) {
      case 0: return !!formData.produto;
      case 1: return !!formData.tipoPessoa;
      case 2: {
        const cpfCnpjLimpo = formData.cpfCnpj.replace(/\D/g, "");
        const tamanhoEsperado = formData.tipoPessoa === "pf" ? 11 : 14;
        return cpfCnpjLimpo.length === tamanhoEsperado && formData.nome && formData.email && formData.whatsapp;
      }
      case 3: return formData.numeroApolice && formData.dataOcorrencia && formData.localOcorrencia && formData.descricaoOcorrencia;
      case 4: {
        if (formData.produto === "rco") {
          return !!formData.tipoDano && formData.placaVeiculo && formData.nomeMotorista;
        }
        return true;
      }
      case 5: {
        const docsObrigatorios = getDocumentosNecessarios().filter(d => d.obrigatorio);
        const docsEnviados = formData.documentos.filter(d => d.arquivo);
        return docsEnviados.length >= docsObrigatorios.length;
      }
      default: return true;
    }
  };

  // Submeter formulário
  const handleSubmit = async () => {
    if (!canProceed()) return;



    const marca = formData.produto === "rco" ? "livonius" : "livo";
    const tipoSinistro = formData.produto === "rco" ? (formData.tipoDano || "material") : formData.produto;
    const nomeRazaoSocial = formData.tipoPessoa === "pj" ? formData.razaoSocial : formData.nome;

    registrarSinistro.mutate({
      marca,
      produto: formData.produto as Produto,
      tipoSinistro,
      tipoPessoa: formData.tipoPessoa as TipoPessoa,
      cpfCnpj: formData.cpfCnpj,
      nomeRazaoSocial,
      telefone: formData.whatsapp || formData.email,
      email: formData.email,
      numeroApolice: formData.numeroApolice,
      dataOcorrencia: formData.dataOcorrencia,
      horaOcorrencia: formData.horaOcorrencia,
      localOcorrencia: formData.localOcorrencia,
      descricaoOcorrencia: formData.descricaoOcorrencia,
      placaVeiculo: formData.placaVeiculo,
      nomeCondutor: formData.nomeMotorista,
      cnhCondutor: formData.cpfMotorista,
      dadosSinistro: {
        tipoDano: formData.tipoDano,
        numeroLinha: formData.numeroLinha,
        vitimas: formData.vitimas,
      },
    });
  };

  // Recuperar progresso
  const handleRecover = () => {
    const saved = loadProgress();
    if (saved && 'formData' in saved) {
      setStep(saved.step);
      setFormData((saved as any).formData);
    }
    setShowRecoverModal(false);
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <div className="mb-6 flex justify-center">
            <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${bgGradient} flex items-center justify-center`}>
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Sinistro Registrado!</h2>
          <p className="text-slate-600 mb-6">Seu protocolo de sinistro foi gerado com sucesso.</p>
          <div className="bg-slate-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-slate-600 mb-1">Protocolo:</p>
            <p className="text-xl font-mono font-bold text-slate-900">{protocolo}</p>
          </div>
          <p className="text-sm text-slate-600 mb-6">
            Guarde este protocolo para acompanhar seu sinistro. Você receberá um e-mail de confirmação em breve.
          </p>
          <Link href="/">
            <Button className="w-full bg-slate-900 hover:bg-slate-800">
              Voltar para Home
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="container max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <AutoSaveIndicator lastSaved={lastSaved} isSaving={isSaving} hasUnsavedChanges={hasUnsavedChanges} />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="container max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">Etapa {step + 1} de 6</span>
            <span className="text-sm text-slate-500">{Math.round(((step + 1) / 6) * 100)}%</span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${bgGradient}`}
              initial={{ width: 0 }}
              animate={{ width: `${((step + 1) / 6) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-2xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Step 0: Selecionar Produto */}
            {step === 0 && (
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Qual produto você precisa?</h1>
                <p className="text-slate-600 mb-8">Selecione o tipo de sinistro que deseja abrir</p>
                <div className="grid grid-cols-1 gap-3">
                  {produtos.map((produto) => {
                    const Icon = produto.icon;
                    return (
                      <motion.button
                        key={produto.id}
                        onClick={() => {
                          setFormData(prev => ({ ...prev, produto: produto.id }));
                          setStep(1);
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="p-4 border-2 border-slate-200 rounded-xl hover:border-slate-400 hover:bg-slate-50 transition-all text-left flex items-center gap-4"
                      >
                        <div className={`p-3 rounded-lg bg-gradient-to-br ${produto.cor === 'teal' ? 'from-teal-500 to-teal-600' : 'from-lime-500 to-lime-600'}`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{produto.nome}</p>
                          <p className="text-sm text-slate-600">{produto.marca === 'livonius' ? 'Livonius MGA' : 'Livo MGA'}</p>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 1: Tipo de Pessoa */}
            {step === 1 && (
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Quem está abrindo o sinistro?</h1>
                <p className="text-slate-600 mb-8">Selecione o tipo de pessoa</p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: "pf", label: "Pessoa Física", icon: User },
                    { id: "pj", label: "Pessoa Jurídica", icon: Building2 },
                  ].map((tipo) => {
                    const Icon = tipo.icon;
                    return (
                      <motion.button
                        key={tipo.id}
                        onClick={() => {
                          setFormData(prev => ({ ...prev, tipoPessoa: tipo.id as TipoPessoa }));
                          setStep(2);
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-6 border-2 border-slate-200 rounded-xl hover:border-slate-400 hover:bg-slate-50 transition-all flex flex-col items-center gap-3"
                      >
                        <Icon className="w-8 h-8 text-slate-600" />
                        <p className="font-semibold text-slate-900">{tipo.label}</p>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2: Identificação */}
            {step === 2 && (
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Seus dados</h1>
                <p className="text-slate-600 mb-8">Preencha as informações de identificação</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {formData.tipoPessoa === "pf" ? "CPF" : "CNPJ"}
                    </label>
                    <input
                      type="text"
                      value={formatCpfCnpj(formData.cpfCnpj)}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        setFormData(prev => ({ ...prev, cpfCnpj: value }));
                        
                        if (formData.tipoPessoa === "pj" && value.length === 14) {
                          buscarCNPJ(value);
                        }
                      }}
                      placeholder={formData.tipoPessoa === "pf" ? "000.000.000-00" : "00.000.000/0000-00"}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                    />
                    {cnpjBuscando && <p className="text-sm text-slate-500 mt-2">Buscando dados...</p>}
                    {cnpjEncontrado && <p className="text-sm text-green-600 mt-2">✓ Dados encontrados</p>}
                    {cnpjErro && <p className="text-sm text-red-600 mt-2">{cnpjErro}</p>}
                  </div>

                  {formData.tipoPessoa === "pj" && cnpjEncontrado && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Razão Social</label>
                        <input
                          type="text"
                          value={formData.razaoSocial}
                          disabled
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Nome Fantasia</label>
                        <input
                          type="text"
                          value={formData.nomeFantasia}
                          disabled
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-600"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Nome Completo</label>
                    <input
                      type="text"
                      value={formData.nome}
                      onChange={(e) => handleInputChange("nome", e.target.value)}
                      placeholder="Seu nome"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">E-mail</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="seu@email.com"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">WhatsApp</label>
                    <input
                      type="tel"
                      value={formatWhatsApp(formData.whatsapp)}
                      onChange={(e) => handleInputChange("whatsapp", e.target.value)}
                      placeholder="(00) 00000-0000"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Dados do Sinistro */}
            {step === 3 && (
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Informações do sinistro</h1>
                <p className="text-slate-600 mb-8">Descreva o que aconteceu</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Número da Apólice</label>
                    <input
                      type="text"
                      value={formData.numeroApolice}
                      onChange={(e) => handleInputChange("numeroApolice", e.target.value)}
                      placeholder="Ex: 123456789"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Data</label>
                      <input
                        type="date"
                        value={formData.dataOcorrencia}
                        onChange={(e) => handleInputChange("dataOcorrencia", e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Hora</label>
                      <input
                        type="time"
                        value={formData.horaOcorrencia}
                        onChange={(e) => handleInputChange("horaOcorrencia", e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Local</label>
                    <input
                      type="text"
                      value={formData.localOcorrencia}
                      onChange={(e) => handleInputChange("localOcorrencia", e.target.value)}
                      placeholder="Cidade, rua, referência"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Descrição</label>
                    <textarea
                      value={formData.descricaoOcorrencia}
                      onChange={(e) => handleInputChange("descricaoOcorrencia", e.target.value)}
                      placeholder="Descreva detalhadamente o que aconteceu"
                      rows={4}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Dados Específicos */}
            {step === 4 && (
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  {formData.produto === "rco" ? "Dados do Sinistro RCO" : "Informações Adicionais"}
                </h1>
                <p className="text-slate-600 mb-8">Preencha os detalhes específicos</p>
                <div className="space-y-4">
                  {formData.produto === "rco" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Tipo de Dano</label>
                        <select
                          value={formData.tipoDano}
                          onChange={(e) => handleInputChange("tipoDano", e.target.value)}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                        >
                          <option value="">Selecione...</option>
                          <option value="material">Material</option>
                          <option value="corporal">Corporal</option>
                          <option value="ambos">Material e Corporal</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Placa do Veículo</label>
                        <input
                          type="text"
                          value={formData.placaVeiculo}
                          onChange={(e) => handleInputChange("placaVeiculo", e.target.value.toUpperCase())}
                          placeholder="ABC-1234"
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Número da Linha</label>
                        <input
                          type="text"
                          value={formData.numeroLinha}
                          onChange={(e) => handleInputChange("numeroLinha", e.target.value)}
                          placeholder="Ex: 123"
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Nome do Motorista</label>
                        <input
                          type="text"
                          value={formData.nomeMotorista}
                          onChange={(e) => handleInputChange("nomeMotorista", e.target.value)}
                          placeholder="Nome completo"
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">CPF do Motorista</label>
                        <input
                          type="text"
                          value={formData.cpfMotorista}
                          onChange={(e) => handleInputChange("cpfMotorista", e.target.value)}
                          placeholder="000.000.000-00"
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                        />
                      </div>

                      {(formData.tipoDano === "corporal" || formData.tipoDano === "ambos") && (
                        <div className="border-t pt-6">
                          <h3 className="font-semibold text-slate-900 mb-4">Vítimas</h3>
                          <div className="space-y-3 mb-4">
                            {formData.vitimas.map((vitima, idx) => (
                              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                <div>
                                  <p className="font-medium text-slate-900">{vitima.nome}</p>
                                  <p className="text-sm text-slate-600">{vitima.tipoLesao}</p>
                                </div>
                                <button
                                  onClick={() => removerVitima(idx)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <X className="w-5 h-5" />
                                </button>
                              </div>
                            ))}
                          </div>
                          <div className="space-y-3 p-4 bg-slate-50 rounded-lg">
                            <input
                              type="text"
                              value={novaVitima.nome}
                              onChange={(e) => setNovaVitima(prev => ({ ...prev, nome: e.target.value }))}
                              placeholder="Nome da vítima"
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                            />
                            <input
                              type="text"
                              value={novaVitima.cpf}
                              onChange={(e) => setNovaVitima(prev => ({ ...prev, cpf: e.target.value }))}
                              placeholder="CPF"
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                            />
                            <input
                              type="text"
                              value={novaVitima.tipoLesao}
                              onChange={(e) => setNovaVitima(prev => ({ ...prev, tipoLesao: e.target.value }))}
                              placeholder="Tipo de lesão"
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                            />
                            <Button
                              onClick={adicionarVitima}
                              className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                              size="sm"
                            >
                              Adicionar Vítima
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Step 5: Documentos */}
            {step === 5 && (
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Documentos</h1>
                <p className="text-slate-600 mb-8">Envie os documentos necessários</p>
                <div className="space-y-4">
                  {getDocumentosNecessarios().map((doc) => (
                    <div key={doc.tipo} className="p-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-slate-400 transition-colors">
                      <div className="flex items-center gap-3 mb-2">
                        <Upload className="w-5 h-5 text-slate-600" />
                        <div>
                          <p className="font-medium text-slate-900">{doc.descricao}</p>
                          {!doc.obrigatorio && <p className="text-xs text-slate-500">Opcional</p>}
                        </div>
                      </div>
                      <input
                        type="file"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            const file = e.target.files[0];
                            setFormData(prev => ({
                              ...prev,
                              documentos: [
                                ...prev.documentos.filter(d => d.tipo !== doc.tipo),
                                { tipo: doc.tipo, arquivo: file, nome: file.name }
                              ]
                            }));
                          }
                        }}
                        className="w-full text-sm text-slate-600"
                      />
                      {formData.documentos.find(d => d.tipo === doc.tipo) && (
                        <p className="text-sm text-green-600 mt-2">✓ {formData.documentos.find(d => d.tipo === doc.tipo)?.nome}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-12">
          {step > 0 && (
            <Button
              onClick={() => setStep(step - 1)}
              variant="outline"
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          )}
          {step < 5 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className={`flex-1 ${formData.produto === "rco" ? "bg-teal-600 hover:bg-teal-700" : "bg-lime-600 hover:bg-lime-700"}`}
            >
              Próximo
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed() || registrarSinistro.isPending}
              className={`flex-1 ${formData.produto === "rco" ? "bg-teal-600 hover:bg-teal-700" : "bg-lime-600 hover:bg-lime-700"}`}
            >
              {registrarSinistro.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Enviar Sinistro
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Recover Modal */}
      <RecoverProgressModal
        isOpen={showRecoverModal}
        onRecover={handleRecover}
        onStartNew={() => {
          clearProgress();
          setShowRecoverModal(false);
          setStep(0);
          setFormData(initialFormData);
        }}
        onClose={() => setShowRecoverModal(false)}
        savedInfo={hasSavedProgress() ? {
          timestamp: lastSaved || new Date(),
          step,
          produto: formData.produto || undefined,
          timeAgo: lastSaved ? `há ${Math.round((Date.now() - lastSaved.getTime()) / 60000)} minutos` : 'agora',
        } : null}
      />
    </div>
  );
}
