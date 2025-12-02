import React, { useState, useEffect } from 'react';

interface ProgrammerSectionProps {
  setIsTerminalOpen: (isOpen: boolean) => void;
}

export function ProgrammerSection({ setIsTerminalOpen }: ProgrammerSectionProps) {
  const [showThoughtBubble, setShowThoughtBubble] = useState(false);
  const [currentThoughtIndex, setCurrentThoughtIndex] = useState(0);
  const [isThoughtVisible, setIsThoughtVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [currentImage, setCurrentImage] = useState('/programmer.svg');

  // Preload images
  useEffect(() => {
    const images = ['/programmer.svg', '/chair.svg'];
    images.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Check time and update image
  useEffect(() => {
    const updateImage = () => {
      const hour = new Date().getHours();
      setCurrentImage(hour >= 21 || hour < 6 ? '/chair.svg' : '/programmer.svg');
      // If it's night time, pause the thought bubble
      if (hour >= 21 || hour < 6) {
        setShowThoughtBubble(false);
        setIsPaused(true);
      } else {
        setIsPaused(false);
      }
    };

    updateImage(); // Initial check
    const interval = setInterval(updateImage, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const thoughts = [
    'Ok, la oss få på plass denne funksjonen...',
    'Hmm, hvordan gjorde jeg dette sist? Ah, der var det.',
    'Hvorfor returnerer denne undefined? Det skal den ikke.',
    'Logger verdien... Åja, selvfølgelig, glemte å returnere.',
    'Sånn. Next!',
    'Nå må jeg bare koble dette mot API-et.',
    'Hvorfor treffer den ikke endpointet?',
    'Hmm... Har jeg skrevet URL-en riktig?',
    'Åja, skrivefeil. Det var det rettet opp.',
    'Der, nå skal det funke.',
    'Nei... fortsatt ikke?',
    'La meg sjekke payloaden...',
    'Hmm... hvorfor mangler dette feltet? Jeg la det jo nettopp til!',
    '.....',
    'Ok, pust med magen. Hva skjer egentlig her?',
    'Er det frontend eller backend som det er noe tull med?',
    'Kjøre en test-request... jaha, ser ut som backend aldri mottar feltet.',
    'Hmm...',
    'Vent litt, dette objektet ser rart ut.',
    'wtf',
    'Hvem har skrevet dette?',
    'git blame',
    'Ah. Det var meg.',
    'Hmm... ok, jeg ser hva jeg prøvde på her.',
    'Burde kanskje ha brukt en annen serialisering...',
    'Greit, jeg refaktorerer dette litt.',
    'Test igjen... YES! Der satt den.',
    'Sånn, alt fungerer. Da slapp jeg å skrive om alt.',
    'Push og videre til neste greie!'
  ];

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 22 || hour < 6) return; // Don't show thought bubble at night

    const timer = setTimeout(() => {
      setShowThoughtBubble(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showThoughtBubble && !isPaused) {
      const nextThought = () => {
        // Start fade out
        setIsThoughtVisible(false);
        
        // Wait for fade out, then change text and fade in
        setTimeout(() => {
          setCurrentThoughtIndex((prev) => (prev + 1) % thoughts.length);
          setIsThoughtVisible(true);

          // Randomly decide to pause thinking
          if (Math.random() < 0.2) { // 20% chance to pause
            setIsPaused(true);
            setTimeout(() => {
              setIsPaused(false);
            }, Math.random() * 8000 + 4000); // Pause for 4-12 seconds
          }
        }, 1000);
      };

      const interval = setInterval(() => {
        if (!isPaused) {
          nextThought();
        }
      }, 6000);

      return () => clearInterval(interval);
    }
  }, [showThoughtBubble, isPaused]);

  return (
    <div className="hidden lg:block relative">
      {/* Bounded box container */}
      <div className="relative w-[500px] h-[500px] mx-auto">
        {/* Thought bubble */}
        {showThoughtBubble && !isPaused && (
          <div className="absolute left-[140px] top-[40px] z-30">
            {/* Bubble tail */}
            <div className="absolute bottom-0 left-8 transform translate-y-full">
              <div className="opacity-0 animate-[fade-in_0.3s_ease-out_0.6s_forwards] w-4 h-4 bg-white rounded-full mb-1" />
              <div className="opacity-0 animate-[fade-in_0.3s_ease-out_0.3s_forwards] w-3 h-3 bg-white rounded-full mb-1 ml-2" />
              <div className="opacity-0 animate-[fade-in_0.3s_ease-out_forwards] w-2 h-2 bg-white rounded-full ml-3" />
            </div>
            {/* Main bubble */}
            <div className="opacity-0 animate-[pop-in_0.5s_cubic-bezier(0.175,0.885,0.32,1.275)_0.9s_forwards] bg-white rounded-3xl p-6 shadow-lg relative min-w-[300px] h-[120px]">
              <pre 
                className={`
                  font-mono text-sm text-custom-dark whitespace-pre-wrap
                  transition-opacity duration-1000
                  ${isThoughtVisible ? 'opacity-100' : 'opacity-0'}
                `}
              >
                {thoughts[currentThoughtIndex]}
              </pre>
            </div>
          </div>
        )}

        {/* Lamp container */}
        <div className="absolute right-[140px] bottom-[40px] flex flex-col items-center z-20">
          {/* Lamp head */}
          <div className="w-[80px] h-[60px] bg-black dark:bg-black rounded-[50%_50%_20%_20%] rotate-[25deg] border border-black z-90"></div>
          {/* Light cone */}
          <div className="absolute top-[152px] -left-[440px] -rotate-[32deg] w-0 h-0 hidden dark:block
            border-l-[415px] border-l-transparent 
            border-r-[202px] border-r-transparent 
            border-t-[246px] border-t-[rgb(254_240_138_/_0.9)]
            border-b-[16px] border-b-transparent 
            transition-colors duration-[2000ms] animate-light-cone z-10"></div>
          {/* Stand */}
          <div className="w-[4px] h-[254px] bg-black dark:bg-black"></div>
          {/* Base */}
          <div className="w-[90px] h-[4px] bg-black dark:bg-black rounded-[10px]"></div>
        </div>
        
        {/* Programmer */}
        <button
          onClick={() => setIsTerminalOpen(true)}
          className="absolute left-[40px] bottom-0 w-[300px] h-auto z-50 focus:outline-none"
        >
          <img 
            src={currentImage}
            alt="Programmer illustration" 
            className="w-full h-auto transition-opacity duration-500"
          />
        </button>

        {/* Decorative circles - behind everything */}
        <div className="absolute -z-10 inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-yellow-200 dark:bg-yellow-500/20 rounded-full blur-3xl opacity-60" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-200 dark:bg-blue-500/20 rounded-full blur-3xl opacity-60" />
        </div>
      </div>
    </div>
  );
}