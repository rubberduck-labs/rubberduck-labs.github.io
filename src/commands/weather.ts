import { Command } from './types';

// Bare Oslo. Resten av landet er ikke verdt båndbredden.
const OSLO = { name: 'Oslo', lat: 59.91, lon: 10.75 };

interface WeatherData {
  temperature: number;
  symbol: string;
  windSpeed: number;
  humidity: number;
}

async function fetchOslo(): Promise<WeatherData> {
  const url = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${OSLO.lat}&lon=${OSLO.lon}`;
  const response = await fetch(url, {
    headers: { 'User-Agent': 'Rubberduck/1.0 (es@rubberduck.no)' },
  });
  const data = await response.json();

  const latest = data.properties.timeseries[0];
  const details = latest.data.instant.details;
  const symbol: string =
    latest.data.next_1_hours?.summary?.symbol_code ?? latest.data.next_6_hours?.summary?.symbol_code ?? 'cloudy';

  return {
    temperature: details.air_temperature,
    symbol,
    windSpeed: details.wind_speed,
    humidity: details.relative_humidity,
  };
}

const NORSK: Record<string, string> = {
  clearsky: 'klarvær',
  fair: 'lettskyet',
  partlycloudy: 'delvis skyet',
  cloudy: 'skyet',
  fog: 'tåke',
  lightrain: 'lett regn',
  rain: 'regn',
  heavyrain: 'kraftig regn',
  lightrainshowers: 'lette regnbyger',
  rainshowers: 'regnbyger',
  heavyrainshowers: 'kraftige regnbyger',
  lightsleet: 'lett sludd',
  sleet: 'sludd',
  heavysleet: 'kraftig sludd',
  lightsleetshowers: 'lette sluddbyger',
  sleetshowers: 'sluddbyger',
  heavysleetshowers: 'kraftige sluddbyger',
  lightsnow: 'lett snø',
  snow: 'snø',
  heavysnow: 'kraftig snø',
  lightsnowshowers: 'lette snøbyger',
  snowshowers: 'snøbyger',
  heavysnowshowers: 'kraftige snøbyger',
};

// "lightrainandthunder_night" -> "lett regn og torden"
function describe(symbol: string): string {
  const base = symbol.replace(/_(day|night|polartwilight)$/, '');
  const thunder = base.includes('thunder');
  const plain = base.replace(/(and)?thunder/, '');
  const text = NORSK[plain] ?? null;
  if (thunder) return text ? `${text} og torden` : 'torden';
  return text ?? 'skyet';
}

type Mood = 'thunder' | 'fog' | 'snow' | 'sleet' | 'heavyrain' | 'rain' | 'clear' | 'cloudy';

function moodOf(symbol: string): Mood {
  const s = symbol.replace(/_(day|night|polartwilight)$/, '');
  if (s.includes('thunder')) return 'thunder';
  if (s.includes('fog')) return 'fog';
  if (s.includes('snow')) return 'snow';
  if (s.includes('sleet')) return 'sleet';
  if (s.includes('heavyrain')) return 'heavyrain';
  if (s.includes('rain')) return 'rain';
  if (s === 'clearsky' || s === 'fair') return 'clear';
  return 'cloudy';
}

const QUIPS: Record<Mood, string[]> = {
  clear: ['Klarvær. Ikke venn deg til det.', 'Sola er ute. Gå ut, eller ikke. Jeg er en terminal.'],
  cloudy: ['Skyet. Oslo som vanlig.', 'Overskyet. Overrasker ingen.'],
  rain: ['Regn. Igjen.', 'Det regner. Du visste det.', 'Vått. Naturlig nok.'],
  heavyrain: ['Kraftig regn. Planene dine er avlyst.', 'Det pøser ned. Bli inne.'],
  snow: ['Snø. Byen er overrasket, som alltid.', 'Snø. Alt blir forsinket.'],
  sleet: ['Sludd. Været klarer ikke å bestemme seg.', 'Sludd. Det verste fra begge verdener.'],
  fog: ['Tåke. Nyt mysteriet.', 'Tåke. Sikt: dårlig. Humør: det samme.'],
  thunder: ['Torden. Dramatisk.', 'Torden. Lagre jobben din.'],
};

// Terminalen skriver linjene som HTML, så alt brukeren har skrevet må escapes.
function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
}

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function extremes(w: WeatherData): string[] {
  const extra: string[] = [];
  if (w.temperature <= 0) extra.push('Minusgrader. Ta på den ordentlige jakka.');
  if (w.temperature >= 25) extra.push('Varmt. Regn med at alle nevner det.');
  if (w.windSpeed >= 10) extra.push('Kraftig vind. Hold deg fast i noe.');
  return extra;
}

// Norsk desimalkomma: 2.5 -> "2,5"
const nb = (n: number) => String(n).replace('.', ',');

export const weatherCommand: Command = {
  name: 'weather',
  description: 'Vær i Oslo, med kommentarer',
  execute: async (args, { setLines }) => {
    const out = (content: string) => ({ content, type: 'output' as const });
    try {
      if (args.length > 0) {
        const asked = args.join(' ');
        if (asked.toLowerCase() !== 'oslo') {
          setLines(prev => [...prev, out(`${escapeHtml(asked)}? Bare Oslo. Beklager.`)]);
          return;
        }
      }

      setLines(prev => [...prev, out('Sjekker Oslo...')]);
      const w = await fetchOslo();

      setLines(prev => [
        ...prev,
        out('Oslo akkurat nå:'),
        out(`  Temperatur: ${nb(w.temperature)}°C`),
        out(`  Vær: ${describe(w.symbol)}`),
        out(`  Vind: ${nb(w.windSpeed)} m/s`),
        out(`  Luftfuktighet: ${nb(w.humidity)}%`),
        out(''),
        out(pick(QUIPS[moodOf(w.symbol)])),
        ...extremes(w).map(out),
      ]);
    } catch {
      setLines(prev => [...prev, out('Fikk ikke tak i været. Se ut av vinduet.')]);
    }
  },
};
