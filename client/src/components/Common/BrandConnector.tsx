import React from 'react';
import { ArrowRight, Shield, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BrandConnectorProps {
  currentBrand: 'livonius' | 'livo';
}

export const BrandConnector: React.FC<BrandConnectorProps> = ({ currentBrand }) => {
  const isLivonius = currentBrand === 'livonius';
  
  return (
    <div className={cn("w-full p-[1px]", isLivonius ? "bg-gradient-to-r from-[#056677] to-[#7AB72D]" : "bg-gradient-to-r from-[#7AB72D] to-[#056677]")}>
      <div className="bg-white dark:bg-[#0F172A] py-4 px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full bg-[#056677] flex items-center justify-center text-white text-xs font-bold border-2 border-white z-10">
              <Shield className="w-4 h-4" />
            </div>
            <div className="w-8 h-8 rounded-full bg-[#7AB72D] flex items-center justify-center text-white text-xs font-bold border-2 border-white">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <span className="text-sm font-medium text-[#64748B]">
            <strong className="text-[#353E4A]">Grupo Livonius:</strong> Tradição de mais de 130 anos + Inovação Digital
          </span>
        </div>
        
        <a 
          href={isLivonius ? '/livo' : '/livonius'}
          className={cn("group flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#353E4A] transition-colors", isLivonius ? "hover:text-[#7AB72D]" : "hover:text-[#056677]")}
        >
          {isLivonius ? 'Conheça a Livo MGA (Tech & Agro)' : 'Conheça a Livonius (Tradição & Transporte)'}
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </div>
  );
};
