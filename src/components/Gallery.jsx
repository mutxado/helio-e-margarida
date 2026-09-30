import React, { useState } from 'react';
import { Maximize2, X, Sparkles } from 'lucide-react';
import { weddingData } from '../data/weddingData';

export function Gallery() {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  return (
    <section id="gallery" className="py-24 px-4 bg-[#F7F9F6] relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="font-script text-4xl sm:text-5xl text-[#2D6A4F] block mb-2 font-normal">
            Registos Especiais
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#1A2820] font-normal tracking-wide">
            Galeria do Casal
          </h2>
          <div className="w-20 h-0.5 bg-[#C5A059] mx-auto mt-4 mb-4" />
          <p className="text-sm sm:text-base text-[#4D5E54] max-w-xl mx-auto">
            Um vislumbre dos nossos sorrisos e da cumplicidade que nos une.
          </p>
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {weddingData.gallery.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className="relative group rounded-3xl overflow-hidden h-80 sm:h-96 cursor-pointer shadow-md border-2 border-white hover:shadow-2xl transition-all duration-500"
            >
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A2E24]/85 via-[#1A2E24]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <div className="text-white flex items-center justify-between w-full">
                  <div>
                    <h4 className="font-serif text-lg font-medium text-white">
                      {photo.title}
                    </h4>
                    <span className="text-xs text-[#E8D7B0]">Clique para ampliar</span>
                  </div>
                  <Maximize2 className="w-5 h-5 text-[#C5A059]" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Fullscreen Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-6 right-6 text-white hover:text-[#C5A059] p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all"
            aria-label="Fechar"
          >
            <X className="w-7 h-7" />
          </button>
          
          <div className="max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.title}
              className="max-h-[82vh] w-auto max-w-full rounded-2xl shadow-2xl object-contain mb-4 border-2 border-[#C5A059]/40"
            />
            <p className="font-serif text-xl text-[#E8D7B0] font-light tracking-wide text-center">
              {selectedPhoto.title}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
