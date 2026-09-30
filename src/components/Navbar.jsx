import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Início', href: '#hero' },
    { name: 'A Nossa História', href: '#story' },
    { name: 'Os Noivos', href: '#couple' },
    { name: 'Programa & Local', href: '#schedule' },
    { name: 'Galeria', href: '#gallery' },
    { name: 'Presentes', href: '#gifts' },
    { name: 'Confirmar Presença', href: '#rsvp' },
    { name: 'Mural de Votos', href: '#messages' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-[#F7F9F6]/95 backdrop-blur-md shadow-md py-3 border-b border-[#2D6A4F]/15' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Monogram Brand */}
        <a href="#hero" className="flex items-center gap-2 group">
          <span className="font-serif text-2xl sm:text-3xl text-[#1B4332] font-semibold tracking-wider group-hover:text-[#2D6A4F] transition-colors">
            HÉLIO <span className="font-script text-3xl sm:text-4xl text-[#C5A059] px-1 font-normal">&</span> MARGARIDA
          </span>
          <Sparkles className="w-4 h-4 text-[#C5A059] animate-pulse hidden sm:inline-block" />
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-7 text-xs uppercase tracking-widest font-semibold text-[#2D3A32]">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="hover:text-[#2D6A4F] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#2D6A4F] hover:after:w-full after:transition-all"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <a
            href="#rsvp"
            className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs uppercase tracking-wider font-semibold shadow-xs transition-all"
          >
            RSVP
          </a>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-[#1B4332] hover:bg-[#2D6A4F]/10 focus:outline-hidden"
            aria-label="Abrir Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#F7F9F6] border-b border-[#2D6A4F]/20 shadow-xl px-6 py-6 transition-all animate-fadeIn">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm uppercase tracking-wider font-semibold text-[#1B4332] hover:text-[#2D6A4F] py-2 border-b border-[#2D6A4F]/10"
              >
                {link.name}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
