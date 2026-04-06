import React from 'react';
import { ArrowRight, Shield } from 'lucide-react';

export const BrandConnector: React.FC = () => {
  return (
    <div className="w-full p-[1px] bg-gradient-to-r from-[#7AB72D] to-[#056677]">
      <div className="bg-white dark:bg-[#0F172A] py-4 px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#056677] flex items-center justify-center text-white border-2 border-white">
            <Shield className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium text-[#64748B]">
            <strong className="text-[#353E4A]">Grupo Livonius:</strong> Tradição de mais de 130 anos + Inovação Digital
          </span>
        </div>

        <a
          href="https://livonius.com.br"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#353E4A] transition-colors hover:text-[#056677]"
        >
          Conheça a Livonius (Tradição & Transporte)
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </div>
  );
};
