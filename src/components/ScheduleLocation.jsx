import React from 'react';
import { MapPin, Clock, Navigation, Church, PartyPopper } from 'lucide-react';
import { weddingData } from '../data/weddingData';

export function ScheduleLocation() {
  return (
    <section id="schedule" className="py-24 px-4 bg-white relative overflow-hidden">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="font-script text-4xl sm:text-5xl text-[#2D6A4F] block mb-2 font-normal">
            Momento & Lugares Especiais
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#1A2820] font-normal tracking-wide">
            Programa do Grande Dia
          </h2>
          <div className="w-20 h-0.5 bg-[#C5A059] mx-auto mt-4 mb-4" />
          <p className="text-sm sm:text-base text-[#4D5E54] max-w-xl mx-auto">
            Sábado, <span className="font-bold text-[#2D6A4F]">28 de Novembro de 2026</span>. Veja os horários e itinerário da nossa celebração.
          </p>
        </div>

        {/* Events Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 mb-16">
          {weddingData.events.map((evt, idx) => {
            return (
              <div
                key={evt.id}
                className="glass-card-emerald rounded-3xl p-8 shadow-md border border-[#2D6A4F]/20 flex flex-col justify-between hover:shadow-xl transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-[#2D6A4F]/10 flex items-center justify-center text-[#2D6A4F] group-hover:scale-110 group-hover:bg-[#1B4332] group-hover:text-[#E8D7B0] transition-all">
                      {idx === 0 ? <Church className="w-7 h-7" /> : <PartyPopper className="w-7 h-7" />}
                    </div>
                    <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#1B4332] text-[#E8D7B0] font-semibold text-xs border border-[#C5A059]/40 shadow-xs">
                      <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>{evt.time}</span>
                    </div>
                  </div>

                  <h3 className="font-serif text-2xl text-[#1A2820] font-semibold mb-2">
                    {evt.title}
                  </h3>
                  
                  <h4 className="text-sm font-bold text-[#2D6A4F] mb-2 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#C5A059] shrink-0" />
                    {evt.place}
                  </h4>

                  <p className="text-xs text-[#6B7A70] mb-4 font-medium">
                    {evt.address}
                  </p>

                  <p className="text-sm text-[#4D5E54] leading-relaxed mb-6 font-light">
                    {evt.details}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#2D6A4F]/10">
                  <a
                    href={evt.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-medium text-xs uppercase tracking-wider shadow-xs transition-colors"
                  >
                    <Navigation className="w-4 h-4 text-[#C5A059]" />
                    Ver Itinerário no Google Maps
                  </a>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
