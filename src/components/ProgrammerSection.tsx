import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useHoliday } from '../hooks/useHoliday';
import { PRIDE_COLORS } from '../utils/pride';
import { ChristmasLights } from './ChristmasLights';

interface ProgrammerSectionProps {
  setIsTerminalOpen: (isOpen: boolean) => void;
}

// Lyskjeglen er en trekant (617 × 246 px) der lampehodet sitter i øvre høyre hjørne.
// Sett derfra går lyset fra 219,4° (ned langs lampefoten, mot spissen 415 px inn på underkanten)
// til 270° (rett mot venstre langs overkanten). De seks stripene deler de 50,6 gradene likt,
// med rødt ytterst og lilla nærmest lampefoten, som i flagget.
const BEAM_FROM = 219.4;
const BEAM_SPAN = 50.6;
const prideBeam = (() => {
  const step = BEAM_SPAN / PRIDE_COLORS.length;
  const stops = [...PRIDE_COLORS].reverse().map((hex, i) => {
    const [r, g, b] = [1, 3, 5].map((o) => parseInt(hex.slice(o, o + 2), 16));
    const color = `rgb(${r} ${g} ${b} / 0.92)`;
    return `${color} ${(i * step).toFixed(2)}deg ${((i + 1) * step).toFixed(2)}deg`;
  });
  return `conic-gradient(from ${BEAM_FROM}deg at 100% 0, ${stops.join(', ')}, transparent ${BEAM_SPAN}deg)`;
})();

