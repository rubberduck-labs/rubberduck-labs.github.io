import { SalaryCalculator } from './SalaryCalculator';
import { Mail } from 'lucide-react';
import { useState } from 'react';
import { ContactDialog } from './ContactDialog';

export function JobSection() {
  const [applyOpen, setApplyOpen] = useState(false);
  return (
    <section id="jobbe" className="min-h-screen py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Duck wanted box */}
          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-8 relative">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-repeat" style={{ 
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20v20H0V0zm10 17.5c4.142 0 7.5-3.358 7.5-7.5S14.142 2.5 10 2.5 2.5 5.858 2.5 10s3.358 7.5 7.5 7.5z' fill='%23000000' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                  backgroundSize: '20px 20px'
                }} />
              </div>

              {/* Content */}
              <div className="relative">
                <h2 className="text-3xl font-bold text-custom-dark dark:text-white mb-6">
                  Duck wanted
                </h2>
                <div className="prose prose-lg dark:prose-invert">
                  <p className="text-custom-dark/80 dark:text-white/80 mb-6">
                    Vi er et koselig lite konsulenthus med seniorutviklere som finner på mye sammen, både faglig og sosialt.
                    Og flere av oss har faktisk liv utenom jobben også.
                  </p>
                  <p className="text-custom-dark/80 dark:text-white/80 mb-6">
                    Filosofien vår er enkel. Det er du som skaper verdiene. Da skal du også ha det største kakestykket.
                    Samtidig har du verdens beste gjeng i ryggen, med tryggheten, nettverket og alle godene vi har bygget opp
                    gjennom over 20 år i bransjen. Sammenlign oss med hvem som helst. Fordelene våre står under.
                  </p>
                  <p className="text-custom-dark/80 dark:text-white/80">
                    Nå ser vi etter noen nye nebb. Derfor har vi veldig lyst til å snakke med deg som har minst 7 års erfaring,
                    henger med i tiden og elsker jobben som utvikler. Send oss et lite pip, så kan vi ta en kaffe og bli litt bedre kjent!
                  </p>
                </div>

                <div className="mt-8">
                  <button
                    type="button"
                    onClick={() => setApplyOpen(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-custom-dark text-white dark:bg-white dark:text-custom-dark rounded-full font-semibold hover:opacity-90 transition-opacity"
                  >
                    <Mail className="w-4 h-4" />
                    Send oss et pip
                  </button>
                  <ContactDialog
                    open={applyOpen}
                    onClose={() => setApplyOpen(false)}
                    kind="soknad"
                    source="jobb"
                    title="Duck wanted"
                    messageLabel="Litt om deg selv"
                    thanks="Takk for søknaden! Vi tar kontakt så snart vi kan."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Salary information */}
          <div className="mt-16 text-center">
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
          </div>
        </div>
      </div>
    </section>
  );
}
