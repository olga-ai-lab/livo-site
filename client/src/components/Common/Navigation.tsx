import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { BrutalButton } from '@/components/ui/BrutalButton';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';

interface NavigationProps {
  type: 'livonius' | 'livo' | 'blog';
}

export const Navigation: React.FC<NavigationProps> = ({ type }) => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLivonius = type === 'livonius';
  const isLivo = type === 'livo';
  
  const brandColor = isLivonius ? 'text-[#056677]' : isLivo ? 'text-[#7AB72D]' : 'text-[#353E4A]';
  const hoverColor = isLivonius ? 'hover:text-[#056677]' : isLivo ? 'hover:text-[#7AB72D]' : 'hover:text-[#353E4A]';
  const buttonVariant = isLivonius ? 'teal' : isLivo ? 'lime' : 'default';

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border h-20 shadow-sm">
      <div className="container h-full flex items-center justify-between">
        {/* Logo Area */}
        <Link href="/" className="flex items-center gap-3 group" onClick={closeMobileMenu}>
          {isLivonius ? (
            <div className="w-10 h-10 bg-[#056677] rounded flex items-center justify-center transition-transform group-hover:scale-105">
              <img src="/logo-livonius-branco.svg" alt="Livonius" className="w-7 h-7 object-contain" />
            </div>
          ) : isLivo ? (
            <div className="w-10 h-10 bg-[#7AB72D] rounded flex items-center justify-center transition-transform group-hover:scale-105">
              <img src="/logo-livo-header.webp" alt="Livo MGA" className="w-8 h-8 object-contain" />
            </div>
          ) : (
            <div className="w-10 h-10 bg-[#353E4A] rounded flex items-center justify-center transition-transform group-hover:scale-105 text-white font-bold text-xl">
              G
            </div>
          )}
          <div className="flex flex-col">
            <span className={cn("font-display font-bold text-lg md:text-xl leading-none tracking-tight", brandColor)}>
              {isLivonius ? 'LIVONIUS' : isLivo ? 'LIVO' : 'GRUPO LIVONIUS'}
            </span>
            <span className="font-body text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {isLivonius ? 'MGA SEGUROS' : isLivo ? 'MGA' : 'BLOG & NEWS'}
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/livonius" className={cn("text-sm font-medium transition-colors uppercase tracking-wide", location === '/livonius' || location === '/' ? brandColor + " font-bold" : "text-foreground/60", hoverColor)}>
            Livonius
          </Link>
          <Link href="/livo" className={cn("text-sm font-medium transition-colors uppercase tracking-wide", location === '/livo' ? brandColor + " font-bold" : "text-foreground/60", hoverColor)}>
            Livo MGA
          </Link>
          <Link href="/blog" className={cn("text-sm font-medium transition-colors uppercase tracking-wide", location === '/blog' ? brandColor + " font-bold" : "text-foreground/60", hoverColor)}>
            Blog
          </Link>
          {type !== 'blog' && (
            <Link href="/sinistro-novo" className={cn("text-sm font-medium transition-colors uppercase tracking-wide", location === '/sinistro-novo' ? brandColor + " font-bold" : "text-foreground/60", hoverColor)}>
              Sinistro
            </Link>
          )}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-2">
          <Link href="/seja-parceiro">
            <BrutalButton variant={buttonVariant} size="sm">
              Seja Parceiro
            </BrutalButton>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-background border-b border-border shadow-lg">
          <div className="container py-4 space-y-3">
            <Link 
              href="/livonius" 
              className={cn("block px-4 py-2 rounded-lg transition-colors", location === '/livonius' || location === '/' ? brandColor + " bg-slate-100 font-bold" : "text-foreground/60 hover:bg-slate-50")}
              onClick={closeMobileMenu}
            >
              Livonius
            </Link>
            <Link 
              href="/livo" 
              className={cn("block px-4 py-2 rounded-lg transition-colors", location === '/livo' ? brandColor + " bg-slate-100 font-bold" : "text-foreground/60 hover:bg-slate-50")}
              onClick={closeMobileMenu}
            >
              Livo MGA
            </Link>
            <Link 
              href="/blog" 
              className={cn("block px-4 py-2 rounded-lg transition-colors", location === '/blog' ? brandColor + " bg-slate-100 font-bold" : "text-foreground/60 hover:bg-slate-50")}
              onClick={closeMobileMenu}
            >
              Blog
            </Link>
            {type !== 'blog' && (
              <Link 
                href="/sinistro-novo" 
                className={cn("block px-4 py-2 rounded-lg transition-colors", location === '/sinistro-novo' ? brandColor + " bg-slate-100 font-bold" : "text-foreground/60 hover:bg-slate-50")}
                onClick={closeMobileMenu}
              >
                Sinistro
              </Link>
            )}
            <div className="border-t border-slate-200 pt-3 space-y-2">
              <Link href="/seja-parceiro" onClick={closeMobileMenu}>
                <BrutalButton variant={buttonVariant} size="sm" className="w-full">
                  Seja Parceiro
                </BrutalButton>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
