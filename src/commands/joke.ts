import { Command } from './types';

// Norske vitser, lagret i appen så kommandoen alltid virker og ikke avhenger av en tredjepart.
const JOKES = [
  // Klassikerne
  'Hva sa mannen som falt ned fra et tak i tredje etasje?\n«Hittil går det bra.»',
  'Hvorfor gikk kyllingen over veien?\nFor å komme seg til den andre siden.',
  'Doktor, jeg tror jeg er en hund!\n«Legg deg ned i sofaen, så snakker vi om det.»\n«Jeg får ikke lov til å sitte i sofaen.»',
  'Hva sa den ene veggen til den andre?\n«Vi møtes i hjørnet.»',
  'Hva kaller man en bjørn uten tenner?\nEn gummibjørn.',
  'Hva sier du til en mann med to hoder?\n«Hei, hei!»',
  'Hvorfor tok Pelle med seg en stige på skolen?\nFor å komme på videregående.',
  'Læreren: «Hvis jeg har fem epler og gir deg tre, hva har du da?»\nPelle: «Tre epler.»\nLæreren: «Nei, du har to.»\nPelle: «Nei, jeg har tre. Jeg vet jo hva jeg har.»',
  'Hvorfor kunne ikke skjelettet gå på ball?\nHan hadde ingen å danse med, og heller ingen kropp å danse med.',
  'Hva er grønt og har hjul?\nGress. Jeg lyver om hjulene.',
  'Hva sier en nordmann når han er veldig fornøyd?\n«Joda, det går an.»\nOg når han er helt ekstatisk?\n«Ikke dårlig.»',
  'Hvorfor setter nordmenn seg alltid ytterst på benken?\nSå de slipper å sitte ved siden av noen.',
  'Hvordan kjenner du igjen en nordmann på bussen?\nHan står, selv om det er ledig sete ved siden av en fremmed.',
  'Hvorfor har nordmenn så mange ord for snø?\nFordi de ikke har noe annet å snakke om enn været.',
  'Hvorfor tar man med termos på tur?\nDen holder maten varm om vinteren og kald om sommeren.\nMen hvordan vet den det?',
  'Hva sa den ene tomaten til den andre på vei over veien?\n«Kom igjen, ketchup!»',
  'Pelle kom for sent til skolen. Læreren spurte hvorfor.\n«Det sto et skilt: Skole, kjør sakte.»',
  'Hva sa mannen som ble overkjørt av en dampvals?\n«Nå føler jeg meg flat.»',
  'Hva sa 0 til 8?\n«Fint belte!»',
  'Hva er svart og hvitt og lest over alt?\nEn avis.',
  'Hva er det lengste ordet på norsk?\n«Mandag». Det føles evig.',
  'Ola: «Jeg tror ikke på reinkarnasjon.»\nKari: «Det sa du i forrige liv også.»',
  'Hva kaller du åtte hobbyer?\nEn hobbyte.',
  'Hva er forskjellen på teori og praksis?\nI teorien er det ingen forskjell, men i praksis er det det.',
  // For utviklere
  'Det er bare 10 typer mennesker.\nDe som forstår binære tall, og de som ikke gjør det.',
  'Hvor mange utviklere trengs for å bytte en lyspære?\nIngen. Det er et hardwareproblem.',
  'Jeg har en vits om UDP.\nJeg vet ikke om du får den.',
  'Hva er et rekursivt problem?\nSe «rekursivt problem».',
  'Hva er forskjellen på en junior og en senior?\nSenioren vet hvilken kode som ikke må røres på fredag.',
  'Hva kaller man en utvikler som ikke tester koden sin?\nProduksjonen.',
  'En tester går inn i en bar. Han bestiller en øl. 0 øl. 99999 øl. -1 øl. En firfisle.\nSå går en kunde inn og spør hvor toalettet er. Baren tar fyr.',
  'Hvorfor ble gummianda så god på feilsøking?\nDen sa aldri imot, den bare lyttet.',
  '«Det virker på min maskin!»\n«Da sender vi maskinen din til kunden.»',
  'Det finnes to vanskelige problemer i informatikk: cache-invalidering, navngiving og feil med én for lite eller én for mye.',
  'En SQL-spørring går inn i en bar, ser to tabeller og spør:\n«Kan jeg joine dere?»',
  'Jeg skulle fortelle en vits om NULL.\nMen det er ingenting i den.',
  'Utvikleren fikk beskjed: «Kjøp en liter melk. Hvis de har egg, kjøp seks.»\nHan kom hjem med seks liter melk.\n«De hadde egg.»',
  'Hvorfor bruker ikke utviklere solkrem?\nDe jobber i dark mode.',
  'Hvorfor ble gummianda aldri sint?\nDen lot alt prelle av.',
  'Kunden ba om en liten endring.\nDet tok tre uker.',
  'Hvor mange testere trengs for å skru inn en lyspære?\nIngen. De rapporterer bare at rommet er mørkt.',
  'Hvorfor tror utviklere at jul og halloween er det samme?\nFordi Oct 31 er lik Dec 25.',
];

let last = -1;

function pick(): string {
  let i = Math.floor(Math.random() * JOKES.length);
  if (i === last) i = (i + 1) % JOKES.length;
  last = i;
  return JOKES[i];
}

export const jokeCommand: Command = {
  name: 'joke',
  description: 'Fortell en norsk vits',
  execute: async (_, { setLines }) => {
    setLines(prev => [...prev, { content: pick(), type: 'output' }]);
  }
};
