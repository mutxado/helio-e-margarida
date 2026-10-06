import React from 'react';
import { Quote, Heart } from 'lucide-react';
import { weddingData } from '../data/weddingData';

export function Couple() {
  const { groom, bride } = weddingData.couple;

  return (
    <section id="couple" className="py-24 px-4 bg-[#F7F9F6] relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-20">
          <span className="font-script text-4xl sm:text-5xl text-[#2D6A4F] block mb-2 font-normal">
            Dois Corações, Um Só Destino
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#1A2820] font-normal tracking-wide">
            Os Noivos
          </h2>
          <div className="w-20 h-0.5 bg-[#C5A059] mx-auto mt-4" />
        </div>

        {/* Bride & Groom Cards (Bride First) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 items-stretch">
          
          {/* Bride Card */}
          <div className="glass-card-emerald rounded-3xl p-8 sm:p-10 shadow-lg border border-[#2D6A4F]/20 flex flex-col items-center text-center hover:shadow-xl transition-all duration-300 group">
            <div className="relative w-60 h-80 sm:w-64 sm:h-84 rounded-[40px] overflow-hidden mb-8 shadow-xl border-4 border-white group-hover:scale-105 transition-transform duration-500 bg-stone-100">
              <img
                src={bride.image}
                alt={bride.fullName}
                className="w-full h-full object-cover object-top"
              />
            </div>
            
            <span className="text-xs uppercase tracking-widest font-bold text-[#2D6A4F] mb-1">
              {bride.role}
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#1A2820] font-semibold mb-4">
              {bride.fullName}
            </h3>
            <p className="text-sm sm:text-base text-[#4D5E54] leading-relaxed mb-8 flex-grow font-light">
              {bride.bio}
            </p>

            <div className="bg-[#2D6A4F]/10 rounded-2xl p-5 w-full relative border border-[#2D6A4F]/20">
              <Quote className="w-5 h-5 text-[#C5A059] absolute top-2 left-3 opacity-60" />
              <p className="font-cormorant italic text-base text-[#1A2820] px-4 font-medium">
                "{bride.quote}"
              </p>
            </div>
          </div>

          {/* Groom Card */}
          <div className="glass-card-emerald rounded-3xl p-8 sm:p-10 shadow-lg border border-[#2D6A4F]/20 flex flex-col items-center text-center hover:shadow-xl transition-all duration-300 group">
            <div className="relative w-60 h-80 sm:w-64 sm:h-84 rounded-[40px] overflow-hidden mb-8 shadow-xl border-4 border-white group-hover:scale-105 transition-transform duration-500 bg-stone-100">
              <img
                src={groom.image}
                alt={groom.fullName}
                className="w-full h-full object-cover object-top"
              />
            </div>
            
            <span className="text-xs uppercase tracking-widest font-bold text-[#2D6A4F] mb-1">
              {groom.role}
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#1A2820] font-semibold mb-4">
              {groom.fullName}
            </h3>
            <p className="text-sm sm:text-base text-[#4D5E54] leading-relaxed mb-8 flex-grow font-light">
              {groom.bio}
            </p>

            <div className="bg-[#2D6A4F]/10 rounded-2xl p-5 w-full relative border border-[#2D6A4F]/20">
              <Quote className="w-5 h-5 text-[#C5A059] absolute top-2 left-3 opacity-60" />
              <p className="font-cormorant italic text-base text-[#1A2820] px-4 font-medium">
                "{groom.quote}"
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
