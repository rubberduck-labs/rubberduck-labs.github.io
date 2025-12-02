import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CookieNotice } from './CookieNotice';
import { Terminal } from './Terminal';
import { SeasonalBanner } from './SeasonalBanner';
import { ProgrammerSection } from './ProgrammerSection';
import { ContactForm } from './ContactForm';

interface HeroSectionProps {
  setBackgroundColor: (color: string | null) => void;
}

export function HeroSection({ setBackgroundColor }: HeroSectionProps) {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);

  return (
    <section className="min-h-screen flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      <div className="container mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left space-y-8">
            <h1 className="text-3xl sm:text-4xl xl:text-6xl font-bold text-custom-dark dark:text-white leading-tight">
              <span className="inline-block">Noe du brenner for,</span>{' '}
              <span className="inline-block">et sted du kan vokse,</span>{' '}
              <span className="inline-block">og et liv utenom.</span>
            </h1>
            <p className="text-lg md:text-xl text-custom-dark/80 dark:text-white/80 max-w-2xl mx-auto lg:mx-0 font-light">
              Å jobbe som konsulent er gøy og lærerikt! Muligheten til å jobbe på tvers av bransjer, få lov til å bygge kompetanse på domener og teknologi i alle hjørner av samfunnet er et privilegium få andre yrker kan skilte med. Rubberduck er et koselig konsulenthus der kontinuerlig læring står i fokus.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              {/* Button group with fixed widths */}
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link
                  to="/impact"
                  className="inline-flex h-11 items-center justify-center w-full sm:w-[160px] px-6 bg-custom-dark text-white dark:bg-white dark:text-custom-dark rounded-full font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
                >
                  Her er vi
                </Link>
                <button
                  onClick={() => setShowContactForm(true)}
                  className="inline-flex h-11 items-center justify-center w-full sm:w-[160px] px-6 bg-white text-custom-dark dark:bg-custom-dark dark:text-white rounded-full font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
                >
                  Kontakt oss
                </button>
              </div>
              {/* Seasonal banner in its own container */}
              <div className="w-full sm:w-auto">
                <SeasonalBanner />
              </div>
            </div>
          </div>
          
          {/* Hide ProgrammerSection on mobile */}
          <div className="hidden lg:block">
            <ProgrammerSection setIsTerminalOpen={setIsTerminalOpen} />
          </div>
        </div>
      </div>
      <Terminal 
        isOpen={isTerminalOpen} 
        onClose={() => setIsTerminalOpen(false)} 
        setBackgroundColor={setBackgroundColor}
      />
      <CookieNotice />

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
          <div className="w-full max-w-2xl">
            <div className="relative">
              <button
                onClick={() => setShowContactForm(false)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              >
                Lukk
              </button>
              <ContactForm />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}