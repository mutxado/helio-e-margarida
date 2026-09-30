import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, ChevronDown, Heart, Sparkles } from 'lucide-react';
import { weddingData } from '../data/weddingData';

export function Hero() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const target = new Date(weddingData.couple.targetDate).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-28 pb-16 px-4 overflow-hidden">
      
      {/* Background with Subtle Dark Botanical Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 scale-105"
        style={{ backgroundImage: `url('${weddingData.couple.heroBg}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A2E24]/75 via-[#1A2E24]/85 to-[#15241C]/95" />

      {/* Decorative Golden & Emerald Orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#2D6A4F]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#C5A059]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Content Box */}
      <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
        
        {/* Floating Blessing Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#C5A059]/40 text-[#E8D7B0] text-xs uppercase tracking-widest font-semibold mb-8 shadow-md animate-fadeIn">
          <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>Com a Bênção de Deus & das Nossas Famílias</span>
          <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
        </div>

        {/* Grand Wedding Names */}
        <h1 className="font-serif text-4xl sm:text-7xl md:text-8xl font-normal tracking-wide mb-3 leading-tight text-white drop-shadow-md">
          Hélio <span className="font-script text-5xl sm:text-8xl md:text-9xl text-[#E8D7B0] px-2 block sm:inline font-normal">&</span> Margarida
        </h1>

        <p className="text-xs sm:text-sm uppercase tracking-[0.25em] text-[#C5A059] font-semibold mb-8">
          {weddingData.couple.tagline}
        </p>

        {/* Date and Location Badges */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 text-xs sm:text-sm text-white/90 mb-10">
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 shadow-xs">
            <Calendar className="w-4 h-4 text-[#C5A059]" />
            <span className="font-medium tracking-wide">{weddingData.couple.dateText}</span>
          </div>

          <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 shadow-xs">
            <MapPin className="w-4 h-4 text-[#C5A059]" />
            <span className="font-medium tracking-wide">Maputo, Moçambique</span>
          </div>
        </div>

        {/* Circular Countdown Timer */}
        <div className="mb-12 max-w-lg mx-auto">
          <h3 className="text-xs uppercase tracking-widest text-white/70 font-semibold mb-5">
            Contagem Decrescente para o Nosso Grande Dia
          </h3>
          <div className="grid grid-cols-4 gap-3 sm:gap-5">
            {[
              { label: 'Dias', value: timeLeft.days },
              { label: 'Horas', value: timeLeft.hours },
              { label: 'Minutos', value: timeLeft.minutes },
              { label: 'Segundos', value: timeLeft.seconds },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-5 border border-white/15 shadow-lg flex flex-col items-center hover:border-[#C5A059]/60 transition-colors"
              >
                <span className="font-serif text-2xl sm:text-4xl font-bold text-[#E8D7B0]">
                  {String(item.value).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-white/80 mt-1 font-medium">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#rsvp"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#C5A059] to-[#9C7A35] hover:from-[#D4AF37] hover:to-[#B38F46] text-[#15241C] font-semibold text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all"
          >
            Confirmar Presença (RSVP)
          </a>

          <a
            href="#schedule"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/15 hover:bg-white/25 text-white font-medium text-xs sm:text-sm uppercase tracking-wider border border-white/30 backdrop-blur-md shadow-xs transition-all"
          >
            Ver Programa & Locais
          </a>
        </div>

        {/* Down indicator */}
        <div className="mt-12 flex justify-center">
          <a href="#story" className="text-[#E8D7B0] opacity-80 hover:opacity-100 transition-opacity animate-bounce">
            <ChevronDown className="w-7 h-7" />
          </a>
        </div>

      </div>
    </section>
  );
}
