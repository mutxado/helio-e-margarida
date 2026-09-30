import React, { useState } from 'react';
import { Send, Copy, Check, CreditCard, Sparkles } from 'lucide-react';
import { weddingData } from '../data/weddingData';

export function GiftRegistry() {
  const [copiedKey, setCopiedKey] = useState(null);
  const { intro, paymentInfo } = weddingData.gifts;

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const whatsappBlessingMessage = `Olá Hélio e Margarida! Gostaria de vos abençoar com uma contribuição para o vosso casamento e novo lar.`;
  const whatsappUrl = `https://wa.me/${weddingData.couple.whatsappPhone}?text=${encodeURIComponent(whatsappBlessingMessage)}`;

  return (
    <section id="gifts" className="py-24 px-4 bg-white relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="font-script text-4xl sm:text-5xl text-[#2D6A4F] block mb-2 font-normal">
            Com Carinho & Gratidão
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#1A2820] font-normal tracking-wide">
            Contribuição Direta
          </h2>
          <div className="w-20 h-0.5 bg-[#C5A059] mx-auto mt-4 mb-6" />
          <p className="text-sm sm:text-base text-[#4D5E54] max-w-2xl mx-auto leading-relaxed font-light">
            {intro}
          </p>
        </div>

        {/* Direct Payment Box */}
        <div className="glass-card-emerald rounded-3xl p-8 sm:p-12 border border-[#2D6A4F]/20 shadow-lg max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#2D6A4F]/10 flex items-center justify-center text-[#2D6A4F] mx-auto mb-6">
            <CreditCard className="w-8 h-8" />
          </div>

          <h3 className="font-serif text-2xl text-[#1A2820] font-semibold mb-2">
            Detalhes para Contribuição (M-Pesa & e-Mola)
          </h3>
          <p className="text-xs sm:text-sm text-[#4D5E54] mb-8 max-w-md mx-auto">
            Disponibilizamos os seguintes números para envio de qualquer contribuição:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-left">
            {[
              { label: 'M-Pesa', val: paymentInfo.mpesa, raw: '840000000', key: 'mpesa' },
              { label: 'e-Mola', val: paymentInfo.emola, raw: '860000000', key: 'emola' },
            ].map((method) => (
              <div key={method.key} className="bg-white rounded-2xl p-5 border border-[#2D6A4F]/20 flex items-center justify-between gap-3 shadow-xs hover:border-[#2D6A4F]/50 transition-colors">
                <div className="overflow-hidden">
                  <span className="text-[10px] uppercase font-bold text-[#2D6A4F] block tracking-wider">{method.label}</span>
                  <span className="text-sm font-semibold text-[#1A2820] truncate block">{method.val}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(method.val, method.key)}
                  className="px-3.5 py-2 rounded-xl bg-[#F7F9F6] hover:bg-[#2D6A4F]/10 text-[#2D6A4F] text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                  title="Copiar dados"
                >
                  {copiedKey === method.key ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>

          <div className="border-t border-[#2D6A4F]/10 pt-6">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-medium text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
            >
              <Send className="w-4 h-4 text-[#C5A059]" />
              Notificar ou Abençoar via WhatsApp
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
