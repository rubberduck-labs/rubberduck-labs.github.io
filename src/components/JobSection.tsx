import { SalaryCalculator } from './SalaryCalculator';
import { Mail } from 'lucide-react';
import { useState } from 'react';
import { ContactDialog } from './ContactDialog';

const ctaClass =
  'inline-flex w-full sm:w-auto min-h-12 items-center justify-center gap-2 px-6 py-3 bg-custom-dark text-white dark:bg-white dark:text-custom-dark rounded-full font-semibold hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-custom-dark dark:focus-visible:ring-white';

const INTRO = [
  'Vi er et koselig lite konsulenthus med seniorutviklere som finner på mye sammen, både faglig og sosialt. Og flere av oss har faktisk liv utenom jobben også.',
  'Filosofien vår er enkel. Det er du som skaper verdiene. Da skal du også ha det største kakestykket. Samtidig har du verdens beste gjeng i ryggen, med tryggheten, nettverket og alle godene vi har bygget opp gjennom over 20 år i bransjen. Sammenlign oss med hvem som helst. Fordelene våre står under.',
  'Nå ser vi etter noen nye nebb. Vi leter etter deg med fullstack-bakgrunn som bruker AI aktivt i arbeidshverdagen, har minst 7 års erfaring og elsker jobben som utvikler. Jobber du allerede som konsulent, er det bare positivt. Send oss et lite pip, så kan vi ta en kaffe og bli litt bedre kjent!',
];

export function JobSection() {
  const [applyOpen, setApplyOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const apply = (
    <button type="button" onClick={() => setApplyOpen(true)} className={ctaClass}>
      <Mail className="w-4 h-4" aria-hidden="true" />
      Send oss et pip
    </button>
  );

  return (
    <section id="jobbe" className="py-6 sm:py-24 sm:min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Duck wanted box */}
          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-5 sm:p-8 relative">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5 pointer-events-none" aria-hidden="true">
                <div className="absolute inset-0 bg-repeat" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20v20H0V0zm10 17.5c4.142 0 7.5-3.358 7.5-7.5S14.142 2.5 10 2.5 2.5 5.858 2.5 10s3.358 7.5 7.5 7.5z' fill='%23000000' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                  backgroundSize: '20px 20px'
                }} />
              </div>

              {/* Content */}
              <div className="relative">
                <h2 className="text-3xl font-bold text-custom-dark dark:text-white mb-4 sm:mb-6">
                  Duck wanted
                </h2>
                {/* På mobil vises teksten kortet ned med «…» og «Les mer». Fra sm og opp vises alt. */}
                {!expanded && (
                  <p id="duck-tekst-kort" className="sm:hidden line-clamp-6 text-lg text-custom-dark/80 dark:text-white/80">
                    {INTRO.join(' ')}
                  </p>
                )}
                <div id="duck-tekst" className={`${expanded ? '' : 'hidden sm:block'} space-y-6 text-lg text-custom-dark/80 dark:text-white/80`}>
                  {INTRO.map((text) => <p key={text}>{text}</p>)}
                </div>
                <button
                  type="button"
                  onClick={() => setExpanded((v) => !v)}
                  aria-expanded={expanded}
                  aria-controls={expanded ? 'duck-tekst' : 'duck-tekst-kort'}
                  className="sm:hidden mt-2 min-h-11 text-base font-semibold text-custom-dark underline underline-offset-2 dark:text-white"
                >
                  {expanded ? 'Vis mindre' : 'Les mer'}
                </button>

                <div className="mt-4 sm:mt-8">
                  {apply}
                </div>
              </div>
            </div>
          </div>

          {/* Salary information */}
          <div className="mt-10 sm:mt-16 text-center">
            <h3 className="text-2xl font-bold text-custom-dark dark:text-white mb-6">
              Provisjonslønn
            </h3>
            <p className="text-lg text-custom-dark/80 dark:text-white/80 mb-4">
              I Rubberduck tilbyr vi provisjonslønn til våre ansatte.
            </p>
            <p className="text-base text-custom-dark/70 dark:text-white/70 max-w-2xl mx-auto mb-4">
              For å komme frem til din provisjonslønn så tar vi utgangspunkt i 70 % av det du fakturerer.
              Av det går arbeidsgiveravgift, og resten er lønn og feriepenger.
            </p>
            <p className="text-base text-custom-dark/70 dark:text-white/70 max-w-2xl mx-auto mb-8">
              Vi har ordninger for lønn mellom oppdrag,
              slik at du kan føle deg trygg i perioder mellom oppdrag.
            </p>

            <SalaryCalculator />

            <div className="mt-10 flex justify-center">{apply}</div>
          </div>

          <ContactDialog
            open={applyOpen}
            onClose={() => setApplyOpen(false)}
            kind="soknad"
            source="jobb"
            title="Duck wanted"
            messageLabel="Litt om deg selv"
            messageHelp="Hva liker du å jobbe med? Et par setninger holder."
            thanks="Takk for søknaden! Vi tar kontakt så snart vi kan."
          />
        </div>
      </div>
    </section>
  );
}
