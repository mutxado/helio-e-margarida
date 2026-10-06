import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Início', href: '#hero' },
    { name: 'História', href: '#story' },
    { name: 'Noivos', href: '#couple' },
    { name: 'Programa', href: '#schedule' },
    { name: 'Galeria', href: '#gallery' },
    { name: 'Mural', href: '#messages' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-[#0E1A14]/95 backdrop-blur-md shadow-lg py-3.5 border-b border-[#C5A059]/20' 
        : 'bg-[#0E1A14]/70 backdrop-blur-md py-4 border-b border-white/10'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* Monogram Brand - Single Clean Line */}
        <a href="#hero" className="flex items-center gap-2 group shrink-0">
          <span className="font-serif text-base sm:text-lg tracking-[0.18em] uppercase font-medium text-white transition-colors group-hover:text-[#E8D7B0] whitespace-nowrap">
            Margarida <span className="font-script text-2xl text-[#C5A059] px-0.5 font-normal">&</span> Hélio
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 text-xs uppercase tracking-[0.16em] font-medium">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-white/85 hover:text-[#E8D7B0] transition-colors relative py-1 whitespace-nowrap after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] hover:after:w-full after:bg-[#C5A059] after:transition-all"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#rsvp"
            className="hidden sm:inline-flex items-center justify-center px-6 py-2 rounded-full text-xs uppercase tracking-wider font-bold shadow-md transition-all bg-gradient-to-r from-[#C5A059] to-[#A38038] hover:from-[#D4AF37] hover:to-[#B8934A] text-[#0E1A14] hover:shadow-lg"
          >
            RSVP
          </a>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-white hover:bg-white/10 transition-colors focus:outline-hidden"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-[#E8D7B0]" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0E1A14]/98 backdrop-blur-xl border-b border-[#C5A059]/20 shadow-2xl px-6 py-6 transition-all animate-fadeIn">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs uppercase tracking-[0.18em] font-semibold text-white/90 hover:text-[#E8D7B0] py-2.5 border-b border-white/5 transition-colors"
              >
                {link.name}
              </a>
            ))}
            <a
              href="#rsvp"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-3 block text-center py-3 rounded-full bg-gradient-to-r from-[#C5A059] to-[#A38038] text-[#0E1A14] font-bold text-xs uppercase tracking-wider shadow-md"
            >
              Confirmar Presença (RSVP)
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
