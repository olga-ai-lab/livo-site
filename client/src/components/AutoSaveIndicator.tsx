import { motion, AnimatePresence } from "framer-motion";
import { Cloud, CloudOff, Check, Loader2 } from "lucide-react";

interface AutoSaveIndicatorProps {
  isSaving: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AutoSaveIndicator({
  isSaving,
  lastSaved,
  hasUnsavedChanges,
}: AutoSaveIndicatorProps) {
  return (
    <AnimatePresence mode="wait">
      {isSaving ? (
        <motion.div
          key="saving"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="flex items-center gap-2 text-amber-400 text-sm"
        >
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Salvando...</span>
        </motion.div>
      ) : lastSaved ? (
        <motion.div
          key="saved"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="flex items-center gap-2 text-green-400 text-sm"
        >
          <Cloud className="w-4 h-4" />
          <span>Salvo às {formatTime(lastSaved)}</span>
        </motion.div>
      ) : hasUnsavedChanges ? (
        <motion.div
          key="unsaved"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="flex items-center gap-2 text-white/40 text-sm"
        >
          <CloudOff className="w-4 h-4" />
          <span>Não salvo</span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
