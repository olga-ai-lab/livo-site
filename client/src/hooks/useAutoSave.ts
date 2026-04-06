import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

interface AutoSaveOptions {
  key: string;
  debounceMs?: number;
  onRestore?: (data: unknown) => void;
}

interface AutoSaveState {
  lastSaved: Date | null;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
}

interface SavedProgress<T> {
  data: T;
  timestamp: number;
  step: number;
  produto?: string;
  version: string;
}

const AUTOSAVE_VERSION = '1.0';

export function useAutoSave<T extends object>(
  data: T,
  step: number,
  options: AutoSaveOptions
) {
  const { key, debounceMs = 1000 } = options;
  const [state, setState] = useState<AutoSaveState>({
    lastSaved: null,
    isSaving: false,
    hasUnsavedChanges: false,
  });
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedDataRef = useRef<string>('');

  // Memoizar os dados para evitar mudanças desnecessárias
  const memoizedData = useMemo(() => JSON.stringify(data), [data]);
  const memoizedStep = useMemo(() => step, [step]);

  // Salvar progresso no localStorage
  const saveProgress = useCallback((dataToSave: T, currentStep: number, produto?: string) => {
    try {
      const progress: SavedProgress<T> = {
        data: dataToSave,
        timestamp: Date.now(),
        step: currentStep,
        produto,
        version: AUTOSAVE_VERSION,
      };
      
      const serialized = JSON.stringify(progress);
      
      // Só salva se os dados mudaram
      if (serialized !== lastSavedDataRef.current) {
        localStorage.setItem(key, serialized);
        lastSavedDataRef.current = serialized;
        
        setState(prev => ({
          ...prev,
          lastSaved: new Date(),
          isSaving: false,
          hasUnsavedChanges: false,
        }));
      } else {
        setState(prev => ({ ...prev, isSaving: false }));
      }
    } catch (error) {
      console.error('[AutoSave] Erro ao salvar:', error);
      setState(prev => ({ ...prev, isSaving: false }));
    }
  }, [key]);

  // Carregar progresso do localStorage
  const loadProgress = useCallback((): SavedProgress<T> | null => {
    try {
      const saved = localStorage.getItem(key);
      if (!saved) return null;
      
      const progress = JSON.parse(saved) as SavedProgress<T>;
      
      // Verificar versão
      if (progress.version !== AUTOSAVE_VERSION) {
        console.log('[AutoSave] Versão incompatível, descartando progresso salvo');
        localStorage.removeItem(key);
        return null;
      }
      
      // Verificar se não expirou (7 dias)
      const maxAge = 7 * 24 * 60 * 60 * 1000;
      if (Date.now() - progress.timestamp > maxAge) {
        console.log('[AutoSave] Progresso expirado, descartando');
        localStorage.removeItem(key);
        return null;
      }
      
      return progress;
    } catch (error) {
      console.error('[AutoSave] Erro ao carregar:', error);
      return null;
    }
  }, [key]);

  // Limpar progresso salvo
  const clearProgress = useCallback(() => {
    try {
      localStorage.removeItem(key);
      lastSavedDataRef.current = '';
      setState({
        lastSaved: null,
        isSaving: false,
        hasUnsavedChanges: false,
      });
    } catch (error) {
      console.error('[AutoSave] Erro ao limpar:', error);
    }
  }, [key]);

  // Verificar se há progresso salvo
  const hasSavedProgress = useCallback((): boolean => {
    return loadProgress() !== null;
  }, [loadProgress]);

  // Obter informações do progresso salvo
  const getSavedProgressInfo = useCallback(() => {
    const progress = loadProgress();
    if (!progress) return null;
    
    return {
      timestamp: new Date(progress.timestamp),
      step: progress.step,
      produto: progress.produto,
      timeAgo: getTimeAgo(progress.timestamp),
    };
  }, [loadProgress]);

  // Auto-save com debounce quando os dados mudam
  // Usar memoizedData para evitar re-renders infinitos
  useEffect(() => {
    // Marcar como tendo mudanças não salvas
    setState(prev => ({ ...prev, hasUnsavedChanges: true }));
    
    // Limpar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Agendar novo salvamento
    timeoutRef.current = setTimeout(() => {
      setState(prev => ({ ...prev, isSaving: true }));
      
      // Extrair produto dos dados se disponível
      const produto = (data as Record<string, unknown>).produto as string | undefined;
      saveProgress(data, step, produto);
    }, debounceMs);
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [memoizedData, memoizedStep, debounceMs, saveProgress, data, step]);

  // Salvar imediatamente (sem debounce)
  const saveNow = useCallback((produto?: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setState(prev => ({ ...prev, isSaving: true }));
    saveProgress(data, step, produto);
  }, [data, step, saveProgress]);

  return {
    ...state,
    saveNow,
    loadProgress,
    clearProgress,
    hasSavedProgress,
    getSavedProgressInfo,
  };
}

// Função auxiliar para formatar tempo relativo
function getTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  
  if (seconds < 60) return 'agora mesmo';
  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `há ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
  }
  if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    return `há ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  }
  const days = Math.floor(seconds / 86400);
  return `há ${days} ${days === 1 ? 'dia' : 'dias'}`;
}

export type { SavedProgress, AutoSaveState };
