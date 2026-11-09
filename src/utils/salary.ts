const provisionRate = 0.7;
// 1,261 = 1 + 12 % feriepenger + 14,1 % arbeidsgiveravgift, begge regnet av lønnen.
const magicNumber = 1.261;
const vacationRate = 0.12;
export const salaryFactor = magicNumber;

export function calculateProvision(rate: number, hours: number) {
    const userTurnover = rate * hours;
    const provisionBase = (userTurnover * provisionRate);
    const provisionValue = provisionBase / magicNumber;
    const userProvision = "Lønn: " + Math.round(provisionValue).toLocaleString("no-NO") + " kr";
    const total = "Totalt: " + Math.round(provisionValue).toLocaleString("no-NO") + " kr";
 
    return {
        provision: userProvision,
        total: total,
        rawValue: Math.round(provisionValue)
    };
}

// Samme regnestykke som over, delt opp i trinnene som vises på /kalkulator.
export function calculateBreakdown(rate: number, hours: number) {
    const turnover = rate * hours;
    const provisionBase = turnover * provisionRate;
    const salary = provisionBase / magicNumber;
    const vacationPay = salary * vacationRate;
    const employerTax = provisionBase - salary - vacationPay;

    return { turnover, provisionBase, salary, vacationPay, employerTax };
}
