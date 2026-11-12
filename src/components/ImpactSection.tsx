type Featured = { name: string; logo: string; tall: boolean; text: string };
type Logo = { name: string; logo: string; tall: boolean };

const featured: Featured[] = [
  { name: "Posten Bring", logo: "/logos/postenbring.png", tall: true, text: "Vårt samarbeid med Posten strekker seg over flere år og Rubberduck har bistått med å få i havn mange viktige prosjekter, blant annet Pakkeboks som de fleste i Norge har et forhold til. Posten har vunnet prisen som Norges mest innovative selskap opptil flere ganger, og det er den type miljø som våre konsulenter stortrives i." },
  { name: "Eika", logo: "/logos/eika.svg", tall: false, text: "Helt siden Rubberducks oppstart i 2005 har vi hatt konsulenter på plass i Eika. Bank og finans er et veldig spennende og viktig område som har hatt mye utvikling de siste årene. Vi trives veldig godt på Eika, nettopp fordi vi har hatt mulighet til å delta på så mange viktige prosjekter som har formet bankhverdagen til så mange." },
  { name: "Bama", logo: "/logos/bama.svg", tall: false, text: "Frukt og grønt skal fra bonden til butikkhyllene, og de digitale systemene må henge med. Siden 2025 har vi vært med på å bygge skyplattformen Bama skal bygge videre på, fra design til ferdig løsning." },
  { name: "SpareBank 1", logo: "/logos/sparebank1.svg", tall: false, text: "I SB1 Bedrift finner bedriftskundene i hele SpareBank 1-alliansen bank, pensjon, forsikring og regnskap på ett sted. Vi har vært med på å bygge løsningen hos SpareBank 1 Utvikling siden 2024. Vi trives med å bygge noe så mange bruker, og som må fungere hver eneste dag." },
];

const others: Logo[] = [
  { name: "Avinor", logo: "/logos/avinor.svg", tall: false },
  { name: "DNB", logo: "/logos/dnb.svg", tall: false },
  { name: "Forbrukerrådet", logo: "/logos/forbrukerradet.svg", tall: false },
  { name: "Kahoot!", logo: "/logos/kahoot.svg", tall: false },
  { name: "NAV", logo: "/logos/nav.svg", tall: false },
  { name: "Norsk Gjenvinning", logo: "/logos/norskgjenvinning.png", tall: true },
  { name: "SSB", logo: "/logos/ssb.png", tall: false },
  { name: "Tine", logo: "/logos/tine.svg", tall: false },
  { name: "Telenor", logo: "/logos/telenor.svg", tall: false },
  { name: "Yr.no / NRK", logo: "/logos/yr.svg", tall: true },
];

export function ImpactSection() {
  return (
    <section id="impact" className="py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-custom-dark dark:text-white mb-4">Her er vi</h3>
          <p className="text-lg text-custom-dark/80 dark:text-white/80">
            Vi jobber med noen av Norges mest spennende bedrifter
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl divide-y divide-gray-200 dark:divide-zinc-700">
          {featured.map((c) => (
            <div key={c.name} className="grid gap-4 md:grid-cols-[180px_1fr] md:gap-10 items-center p-6 md:p-8">
              <div className="flex items-center justify-start md:justify-center h-16">
                <div className="bg-white rounded-lg px-2 py-1 flex items-center">
                  <img
                    src={c.logo}
                    alt={c.name}
                    loading="lazy"
                    className={c.tall ? 'h-16 w-auto max-w-[120px] object-contain' : 'h-11 w-auto max-w-[160px] object-contain'}
                  />
                </div>
              </div>
              <p className="text-custom-dark/80 dark:text-white/80 leading-relaxed">{c.text}</p>
            </div>
          ))}
        </div>

        <h4 className="mt-12 mb-4 text-sm font-semibold uppercase tracking-widest text-custom-dark/70 dark:text-white/70">
          Og mange flere, her er noen av dem
        </h4>
        <ul className="grid grid-cols-2 md:grid-cols-5 gap-px bg-gray-200 dark:bg-zinc-700 rounded-2xl overflow-hidden shadow-xl">
          {others.map((c) => (
            <li key={c.name} className="bg-white flex items-center justify-center h-28 px-6">
              <img
                src={c.logo}
                alt={c.name}
                loading="lazy"
                className={c.tall ? 'h-16 w-auto max-w-[65%] object-contain' : 'h-11 w-auto max-w-[80%] object-contain'}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
