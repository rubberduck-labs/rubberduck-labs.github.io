import { BookPage } from '../BookSection';

export const frontMatterChapter: BookPage[] = [
  {
    title: "Rubberduck håndbok",
    content: [
      "© 2025 Rubberduck AS",
      "Første utgave, første opplag",
      "ISBN: 978-82-02-77391-4",
      "",
      "Alle rettigheter forbeholdt.",
      "Ingen deler av denne boken kan kopieres eller distribueres uten skriftlig tillatelse.",
      "",
      "Trykk: Rubberduck Press",
      "Design: Rubberduck Creative",
      "",
      "www.rubberduck.no"
    ],
    isSpecial: true
  },
  {
    title: "The Debugging Duck",
    content: [
      "Late at night, in the monitor's glow,",
      "A coder types, his thoughts in flow.",
      "The bug persists—his mind is stuck,",
      "So he turns to his rubber duck.",
      "",
      "With careful words, he starts to explain,",
      "Each logic step, the tangled chain.",
      "The duck just listens, quiet and wise,",
      "Until the coder shouts, \"Oh! I realize!\"",
      "",
      "A missing semicolon, a misplaced brace,",
      "A loop that ran a hopeless race.",
      "With newfound clarity, code set right,",
      "The duck just smiles—another night."
    ],
    isSpecial: true
  }
];

export const introductionChapter: BookPage[] = [
  {
    title: "Introduksjon",
    content: [
      "Velkommen til Rubberduck sin håndbok! Dette er din guide til hvordan vi jobber og hva vi står for.",
      "",
      "I denne håndboken vil du finne informasjon om våre verdier og hvordan vi sammen skaper et miljø der teknologi og mennesker kan blomstre. Vi tror på å kombinere profesjonell utvikling med personlig balanse, og denne filosofien gjenspeiles i alt vi gjør.",
      "",
      "Bla videre for å lære mer om hvordan vi i Rubberduck skaper varig verdi gjennom teknologi og innovasjon."
    ]
  },
  {
    title: "Innholdsfortegnelse",
    content: [
      "Kapittel 1: Våre verdier",
      "• Noe du brenner for",
      "• Et sted du kan vokse",
      "• Et liv utenom",
      "",
      "Kapittel 2: Lønn og goder",
      "• Provisjonslønn",
      "• Goder",
      "• Forsikringer",
      "",
      "Hver del representerer en grunnleggende del av vår filosofi og måten vi jobber på. Sammen danner de fundamentet for hvordan vi skaper verdi for våre ansatte og kunder."
    ]
  }
];

export const valuesChapter: BookPage[] = [
  {
    title: "Noe du brenner for",
    content: [
      "I Rubberduck har du stor frihet til å påvirke egen hverdag. Vi tror at en forutsetning for å lage gode løsninger sammen med kundene våre, er at du er engasjert og motivert for å lære. Derfor vil vi at du skal arbeide med fagfelt eller bransjer som interesserer deg. Dersom du trives og opplever at du utgjør en forskjell, gjør du en bedre jobb. Enkelt og greit.",
      "",
      "Hos oss betyr dette:",
      "",
      "• Oppdrag velges, de tildeles ikke",
      "• Du har alltid det beste utstyret for jobben",
      "• Vi har en flat struktur - kort vei til beslutninger"
    ]
  },
  {
    title: "Et sted du kan vokse",
    content: [
      "Vi vil ha de flinkeste folka og ta godt vare på dem. Best mulig og ikke flest mulig mennesker, er en av våre grunntanker. Det er du og din kunnskap som driver oss videre.",
      "",
      "Derfor praktiserer vi:",
      "",
      "• Stor frihet til å velge kurs og konferanser",
      "• Kurs, sertifiseringer og kontinuerlig læring",
      "• Ekstra motivert for noe? Bruk tid på det!"
    ]
  }
];

export const salaryBenefitsChapter: BookPage[] = [
  {
    title: "Provisjonslønn",
    content: [
      "I Rubberduck tilbyr vi en attraktiv provisjonsbasert lønnsmodell som sikrer deg en konkurransedyktig inntekt basert på din innsats og kompetanse.",
      "",
      "Vår lønnsmodell fungerer slik:",
      "",
      "• Du får 70% av det du fakturerer",
      "• Fra dette trekkes feriepenger og arbeidsgiveravgift",
      "• Resten er din lønn",
      "",
      "For å gi deg ekstra trygghet mellom oppdrag:",
      "",
      "• Garantert dagsats på 3000 NOK i opptil to måneder mellom oppdrag",
      "• Dette gir deg ro til å finne det rette neste oppdraget"
    ]
  },
  {
    title: "Goder",
    content: [
      "Som ansatt i Rubberduck får du tilgang til en rekke verdifulle goder som gjør hverdagen enklere og bedre:",
      "",
      "• Dekket kollektivbillett innenfor Viken",
      "• Fri mobil (bruk og datatrafikk)",
      "• Dekket bredbånd hjemme",
      "• Kjempegod forsikringspakke",
      "• 5% sparing til tjenestepensjon (OTP) som tillegg til lønn",
      "• Dekket årlig helsesjekk"
    ]
  },
  {
    title: "Forsikringer",
    content: [
      "Vi tar vare på deg og dine med en omfattende forsikringspakke. I tillegg til de lovpålagte forsikringene har vi:",
      "",
      "• Helse/behandlingsforsikring",
      "• Yrkesskade",
      "• Reise inkl familie",
      "• Fritidsulykke",
      "• Dødsfall pga sykdom",
      "• Invaliditet og uførhet pga sykdom",
      "• Gruppelivsforsikring",
      "",
      "Denne forsikringspakken gir deg og din familie trygghet i hverdagen og sikkerhet hvis noe uforutsett skulle skje."
    ]
  }
];

export const bookChapters = {
  frontMatter: frontMatterChapter,
  introduction: introductionChapter,
  values: valuesChapter,
  salaryBenefits: salaryBenefitsChapter
};