export function ProgrammerSection({ setIsTerminalOpen }: ProgrammerSectionProps) {
  const holiday = useHoliday();
  const isPride = holiday === 'pride';
  const isChristmas = holiday === 'christmas';
  const [showThoughtBubble, setShowThoughtBubble] = useState(false);
  const [currentThoughtIndex, setCurrentThoughtIndex] = useState(0);
  const [isThoughtVisible, setIsThoughtVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [currentImage, setCurrentImage] = useState('/programmer.svg');

  // Scenen er tegnet på 500 × 500. På smale skjermer skaleres den ned til bredden den får.
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  // På mobil ligger tankeboblen utenfor scenen, så den tomme toppen av scenen klippes bort.
  const [crop, setCrop] = useState(() => (window.innerWidth < 1024 ? 110 : 0));
  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => {
      setScale(Math.min(1, el.clientWidth / 500));
      setCrop(window.innerWidth < 1024 ? 110 : 0);
    };
    update();
    const obs = new ResizeObserver(update);
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

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
    if (showThoughtBubble && !isPaused && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
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

  const bubbleVisible = showThoughtBubble && !isPaused;

  return (
    <div className="relative">
      {/* Mobil: tankeboblen ligger over scenen i vanlig tekststørrelse, fordi skalert tekst blir for liten. */}
      <div className="lg:hidden relative mx-auto mb-4 h-[104px] w-full max-w-[272px]">
        {bubbleVisible && (
          // Boblen er så bred som tanken og står midt over halen, som står fast og peker mot hodet.
          // w-max + max-w gjør at lange tanker brytes ved full bredde, uansett hvor boblen står.
          <div className="absolute bottom-5 left-[110px] -translate-x-1/2">
            <div className="opacity-0 motion-reduce:animate-none motion-reduce:opacity-100 animate-[pop-in_0.5s_cubic-bezier(0.175,0.885,0.32,1.275)_0.2s_forwards] w-max max-w-[272px] rounded-3xl bg-white px-4 py-3 text-center shadow-lg">
              <pre
                className={`
                  font-mono text-sm text-custom-dark whitespace-pre-wrap
                  transition-opacity duration-1000 motion-reduce:transition-none
                  ${isThoughtVisible ? 'opacity-100' : 'opacity-0'}
                `}
              >
                {thoughts[currentThoughtIndex]}
              </pre>
            </div>
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2">
              <div className="opacity-0 motion-reduce:animate-none motion-reduce:opacity-100 animate-[fade-in_0.3s_ease-out_0.6s_forwards] mb-1 h-3 w-3 rounded-full bg-white" />
              <div className="opacity-0 motion-reduce:animate-none motion-reduce:opacity-100 animate-[fade-in_0.3s_ease-out_0.3s_forwards] ml-1 h-2 w-2 rounded-full bg-white" />
            </div>
          </div>
        )}
      </div>

      {/* Boksen følger bredden, scenen inni er 500 × 500 og skaleres */}
      <div ref={wrapRef} className="relative mx-auto aspect-[500/390] w-full max-w-[240px] lg:aspect-auto lg:h-[500px] lg:w-[500px] lg:max-w-none">
        <div className="absolute left-0 top-0 h-[500px] w-[500px] origin-top-left" style={{ transform: `translateY(${-crop * scale}px) scale(${scale})` }}>
          {/* Thought bubble (desktop) */}
          {bubbleVisible && (
            // Boblen står midt over halen og vokser like mye til begge sider, så halen alltid peker mot hodet.
            <div className="absolute left-[180px] bottom-[340px] z-30 hidden -translate-x-1/2 lg:block">
              {/* Bubble tail */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
                <div className="opacity-0 motion-reduce:animate-none motion-reduce:opacity-100 animate-[fade-in_0.3s_ease-out_0.6s_forwards] w-4 h-4 bg-white rounded-full mb-1" />
                <div className="opacity-0 motion-reduce:animate-none motion-reduce:opacity-100 animate-[fade-in_0.3s_ease-out_0.3s_forwards] w-3 h-3 bg-white rounded-full mb-1 ml-2" />
                <div className="opacity-0 motion-reduce:animate-none motion-reduce:opacity-100 animate-[fade-in_0.3s_ease-out_forwards] w-2 h-2 bg-white rounded-full ml-3" />
              </div>
              {/* Main bubble */}
              <div className="opacity-0 motion-reduce:animate-none motion-reduce:opacity-100 animate-[pop-in_0.5s_cubic-bezier(0.175,0.885,0.32,1.275)_0.9s_forwards] bg-white rounded-3xl px-6 py-4 shadow-lg relative w-max max-w-[340px] text-center">
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
            {isPride ? (
              // Pride-måneden: lyset fra lampen er flagget, som stråler ut fra lampen. Som vanlig bare når lampen er på (mørk modus).
              // Samme trekant som den vanlige kjeglen (617 × 246 px, spissen 415 px inn), men tegnet med clip-path.
              <div
                aria-hidden="true"
                className="absolute top-[152px] -left-[440px] -rotate-[32deg] hidden h-[246px] w-[617px] opacity-0 animate-[fade-in_1.5s_ease-out_0.5s_forwards] dark:block z-10"
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 415px 100%)',
                  background: prideBeam,
                }}
              />
            ) : (
            <div className="absolute top-[152px] -left-[440px] -rotate-[32deg] w-0 h-0 hidden dark:block
              border-l-[415px] border-l-transparent
              border-r-[202px] border-r-transparent
              border-t-[246px] border-t-[rgb(254_240_138_/_0.9)]
              border-b-[16px] border-b-transparent
              transition-colors duration-[2000ms] animate-light-cone z-10"></div>
            )}
            {/* Stand, med lysslynge i julemodus */}
            <div className="relative z-20 w-[4px] h-[254px] bg-black dark:bg-black">
              {isChristmas && <ChristmasLights />}
            </div>
            {/* Base */}
            <div className="w-[90px] h-[4px] bg-black dark:bg-black rounded-[10px]"></div>
          </div>

          {/* Programmer */}
          <button
            onClick={() => setIsTerminalOpen(true)}
            className="group absolute left-[40px] bottom-0 w-[300px] h-auto z-50 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current motion-safe:active:scale-[0.98] transition-transform"
            aria-label="Åpne terminalen"
          >
            {/* Mykt, rundt lys bak figuren ved hover og fokus. Ikke et omriss, så det ikke flimrer i stolen og beina. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -inset-x-6 -inset-y-4 -z-10 rounded-full opacity-0 transition-opacity duration-500
                bg-[radial-gradient(closest-side,rgb(255_255_255/.75),rgb(255_255_255/.35)_55%,transparent)]
                dark:bg-[radial-gradient(closest-side,rgb(253_224_71/.5),rgb(253_224_71/.2)_55%,transparent)]
                group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
            />
            <img
              src={currentImage}
              alt=""
              className="w-full h-auto transition-opacity duration-500"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
