import React from 'react';
import { SalaryCalculator } from './SalaryCalculator';
import { Mail } from 'lucide-react';
import { WalkingDuck } from './WalkingDuck';

export function JobSection() {
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
                    Vi ser etter utviklere, gjerne med erfaring fra Java, Kotlin, Python, Go eller JavaScript. 
                    Du er faglig dyktig, positiv og utadvendt, og du er sulten etter å lære mer. 
                    Som person er du selvdreven og nysgjerrig og du tar initiativ til å dele din kunnskap med kolleger.
                  </p>
                  <p className="text-custom-dark/80 dark:text-white/80 mb-6">
                    Vi ønsker deg med minimum 5 år erfaring og relevant utdannelse fra høyskole eller universitet.
                  </p>
                  <p className="text-custom-dark/80 dark:text-white/80">
                    Interessert? Send oss noen linjer om deg selv, så tar vi kontakt
                  </p>
                </div>

                <div className="mt-8">
                  <a
                    href="mailto:hei@rubberduck.no"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-custom-dark text-white dark:bg-white dark:text-custom-dark rounded-full font-semibold hover:opacity-90 transition-opacity"
                  >
                    <Mail className="w-4 h-4" />
                    Send oss en e-post
                  </a>
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
              For å komme frem til din provisjonslønn så tar vi utgangspunkt i 70% av det du fakturerer, 
              og trekker fra feriepenger og arbeidsgiveravgift. Det som gjenstår er ditt.
            </p>
            <p className="text-base text-custom-dark/70 dark:text-white/70 max-w-2xl mx-auto mb-8">
              Mellom oppdrag sikrer vi deg med en dagsats på 3000 NOK i opptil to måneder, 
              slik at du kan føle deg trygg i perioder mellom oppdrag.
            </p>

            <SalaryCalculator />
          </div>
        </div>
      </div>
    </section>
  );
}