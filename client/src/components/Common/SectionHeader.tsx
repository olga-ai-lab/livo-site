import React from 'react';
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  subtitle: string;
  title: React.ReactNode;
  description?: string;
  align?: 'left' | 'center';
  color?: 'teal' | 'azure' | 'charcoal' | 'lime';
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  subtitle,
  title,
  description,
  align = 'left',
  color = 'teal',
  className
}) => {
  const colorMap = {
    teal: 'bg-[#056677] text-[#056677]',
    azure: 'bg-[#0284C7] text-[#0284C7]',
    charcoal: 'bg-[#353E4A] text-[#353E4A]',
    lime: 'bg-[#7AB72D] text-[#7AB72D]',
  };

  const textColorMap = {
    teal: 'text-[#056677]',
    azure: 'text-[#0284C7]',
    charcoal: 'text-[#353E4A]',
    lime: 'text-[#7AB72D]',
  };

  return (
    <div className={cn(
      "mb-16",
      align === 'center' ? 'text-center flex flex-col items-center' : 'text-left',
      className
    )}>
      <div className="flex items-center gap-3 mb-6">
        <div className={cn("h-[2px] w-12", colorMap[color].split(' ')[0])} />
        <span className={cn(
          "text-xs font-bold uppercase tracking-[0.2em]",
          textColorMap[color]
        )}>
          {subtitle}
        </span>
        {align === 'center' && (
          <div className={cn("h-[2px] w-12", colorMap[color].split(' ')[0])} />
        )}
      </div>
      
      <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] mb-6">
        {title}
      </h2>
      
      {description && (
        <p className={cn(
          "text-lg text-muted-foreground font-light leading-relaxed max-w-2xl",
          align === 'center' ? 'mx-auto' : ''
        )}>
          {description}
        </p>
      )}
    </div>
  );
};
