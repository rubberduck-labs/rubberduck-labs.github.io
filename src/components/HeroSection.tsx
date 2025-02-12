import React from 'react';
import { Link } from 'react-router-dom';
import { CookieNotice } from './CookieNotice';

export function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      <div className="container mx-auto relative">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-custom-dark dark:text-white leading-tight">
            Noe du brenner for,
            <br />
            et sted du kan vokse,
            <br />
            og et liv utenom.
          </h1>
          <p className="text-xl md:text-2xl text-custom-dark/80 dark:text-white/80 max-w-2xl mx-auto whitespace-nowrap">
            Vi skaper varig verdi gjennom teknologi og innovasjon i hele Norge
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/impact"
              className="px-8 py-3 bg-custom-dark text-white dark:bg-white dark:text-custom-dark rounded-full font-semibold hover:opacity-90 transition-opacity"
            >
              Se vår påvirkning
            </Link>
            <a
              href="#kontakt"
              className="px-8 py-3 bg-white text-custom-dark dark:bg-custom-dark dark:text-white rounded-full font-semibold hover:opacity-90 transition-opacity"
            >
              Kontakt oss
            </a>
          </div>
        </div>
      </div>
      <CookieNotice />
    </section>
  );
}