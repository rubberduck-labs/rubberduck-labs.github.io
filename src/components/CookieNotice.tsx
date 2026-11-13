import React, { useState, useEffect } from 'react';
import { Cookie } from 'lucide-react';

// På smale skjermer ligger meldingen i selve siden, under teksten, så den ikke dekker noe. Ellers er den en liten lapp nede til høyre.
export function CookieNotice({ className = '' }: { className?: string }) {
  const [opacity, setOpacity] = useState(1);
  const [display, setDisplay] = useState(true);

  useEffect(() => {
    if (window.matchMedia('(max-width: 639px)').matches) return; // i teksten: ingen skjuling ved rulling
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setOpacity(0);
        // Remove from DOM after fade animation completes
        setTimeout(() => setDisplay(false), 500);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!display) return null;

  return (
    <div 
      style={{ opacity }}
      className={`
        fixed bottom-4 right-4 
        max-sm:static max-sm:mx-auto max-sm:mt-1 max-sm:w-fit max-sm:max-w-full max-sm:justify-center max-sm:text-center
        flex items-center gap-2 
        bg-white/80 dark:bg-custom-dark/80 
        px-3 py-1.5 
        rounded-lg 
        shadow-sm 
        backdrop-blur-sm
        transition-opacity duration-500 ease-out
        text-custom-dark/70 dark:text-white/70
        text-xs
        ${className}
      `}
    >
      <Cookie className="w-3 h-3 shrink-0" aria-hidden="true" />
      <p>Vi bruker ingen cookies, men samler anonym besøksstatistikk</p>
    </div>
  );
}