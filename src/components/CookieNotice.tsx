import React, { useState, useEffect } from 'react';
import { Cookie } from 'lucide-react';

export function CookieNotice() {
  const [opacity, setOpacity] = useState(1);
  const [display, setDisplay] = useState(true);

  useEffect(() => {
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
        flex items-center gap-2 
        bg-white/80 dark:bg-custom-dark/80 
        px-3 py-1.5 
        rounded-lg 
        shadow-sm 
        backdrop-blur-sm
        transition-opacity duration-500 ease-out
        text-custom-dark/70 dark:text-white/70
        text-xs
      `}
    >
      <Cookie className="w-3 h-3" />
      <p>Nettsiden bruker ingen cookies eller sporingsverktøy</p>
    </div>
  );
}