import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Clock, RefreshCw, Trash2, X } from "lucide-react";

interface RecoverProgressModalProps {
  isOpen: boolean;
  onRecover: () => void;
  onStartNew: () => void;
  onClose: () => void;
  savedInfo: {
    timestamp: Date;
    step: number;
    produto?: string;
    timeAgo: string;
  } | null;
}

const stepNames: Record<number, string> = {
  0: "Seleção de Produto",
  1: "Identificação",
  2: "Detalhes do Produto",
  3: "Coberturas",
  4: "Revisão",
};

const produtoNames: Record<string, string> = {
  rco: "RCO - Ônibus",
  solar: "Energia Solar",
  garantia: "Seguro Garantia",
  agro: "Penhor Rural",
  engenharia: "Riscos de Engenharia",
};

export function RecoverProgressModal({
  isOpen,
  onRecover,
  onStartNew,
  onClose,
  savedInfo,
}: RecoverProgressModalProps) {
  if (!savedInfo) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="bg-gray-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="relative p-6 pb-4 border-b border-white/10">
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 text-white/40 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                    <RefreshCw className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Continuar de onde parou?
                    </h3>
                    <p className="text-white/60 text-sm">
                      Encontramos uma cotação em andamento
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="bg-white/5 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-2 text-white/60 text-sm mb-3">
                    <Clock className="w-4 h-4" />
                    <span>Salvo {savedInfo.timeAgo}</span>
                  </div>
                  
                  <div className="space-y-2">
                    {savedInfo.produto && (
                      <div className="flex justify-between">
                        <span className="text-white/60">Produto:</span>
                        <span className="text-white font-medium">
                          {produtoNames[savedInfo.produto] || savedInfo.produto}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-white/60">Etapa:</span>
                      <span className="text-white font-medium">
                        {stepNames[savedInfo.step] || `Etapa ${savedInfo.step}`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={onRecover}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-medium py-6"
                  >
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Continuar cotação
                  </Button>
                  
                  <Button
                    onClick={onStartNew}
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10 py-6"
                  >
                    <Trash2 className="w-5 h-5 mr-2" />
                    Começar nova cotação
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
