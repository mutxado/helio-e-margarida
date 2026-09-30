import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Send, CheckCircle2, User, Users, MessageSquare, Utensils, Heart } from 'lucide-react';
import { weddingData } from '../data/weddingData';

export function RsvpForm() {
  const [formData, setFormData] = useState({
    name: '',
    guests: '1',
    attending: 'sim',
    dietary: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);

    const rsvpPayload = {
      name: formData.name.trim(),
      guests: parseInt(formData.guests, 10) || 1,
      attending: formData.attending,
      dietary: formData.dietary.trim() || 'Nenhuma',
      message: formData.message.trim() || 'Felicidades ao casal!',
      timestamp: new Date().toLocaleString('pt-MZ')
    };

    // 1. Guardar na memória local do navegador como backup
    try {
      const existing = JSON.parse(localStorage.getItem('helio_margarida_rsvp_confirmations') || '[]');
      localStorage.setItem('helio_margarida_rsvp_confirmations', JSON.stringify([rsvpPayload, ...existing]));
    } catch (err) {
      console.log('Local storage save:', err);
    }

    // 2. Efeito de Celebração com Confetti
    try {
      confetti({
        particleCount: 130,
        spread: 85,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.log('Confetti triggered');
    }

    setIsSubmitting(false);
    setSubmitted(true);

    // 3. Montar mensagem formatada e abrir o WhatsApp
    const textMsg = `Olá Hélio e Margarida! Acabei de confirmar a minha presença no vosso casamento 🎉\n\n` +
      `*Nome:* ${rsvpPayload.name}\n` +
      `*Lugares:* ${rsvpPayload.guests}\n` +
      `*Confirmação:* ${rsvpPayload.attending === 'sim' ? 'Sim, estarei presente!' : 'Infelizmente não poderei comparecer'}\n` +
      `*Restrição Alimentar:* ${rsvpPayload.dietary}\n` +
      `*Mensagem:* ${rsvpPayload.message}`;

    const waUrl = `https://wa.me/${weddingData.couple.whatsappPhone}?text=${encodeURIComponent(textMsg)}`;

    setTimeout(() => {
      window.open(waUrl, '_blank');
    }, 1200);
  };

  return (
    <section id="rsvp" className="py-24 px-4 bg-[#F7F9F6] relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="font-script text-4xl sm:text-5xl text-[#2D6A4F] block mb-2 font-normal">
            A Sua Presença é Especial
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#1A2820] font-normal tracking-wide">
            Confirmar Presença (RSVP)
          </h2>
          <div className="w-20 h-0.5 bg-[#C5A059] mx-auto mt-4 mb-4" />
          <p className="text-sm sm:text-base text-[#4D5E54] max-w-xl mx-auto">
            Por favor, confirme a sua presença até ao dia <span className="font-bold text-[#2D6A4F]">15 de Novembro de 2026</span>.
          </p>
        </div>

        {/* Form Box */}
        <div className="glass-card-emerald rounded-3xl p-8 sm:p-14 border border-[#2D6A4F]/20 shadow-xl relative max-w-3xl mx-auto">
          {submitted ? (
            <div className="text-center py-12 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-[#2D6A4F]/15 text-[#2D6A4F] flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-serif text-3xl text-[#1A2820] font-semibold mb-3">
                Presença Confirmada com Sucesso!
              </h3>
              <p className="text-sm sm:text-base text-[#4D5E54] max-w-md mx-auto mb-8 leading-relaxed">
                Muito obrigado por celebrar este momento tão especial connosco! A sua resposta foi registada e encaminhada para o nosso WhatsApp.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-8 py-3 rounded-full bg-[#F7F9F6] border border-[#2D6A4F]/30 text-[#2D6A4F] text-xs uppercase tracking-wider font-semibold hover:bg-[#2D6A4F]/10 transition-all"
              >
                Enviar Outra Confirmação
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Name */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-[#1A2820] mb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#2D6A4F]" />
                  Nome Completo (como consta no convite) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: João da Silva"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-5 py-3.5 rounded-2xl bg-white border border-[#2D6A4F]/25 focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 outline-hidden text-sm text-[#1A2820] transition-all"
                />
              </div>

              {/* Guests and Attendance */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-[#1A2820] mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#2D6A4F]" />
                    Número de Lugares
                  </label>
                  <select
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                    className="w-full px-5 py-3.5 rounded-2xl bg-white border border-[#2D6A4F]/25 focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 outline-hidden text-sm text-[#1A2820] transition-all"
                  >
                    <option value="1">1 Pessoa (Individual)</option>
                    <option value="2">2 Pessoas (Casal)</option>
                    <option value="3">3 Pessoas (Família)</option>
                    <option value="4">4 Pessoas ou mais</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-[#1A2820] mb-2 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-[#2D6A4F]" />
                    Confirma Presença?
                  </label>
                  <select
                    value={formData.attending}
                    onChange={(e) => setFormData({ ...formData, attending: e.target.value })}
                    className="w-full px-5 py-3.5 rounded-2xl bg-white border border-[#2D6A4F]/25 focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 outline-hidden text-sm text-[#1A2820] transition-all"
                  >
                    <option value="sim">Sim, estarei presente com alegria!</option>
                    <option value="nao">Infelizmente não poderei comparecer</option>
                  </select>
                </div>
              </div>

              {/* Dietary Preferences */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-[#1A2820] mb-2 flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-[#2D6A4F]" />
                  Restrição Alimentar ou Alergia (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Sem Glúten, Vegetariano, Sem Mariscos..."
                  value={formData.dietary}
                  onChange={(e) => setFormData({ ...formData, dietary: e.target.value })}
                  className="w-full px-5 py-3.5 rounded-2xl bg-white border border-[#2D6A4F]/25 focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 outline-hidden text-sm text-[#1A2820] transition-all"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-[#1A2820] mb-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#2D6A4F]" />
                  Mensagem Carinhosa para Hélio & Margarida
                </label>
                <textarea
                  rows={3}
                  placeholder="Deixe uma bênção ou mensagem especial aos noivos..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-5 py-3.5 rounded-2xl bg-white border border-[#2D6A4F]/25 focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 outline-hidden text-sm text-[#1A2820] transition-all"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-full bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-semibold text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4 text-[#C5A059]" />
                {isSubmitting ? 'A registar...' : 'Confirmar Presença Agora'}
              </button>

            </form>
          )}
        </div>

      </div>
    </section>
  );
}
