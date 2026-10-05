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
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-28 sm:pt-36 pb-16 px-4 sm:px-6 lg:px-8 bg-[#0B1510] overflow-hidden">
      
      {/* Ambient Botanical & Light Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 blur-xl scale-110"
        style={{ backgroundImage: `url('${weddingData.couple.heroBg}')` }}
      />
      <div className="absolute inset-0 bg-radial from-[#1A3828]/70 via-[#0E1A14]/90 to-[#080E0B]" />

      {/* Decorative Golden & Emerald Orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#2D6A4F]/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#C5A059]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Hero Container */}
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Text & Action Column */}
          <div className="lg:col-span-7 text-center lg:text-left text-white order-2 lg:order-1">
            
            {/* Floating Blessing & Family Invitation Header */}
            <div className="space-y-3 mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#C5A059]/40 text-[#E8D7B0] text-[11px] sm:text-xs uppercase tracking-widest font-semibold shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Com a Bênção de Deus</span>
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              </div>

              <p className="font-cormorant italic text-lg sm:text-2xl text-[#E8D7B0] font-normal tracking-wide max-w-xl">
                A família Guilima e Nhamposse tem a honra de convidar para a celebração do matrimónio dos seus filhos
              </p>
            </div>

            {/* Grand Names */}
            <h1 className="font-serif text-4xl sm:text-6xl xl:text-7xl font-normal tracking-wide mb-3 leading-tight text-white drop-shadow-md">
              Hélio <span className="font-script text-5xl sm:text-7xl xl:text-8xl text-[#E8D7B0] px-1 font-normal">&</span> Margarida
            </h1>

            <p className="text-xs sm:text-sm uppercase tracking-[0.25em] text-[#C5A059] font-semibold mb-6">
              {weddingData.couple.tagline}
            </p>

            {/* Date and Location Badges */}
            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-3 text-xs sm:text-sm text-white/90 mb-8">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 shadow-xs">
                <Calendar className="w-4 h-4 text-[#C5A059]" />
                <span className="font-medium tracking-wide">{weddingData.couple.dateText}</span>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 shadow-xs">
                <MapPin className="w-4 h-4 text-[#C5A059]" />
                <span className="font-medium tracking-wide">Maputo, Moçambique</span>
              </div>
            </div>

            {/* Circular Countdown Timer */}
            <div className="mb-8 max-w-lg mx-auto lg:mx-0">
              <h3 className="text-[11px] uppercase tracking-widest text-white/70 font-semibold mb-4">
                Contagem Decrescente para o Nosso Grande Dia
              </h3>
              <div className="grid grid-cols-4 gap-2.5 sm:gap-4">
                {[
                  { label: 'Dias', value: timeLeft.days },
                  { label: 'Horas', value: timeLeft.hours },
                  { label: 'Minutos', value: timeLeft.minutes },
                  { label: 'Segundos', value: timeLeft.seconds },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-md rounded-2xl p-2.5 sm:p-4 border border-white/15 shadow-lg flex flex-col items-center hover:border-[#C5A059]/60 transition-colors"
                  >
                    <span className="font-serif text-2xl sm:text-3xl font-bold text-[#E8D7B0]">
                      {String(item.value).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-white/80 mt-0.5 font-medium">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <a
                href="#rsvp"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#C5A059] to-[#9C7A35] hover:from-[#D4AF37] hover:to-[#B38F46] text-[#0E1A14] font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all text-center"
              >
                Confirmar Presença (RSVP)
              </a>

              <a
                href="#schedule"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-xs uppercase tracking-wider border border-white/25 backdrop-blur-md shadow-xs transition-all text-center"
              >
                Ver Programa & Locais
              </a>
            </div>

          </div>

          {/* Arched Royal Portrait Frame (100% Uncut Heads & Outfits) */}
          <div className="lg:col-span-5 flex justify-center order-1 lg:order-2">
            <div className="relative group max-w-sm sm:max-w-md w-full">
              {/* Golden Ambient Halo */}
              <div className="absolute -inset-2 rounded-t-[180px] rounded-b-[40px] bg-gradient-to-b from-[#C5A059]/40 via-[#2D6A4F]/20 to-transparent blur-lg group-hover:from-[#C5A059]/60 transition-all duration-700" />
              
              {/* Main Photo Frame */}
              <div className="relative rounded-t-[170px] rounded-b-[36px] overflow-hidden border-4 border-[#C5A059]/60 shadow-2xl bg-[#13251C] aspect-[3/4] sm:aspect-[2/3]">
                <img
                  src={weddingData.couple.heroBg}
                  alt="Hélio Nhamposse & Margarida Alfredo Guilima"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />

                {/* Bottom Frame Badge */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#0B1510] via-[#0B1510]/80 to-transparent pt-10 pb-4 px-6 text-center">
                  <span className="font-serif text-sm sm:text-base font-medium text-[#E8D7B0] tracking-wide block">
                    Hélio Nhamposse & Margarida Guilima
                  </span>
                  <span className="text-[10px] text-[#C5A059] uppercase tracking-widest font-semibold">
                    28 de Novembro de 2026
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Down indicator */}
        <div className="mt-8 lg:mt-12 flex justify-center">
          <a href="#story" className="text-[#E8D7B0] opacity-80 hover:opacity-100 transition-opacity animate-bounce">
            <ChevronDown className="w-6 h-6" />
          </a>
        </div>

      </div>
    </section>
  );
}
