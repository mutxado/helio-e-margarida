import React from 'react';
import { Heart, ArrowUp, Lock, Sparkles } from 'lucide-react';
import { weddingData } from '../data/weddingData';

export function Footer({ onOpenAdmin }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#122018] text-[#F7F9F6] py-20 px-4 relative overflow-hidden border-t border-[#C5A059]/20">
      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-28 bg-[#2D6A4F]/20 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        
        {/* Monogram Brand */}
        <h2 className="font-serif text-3xl sm:text-4xl text-[#E8D7B0] tracking-widest uppercase mb-2">
          Margarida <span className="font-script text-4xl sm:text-5xl text-[#C5A059] lowercase px-1">&</span> Hélio
        </h2>
        
        <p className="text-xs uppercase tracking-[0.25em] text-[#A3B8AC] font-medium mb-6">
          {weddingData.couple.hashtag} · 28 DE NOVEMBRO DE 2026
        </p>

        <div className="w-16 h-0.5 bg-[#C5A059]/50 mx-auto mb-8" />

        <p className="font-cormorant italic text-base sm:text-lg text-[#D0DDD5] max-w-md mx-auto mb-10 leading-relaxed font-light">
          "O amor é paciente, o amor é bondoso. Não inveja, não se vangloria, não se orgulha. Tudo sofre, tudo crê, tudo espera, tudo suporta."
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-xs text-[#E8D7B0] border border-[#C5A059]/30 transition-all uppercase tracking-wider cursor-pointer"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            Voltar ao Topo
          </button>

          <button
            onClick={onOpenAdmin}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#2D6A4F]/30 hover:bg-[#2D6A4F]/50 text-xs text-[#E8D7B0] border border-[#C5A059]/40 transition-all uppercase tracking-wider cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            Painel Privado dos Noivos
          </button>
        </div>

        <div className="text-xs text-[#8A9C91] border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-light">
          <span>&copy; 2026 Margarida Alfredo Guilima & Hélio Nhamposse. Todos os direitos reservados.</span>
          <span className="flex items-center gap-1.5">
            Feito com <Heart className="w-3.5 h-3.5 text-[#C5A059] fill-[#C5A059]" /> para o nosso casamento
          </span>
        </div>

      </div>
    </footer>
  );
}
