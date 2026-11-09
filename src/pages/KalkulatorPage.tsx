import { useState } from 'react';
import { SalaryCalculator } from '../components/SalaryCalculator';
import { calculateBreakdown } from '../utils/salary';

const nok = (n: number) => Math.round(n).toLocaleString('no-NO') + ' kr';

export function KalkulatorPage() {
  const [input, setInput] = useState({ rate: 1600, hours: 1600 });
  const b = calculateBreakdown(input.rate, input.hours);
  const box = 'bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-8';
  const text = 'text-custom-dark/80 dark:text-white/80';

  return (
    <section className="min-h-screen py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold text-custom-dark dark:text-white mb-4">
              Slik regner vi ut lønnen din
            </h1>
            <p className={`text-lg ${text} max-w-2xl`}>
              Lønnen i Rubberduck følger det du fakturerer. Prøv selv under, og se hvordan tallet blir til.
            </p>
          </div>

          <SalaryCalculator onChange={(rate, hours) => setInput({ rate, hours })} />

          <div className={box}>
            <h2 className="text-2xl font-bold text-custom-dark dark:text-white mb-4">Regnestykket</h2>
            <ol className={`list-decimal pl-6 flex flex-col gap-2 ${text}`}>
              <li>Vi starter med det du fakturerer: timerate ganger antall timer.</li>
              <li>Av det tar vi 70 %.</li>
              <li>Feriepenger (12 % av lønnen) og arbeidsgiveravgift (14,1 % av lønnen) betales av de 70 %.</li>
              <li>Det som er igjen, er årslønnen din.</li>
            </ol>
            <p className="mt-6 font-mono text-custom-dark dark:text-white">
              årslønn = fakturert × 0,7 ÷ 1,261
            </p>
            <p className={`mt-3 ${text}`}>
              Tallet 1,261 er 1 + 0,12 + 0,141: lønnen selv, feriepengene og arbeidsgiveravgiften. Begge
              påslagene regnes av lønnen, og derfor deler vi på 1,261 i stedet for å trekke 26,1 % fra de 70 %.
            </p>
          </div>

          <div className={box}>
            <h2 className="text-2xl font-bold text-custom-dark dark:text-white mb-1">Eksempel</h2>
            <p className={`mb-4 ${text}`}>
              {nok(input.rate)} i timen og {input.hours.toLocaleString('no-NO')} timer i året.
              Endre tallene i kalkulatoren over, så følger eksempelet med.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left tabular-nums text-custom-dark dark:text-white">
                <tbody className="divide-y divide-custom-dark/10 dark:divide-white/10">
                  <tr>
                    <td className="py-3 pr-4">Fakturert i året</td>
                    <td className="py-3 text-right">{nok(b.turnover)}</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">70 % av fakturert</td>
                    <td className="py-3 text-right">{nok(b.provisionBase)}</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Feriepenger (12 % av lønnen)</td>
                    <td className="py-3 text-right">− {nok(b.vacationPay)}</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Arbeidsgiveravgift (14,1 % av lønnen)</td>
                    <td className="py-3 text-right">− {nok(b.employerTax)}</td>
                  </tr>
                  <tr className="font-bold">
                    <td className="py-3 pr-4">Årslønn</td>
                    <td className="py-3 text-right">{nok(b.salary)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className={box}>
            <h2 className="text-2xl font-bold text-custom-dark dark:text-white mb-4">I tillegg</h2>
            <ul className={`list-disc pl-6 flex flex-col gap-2 ${text}`}>
              <li>Pensjon kommer på toppen av lønnen: 5 % av lønn frem til 7 G og 10 % mellom 7 og 12 G.</li>
              <li>Beløpene over er før skatt.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
