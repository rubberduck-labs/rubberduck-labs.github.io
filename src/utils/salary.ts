const provisionRate = 0.7;
const magicNumber = 1.261;

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