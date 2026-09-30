import React from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { weddingData } from '../data/weddingData';

export function Story() {
  return (
    <section id="story" className="py-24 px-4 bg-white relative overflow-hidden">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-20">
          <span className="font-script text-4xl sm:text-5xl text-[#2D6A4F] block mb-2 font-normal">
            A Nossa História de Amor
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#1A2820] font-normal tracking-wide">
            Capítulos do Nosso Encontro
          </h2>
          <div className="w-20 h-0.5 bg-[#C5A059] mx-auto mt-4 mb-4" />
          <p className="text-sm sm:text-base text-[#4D5E54] max-w-xl mx-auto italic font-cormorant text-lg sm:text-xl">
            "Acima de tudo, porém, revistam-se do amor, que é o elo perfeito." — Colossenses 3:14
          </p>
        </div>

        {/* Timeline Items */}
        <div className="space-y-16 sm:space-y-24">
          {weddingData.story.map((item, index) => {
            const isEven = index % 2 === 0;
            return (
              <div 
                key={index} 
                className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 sm:gap-14`}
              >
                {/* Image Card */}
                <div className="w-full md:w-1/2 group">
                  <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-[#F7F9F6] group-hover:shadow-2xl transition-all duration-500 max-h-[420px]">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 bg-[#1B4332]/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-serif font-bold text-[#E8D7B0] border border-[#C5A059]/40 shadow-md">
                      {item.year}
                    </div>
                  </div>
                </div>

                {/* Text Content */}
                <div className="w-full md:w-1/2 text-center md:text-left space-y-4">
                  <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-bold text-[#2D6A4F]">
                    <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Capítulo {index + 1}</span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#1A2820] font-medium leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-[#4D5E54] leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
