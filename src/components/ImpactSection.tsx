import React, { useState } from 'react';
import { NorwayMap } from './NorwayMap';
import type { GeoJSON as GeoJSONType } from 'geojson';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImpactSectionProps {
  geoData: GeoJSONType | null;
  darkMode: boolean;
}

interface Client {
  name: string;
  image: string;
  description: string;
}

const clients: Client[] = [
  {
    name: "Avinor",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop",
    description: "På oppdrag hos Avinor har Rubberduck vært en sentral bidragsyter i gjennomføringen av en større migrering av tjenester og infrastruktur til sky. Vi er også en del av et meget progressivt og fremoverlent miljø som jobber med utvikling innenfor alt fra parkering - både for bil og fly - til systemer for køtidsprediksjoner."
  },
  {
    name: "Posten Norge AS",
    image: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?q=80&w=2072&auto=format&fit=crop",
    description: "Vårt samarbeid med Posten strekker seg over flere år og Rubberduck har bistått med å få i havn mange viktige prosjekter, blant annet Pakkeboks som de fleste i Norge har et forhold til. Posten har vunnet prisen som Norges mest innovative selskap opptil flere ganger, og det er den type miljø som våre konsulenter stortrives i."
  },
  {
    name: "Eika",
    image: "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?q=80&w=2070&auto=format&fit=crop",
    description: "Helt siden Rubberducks oppstart i 2005 har vi hatt konsulenter på plass i Eika. Bank og finans er et veldig spennende og viktig område som har hatt mye utvikling de siste årene. Vi trives veldig godt på Eika, nettopp fordi vi har hatt mulighet til å delta på så mange viktige prosjekter som har formet bankhverdagen til så mange."
  },
  {
    name: "Tolletaten",
    image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=2070&auto=format&fit=crop",
    description: "I Tolletaten jobber vi med samfunnskritiske systemer som er i bruk døgnet rundt av tollbetjenter for å utføre grense- og vareførselskontroller. Tolletaten er en etat som aldri sover! Etaten krever derfor at systemer utvikles med robust og sikker kode, og dette er noe vi brenner for."
  },
  {
    name: "Statistisk sentralbyrå",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    description: "SSB har et fremoverlent teknisk miljø der Rubberduck har stor frihet over hvordan ting bygges og driftes. All kode som produseres er åpen kildekode. Vi jobber med utvikling av \"Dapla\" - SSBs dataplattform i skyen, hvor data fra mange ulike kilder hentes inn, pseudonymiseres og konverteres til felles format som kan brukes til statistikk."
  }
];

export function ImpactSection({ geoData, darkMode }: ImpactSectionProps) {
  const [currentClient, setCurrentClient] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextClient = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentClient((prev) => (prev + 1) % clients.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevClient = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentClient((prev) => (prev - 1 + clients.length) % clients.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <section id="impact" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-custom-dark dark:text-white mb-6">
            Rubberduck i Norge
          </h2>
          <p className="text-lg md:text-xl text-custom-dark/80 dark:text-white/80 max-w-3xl mx-auto mb-8">
            Koden vi skriver har stor betydning for Norges befolkning. Vi utvikler løsninger som brukes av millioner av mennesker hver dag, 
            fra kritiske samfunnsfunksjoner til tjenester som gjør hverdagen enklere. Dette er vi utrolig stolte av!
          </p>
        </div>

        {/* Centered map */}
        <div className="max-w-4xl mx-auto mb-24">
          <div className="aspect-[4/3]">
            <NorwayMap geoData={geoData} darkMode={darkMode} />
          </div>
        </div>

        {/* Subheading for clients */}
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-custom-dark dark:text-white mb-4">
            Her er vi
          </h3>
          <p className="text-lg text-custom-dark/80 dark:text-white/80">
            Vi jobber med noen av Norges mest spennende bedrifter
          </p>
        </div>
        
        {/* Centered client carousel */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="relative aspect-video">
              <img
                src={clients[currentClient].image}
                alt={clients[currentClient].name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <h3 className="absolute bottom-6 left-6 text-3xl font-bold text-white">
                {clients[currentClient].name}
              </h3>
            </div>
            
            <div className="p-6">
              <p className="text-custom-dark/80 dark:text-white/80 leading-relaxed">
                {clients[currentClient].description}
              </p>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-zinc-700">
              <button
                onClick={prevClient}
                className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-full transition-colors"
                disabled={isAnimating}
              >
                <ChevronLeft className="w-6 h-6 text-custom-dark dark:text-white" />
              </button>

              {/* Dots */}
              <div className="flex gap-2">
                {clients.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (!isAnimating) {
                        setIsAnimating(true);
                        setCurrentClient(index);
                        setTimeout(() => setIsAnimating(false), 500);
                      }
                    }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentClient
                        ? 'w-6 bg-custom-dark dark:bg-white'
                        : 'bg-gray-300 dark:bg-zinc-600'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextClient}
                className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-full transition-colors"
                disabled={isAnimating}
              >
                <ChevronRight className="w-6 h-6 text-custom-dark dark:text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}