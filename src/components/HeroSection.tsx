import { useState } from 'react';
import { CookieNotice } from './CookieNotice';
import { Terminal } from './Terminal';
import { SeasonalBanner } from './SeasonalBanner';
import { ProgrammerSection } from './ProgrammerSection';
import { Mail } from "lucide-react";
import { ContactDialog } from './ContactDialog';

interface HeroSectionProps {
  setBackgroundColor: (color: string | null) => void;
}

export function HeroSection({ setBackgroundColor }: HeroSectionProps) {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Brødtekst: liten og rolig på mobil, som før på større skjermer.
  const paragraphClass =
    'text-[15px] leading-6 font-normal sm:text-lg sm:leading-normal md:text-xl sm:font-light ' +
    'text-custom-dark/80 dark:text-white/80 max-w-2xl mx-auto lg:mx-0 max-lg:text-center';
  // Gul markering under nøkkelordene i overskriften, bare på mobil.
  const mark =
    'max-sm:[background:linear-gradient(transparent_62%,rgb(255_255_255/.6)_62%)] ' +
    'dark:max-sm:[background:linear-gradient(transparent_62%,rgb(253_224_71/.4)_62%)]';

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-6 md:p-8 relative overflow-hidden">
      <div className="container mx-auto relative">
        {/* På mobil står scenen mellom overskriften og knappene: venstre kolonne «løses opp» og barna får egen rekkefølge. */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-12 items-center max-lg:mx-auto max-lg:max-w-[40rem]">
          <div className="max-lg:contents lg:text-left lg:space-y-8">
            <h1 className="order-1 text-center lg:text-left text-[clamp(1.9rem,8.6vw,2.4rem)] sm:text-4xl xl:text-6xl font-extrabold sm:font-bold tracking-tight sm:tracking-normal text-custom-dark dark:text-white leading-[1.08] sm:leading-tight">
              <span className="block sm:inline-block"><span className={mark}>Noe du brenner for,</span></span>{' '}
              <span className="block sm:inline-block">et sted du kan <span className={mark}>vokse,</span></span>{' '}
              <span className="block sm:inline-block">og et <span className={mark}>liv utenom.</span></span>
            </h1>
            <p className={`${paragraphClass} order-2`}>
              Å jobbe som konsulent er gøy og lærerikt!
            </p>
            <p className={`${paragraphClass} order-5 max-lg:pt-4`}>
              Muligheten til å jobbe på tvers av bransjer, få lov til å bygge kompetanse på domener og teknologi i alle
              hjørner av samfunnet er et privilegium få andre yrker kan skilte med.
            </p>
            <p className={`${paragraphClass} order-6`}>
              Rubberduck er et koselig konsulenthus der kontinuerlig læring står i fokus.
            </p>
            <div className="order-4 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              {/* Button group with fixed widths */}
              <div className="grid grid-cols-[1.35fr_1fr] gap-2 w-full sm:flex sm:flex-row sm:gap-4 sm:w-auto">
                <a
                  href="/kode24/"
                  className="inline-flex h-11 items-center justify-center w-full sm:w-[190px] px-3 sm:px-6 bg-custom-dark text-white dark:bg-white dark:text-custom-dark rounded-full font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
                >
                  Jobb i Rubberduck
                </a>
                <button
                  type="button"
                  onClick={() => setIsContactOpen(true)}
                  className="inline-flex h-11 items-center justify-center gap-2 px-3 sm:px-6 bg-white text-custom-dark dark:bg-custom-dark dark:text-white max-sm:dark:ring-1 max-sm:dark:ring-white/30 rounded-full font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
                >
                  <Mail className="w-4 h-4" aria-hidden="true" />
                  Kontakt oss
                </button>
              </div>
              {/* Seasonal banner in its own container */}
              <div className="w-full sm:w-auto">
                <SeasonalBanner />
              </div>
            </div>
            {/* Mobil: ligger under teksten (order-7). Større skjermer: fast lapp nede til høyre. */}
            <CookieNotice className="order-7" />
          </div>

          {/* Programmereren: på mobil skaleres scenen ned og står under introen */}
          <div className="order-3 lg:order-none min-w-0">
            <ProgrammerSection setIsTerminalOpen={setIsTerminalOpen} />
          </div>
        </div>
      </div>
      <Terminal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
        setBackgroundColor={setBackgroundColor}
      />
      <ContactDialog open={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </section>
  );
}
