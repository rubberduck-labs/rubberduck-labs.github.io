import { useEffect, useState } from 'react';
import { ContactDialog } from '../components/ContactDialog';
import { MapPin, Calendar, Check, Clock, Linkedin, Mail, Phone, X } from 'lucide-react';

interface Assignment {
  id: string;
  title: string;
  company: string;
  description: string;
  applicationDeadlineDate: string | null;
  expectedDuration: string | null;
  location: string | null;
  tags: string[];
}

function formatDate(dateStr: string | null): string | null {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return date.toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', year: 'numeric' });
}


// Titlene kommer rett fra anbudene: «Konkurranse - … - DPS» og referansenumre foran. Vi rydder bare i visningen, ikke i dataene.
function cleanTitle(raw: string): { title: string; ref: string | null } {
  let t = raw.trim();
  let ref: string | null = null;
  const m = t.match(/^(E-\d+-\d+|\d{2}-\d{3}-\d{3})\s*[:\-–]?\s*/i);
  if (m) {
    ref = m[1];
    t = t.slice(m[0].length);
  }
  t = t.replace(/^Konkurranse\s*[-–]\s*/i, '').replace(/\s*[-–]\s*DPS$/i, '').trim();
  return { title: t || raw.trim(), ref };
}

const hasDuration = (d: string | null) => !!d && d.trim().toLowerCase() !== 'ukjent';

function AssignmentCard({ assignment, onClick }: { assignment: Assignment; onClick: () => void }) {
  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-6 flex flex-col gap-4 h-full">
      <div>
        <h2 className="text-xl font-bold text-custom-dark dark:text-white mb-1">
          {cleanTitle(assignment.title).title}
        </h2>
        <p className="text-custom-dark/70 dark:text-white/70 font-medium">
          {assignment.company}
          {cleanTitle(assignment.title).ref && (
            <span className="ml-2 text-xs font-normal text-custom-dark/50 dark:text-white/50">Ref. {cleanTitle(assignment.title).ref}</span>
          )}
        </p>
      </div>

      <div className="flex flex-wrap gap-3 text-sm text-custom-dark/70 dark:text-white/70">
        {assignment.location && (
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4 shrink-0" />
            {assignment.location}
          </span>
        )}
        {assignment.applicationDeadlineDate && (
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4 shrink-0" />
            Frist: {formatDate(assignment.applicationDeadlineDate)}
          </span>
        )}
        {hasDuration(assignment.expectedDuration) && (
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4 shrink-0" />
            {assignment.expectedDuration}
          </span>
        )}
      </div>

      {assignment.description ? (
        <p className="text-custom-dark/80 dark:text-white/80 text-sm leading-relaxed">
          {assignment.description}
        </p>
      ) : (
        <p className="text-custom-dark/50 dark:text-white/50 text-sm leading-relaxed">
          Vi har ikke en kort beskrivelse av dette oppdraget ennå. Si fra, så sender vi deg det vi har.
        </p>
      )}

      {assignment.tags && assignment.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {assignment.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-xs font-medium bg-yellow-100 dark:bg-zinc-700 text-custom-dark dark:text-white rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto pt-2">
        <button
          onClick={onClick}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-custom-dark text-white dark:bg-white dark:text-custom-dark rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Jeg vil gjerne høre mer
        </button>
      </div>
    </div>
  );
}

function ContactSection() {
  return (
    <div>
      <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-6 flex flex-col items-center justify-center gap-4 text-center h-full">
        <img
          src="/espen-isolated.png"
          alt="Espen Schulstad"
          className="w-32 h-32 rounded-full object-contain bg-custom-yellow/30 shrink-0"
        />
        <div className="flex flex-col items-center gap-5">
          <p className="text-sm text-custom-dark dark:text-white">
            Snakk med vår selger <span className="font-semibold">Espen Schulstad</span> om muligheter for oppdrag. Han tar gjerne en prat om markedet og eventuelle samarbeid også.
          </p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm font-medium text-custom-dark dark:text-white">
            <a href="mailto:hei@rubberduck.no" className="inline-flex items-center gap-1.5 hover:underline">
              <Mail className="w-4 h-4" />
              hei@rubberduck.no
            </a>
            <a href="tel:+4722301010" className="inline-flex items-center gap-1.5 hover:underline">
              <Phone className="w-4 h-4" />
              +47 22 30 10 10
            </a>
            <a
              href="https://www.linkedin.com/in/schulstad"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:underline"
            >
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

interface Etterspurt {
  oppdatert: string;
  dager: number;
  oppdrag: number;
  ord: { t: string; n: number }[];
}

function WordCloud() {
  const [data, setData] = useState<Etterspurt | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}etterspurt.json`)
      .then((res) => (res.ok ? res.json() : null))
      .then(setData)
      .catch(() => setData(null));
  }, []);

  if (!data || data.ord.length === 0) return null;

  const max = data.ord[0].n;
  const min = data.ord[data.ord.length - 1].n;
  const size = (n: number) => 0.8 + (2.2 * (n - min)) / Math.max(1, max - min);
  const tone = (n: number) =>
    n > max * 0.6
      ? 'text-custom-dark dark:text-white font-extrabold'
      : n > max * 0.3
        ? 'text-custom-dark/80 dark:text-white/80 font-bold'
        : 'text-custom-dark/55 dark:text-white/55 font-semibold';
  // Alfabetisk rekkefølge gir en blandet, men stabil, sky.
  const words = [...data.ord].sort((a, b) => a.t.localeCompare(b.t, 'nb'));

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-6 h-full flex flex-col gap-3">
      <div>
        <h2 className="text-lg font-bold text-custom-dark dark:text-white">Hva etterspørres nå?</h2>
        <p className="text-xs text-custom-dark/60 dark:text-white/60">
          Teknologier i {data.oppdrag} oppdrag de siste {data.dager} dagene.
        </p>
      </div>
      <ul
        className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 leading-tight"
        aria-label="Mest etterspurte teknologier"
      >
        {words.map((w) => (
          <li
            key={w.t}
            title={`${w.n} oppdrag`}
            className={tone(w.n)}
            style={{ fontSize: `${size(w.n).toFixed(2)}rem` }}
          >
            {w.t}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SubscribeSection() {
  return (
    <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2">
      <ContactSection />
      <WordCloud />
    </div>
  );
}

const FRI_GODER = [
  { title: 'Oppdrag', text: 'Vi finner oppdrag til deg gjennom vårt nettverk av samarbeidspartnere og anbud vi har vunnet.', frilanser: 'Du må finne oppdragene selv.' },
  { title: 'Lønn mellom oppdrag', text: 'Vi har ordninger for lønn mellom oppdrag.', frilanser: 'Ingen lønn mellom oppdrag.' },
  { title: 'Pensjon på toppen av lønnen', text: '5 % av lønn frem til 7 G og 10 % mellom 7 og 12 G.', frilanser: 'Pensjon må du ordne og spare selv.' },
  { title: 'Forsikringer', text: 'Blant annet fritidsulykke, yrkesskade, gruppeliv, behandling og sykdom.', frilanser: 'Forsikringer må du ordne selv.' },
  { title: 'Utstyr og bredbånd', text: 'Laptop og mobil fra øverste hylle, 10 000 kr per år til annet utstyr, bredbånd og månedskort.', frilanser: 'Utstyr og bredbånd betaler du selv.' },
  { title: 'Claude, ChatGPT Pro og annen programvare', text: 'Dekkes i tillegg til utstyrsbudsjettet.', frilanser: 'Programvare betaler du selv.' },
  { title: 'Regnskapsfører og AS', text: 'Vi tar oss av det.', frilanser: 'Du må ha egen regnskapsfører og eget AS.' },
  { title: 'Årlig tur', text: 'Du er med hele gjengen på årlig tur.', frilanser: 'Du er invitert på sosiale ting, men ikke på den årlige turen.' },
  { title: 'Hytta', text: 'Du har tilgang til hytta.', frilanser: 'Ingen tilgang til hytta.' },
];

function FreelanceVsFast() {
  const [pct, setPct] = useState<70 | 90>(70);
  const fast = pct === 70;
  const goder = 90 - pct;

  const pil = ((pct + goder / 2) / 90) * 100;

  return (
    <section
      aria-labelledby="fri-tittel"
      className="mt-12 min-w-0 rounded-xl bg-white p-6 text-custom-dark shadow-sm dark:bg-zinc-800 dark:text-white md:p-8"
    >
      <h2 id="fri-tittel" className="text-xl font-bold">
        Freelance eller fast ansatt?
      </h2>
      <p className="mt-1 text-sm text-custom-dark/70 dark:text-white/70">
        Du er enten freelance eller fast ansatt, og du velger selv. Er du god nok til å bli videreformidlet av oss, er du også god nok til å jobbe hos oss.
      </p>

      <fieldset className="mt-5 inline-block">
        <legend className="sr-only">Fast ansatt eller freelance</legend>
        <div className="inline-flex rounded-full bg-custom-dark/10 p-1 dark:bg-white/10">
          {([70, 90] as const).map((value) => (
            <label key={value} className="relative cursor-pointer">
              <input
                type="radio"
                name="fri-ansettelsesform"
                value={value}
                checked={pct === value}
                onChange={() => setPct(value)}
                aria-controls="fri-fordeling"
                className="peer sr-only"
              />
              <span className="block rounded-full px-4 py-1.5 text-sm font-semibold text-custom-dark/70 peer-checked:bg-custom-dark peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-custom-dark dark:text-white/70 dark:peer-checked:bg-custom-yellow dark:peer-checked:text-custom-dark dark:peer-focus-visible:outline-custom-yellow">
                {value === 70 ? 'Fast ansatt' : 'Freelance'}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div id="fri-fordeling" className="mt-6">
        <div aria-live="polite" aria-atomic="true" className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-3xl font-bold leading-none tabular-nums">{pct}&nbsp;%</span>
          <p className="max-w-xl text-sm leading-relaxed text-custom-dark/70 dark:text-white/70">
            {fast
              ? 'av fakturert. Av det går arbeidsgiveravgift, og resten er lønn og feriepenger.'
              : 'av det som faktureres er ditt. De siste 10 % er vår formidlingsfee.'}
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-[7rem_minmax(0,1fr)]">
          <div
            role="img"
            aria-label={
              fast
                ? 'Fast ansatt: 70 prosent er ditt, og 20 prosentpoeng går til godene i listen.'
                : 'Freelance: 90 prosent av fakturert er ditt. De siste 10 prosentene er vår formidlingsfee. Godene i listen ordner du selv.'
            }
            className="relative h-10 md:h-auto md:min-h-80"
          >
            <div aria-hidden="true" className="flex h-full overflow-hidden rounded-md text-xs font-semibold md:flex-col">
              <div
                style={{ flex: `${pct} 1 0%` }}
                className="flex min-h-0 min-w-0 items-center justify-center bg-custom-dark text-white transition-[flex] duration-300 dark:bg-white dark:text-custom-dark"
              >
                Ditt
              </div>
              {fast && (
                <div
                  style={{ flex: `${goder} 1 0%` }}
                  className="flex min-h-0 min-w-0 items-center justify-center bg-custom-yellow text-custom-dark"
                >
                  Goder
                </div>
              )}
            </div>

            {fast && (
              <>
                <svg
                  aria-hidden="true"
                  focusable="false"
                  viewBox="0 0 12 32"
                  preserveAspectRatio="none"
                  className="absolute top-full h-8 w-3 -translate-x-1/2 text-custom-dark/50 dark:text-white/50 md:hidden"
                  style={{ left: `${pil}%` }}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M6 0v30m-4-5 4 5 4-5" />
                </svg>
                <svg
                  aria-hidden="true"
                  focusable="false"
                  viewBox="0 0 32 12"
                  preserveAspectRatio="none"
                  className="absolute left-full hidden h-3 w-8 -translate-y-1/2 text-custom-dark/50 dark:text-white/50 md:block"
                  style={{ top: `${pil}%` }}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M0 6h30m-5-4 5 4-5 4" />
                </svg>
              </>
            )}
          </div>

          <div className="relative min-w-0 pt-6 md:pl-6 md:pt-0">
            {fast && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-2 border-x border-t border-custom-dark/40 dark:border-white/40 md:inset-y-0 md:left-0 md:right-auto md:h-auto md:w-2 md:border-x-0 md:border-b md:border-l"
              />
            )}
            <h3 className="text-base font-semibold">
              {fast ? 'De 20 prosentene dekker:' : 'Som freelance ordner du alt dette selv:'}
            </h3>
            <ul className="mt-5 grid gap-x-8 gap-y-5 lg:grid-cols-2">
              {FRI_GODER.map((benefit) => (
                <li key={benefit.title} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                      fast ? 'bg-custom-yellow text-custom-dark' : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300'
                    }`}
                  >
                    {fast ? <Check className="h-3 w-3" strokeWidth={2.5} /> : <X className="h-3 w-3" strokeWidth={2.5} />}
                  </span>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold leading-snug">{benefit.title}</h4>
                    <p className="mt-1 text-sm leading-relaxed text-custom-dark/75 dark:text-white/75">
                      {fast ? benefit.text : benefit.frilanser}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export function OppdragPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Assignment | null>(null);

  useEffect(() => {
    const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/WebsiteListings?published=eq.true&order=createdAt.desc`;
    fetch(url, {
      headers: {
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Noe gikk galt (${res.status})`);
        return res.json();
      })
      .then((data) => setAssignments(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="min-h-screen py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-custom-dark dark:text-white">
              Ledige oppdrag
            </h1>
          </div>

          <SubscribeSection />

          {loading && (
            <div className="flex justify-center py-24">
              <div className="w-8 h-8 rounded-full border-4 border-custom-dark/20 dark:border-white/20 border-t-custom-dark dark:border-t-white animate-spin" />
            </div>
          )}

          {error && (
            <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-8 text-center">
              <p className="text-custom-dark/70 dark:text-white/70">
                Kunne ikke laste oppdrag. Prøv igjen senere.
              </p>
            </div>
          )}

          {!loading && !error && assignments.length === 0 && (
            <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-8 text-center">
              <p className="text-2xl mb-3">🦆</p>
              <p className="text-custom-dark/70 dark:text-white/70 font-medium">
                Ingen ledige oppdrag akkurat nå.
              </p>
              <p className="text-custom-dark/50 dark:text-white/50 text-sm mt-1">
                Sjekk tilbake snart!
              </p>
            </div>
          )}

          {!loading && !error && assignments.length > 0 && (
            <h2 className="mb-5 text-2xl font-bold text-custom-dark dark:text-white">
              Akkurat nå ser vi etter
            </h2>
          )}

          {!loading && !error && assignments.length > 0 && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {assignments.map((assignment) => (
                <AssignmentCard
                  key={assignment.id}
                  assignment={assignment}
                  onClick={() => setSelected(assignment)}
                />
              ))}
            </div>
          )}

          <section
            aria-labelledby="vilkar-tittel"
            className="mt-12 min-w-0 rounded-xl bg-white p-6 shadow-sm dark:bg-zinc-800 md:p-8"
          >
            <h2 id="vilkar-tittel" className="text-xl font-bold text-custom-dark dark:text-white">
              Når du går via Rubberduck
            </h2>
            <dl className="mt-5 divide-y divide-custom-dark/10 dark:divide-white/15">
              {[
                { title: 'må du ha gode referanser eller kjenne oss personlig', text: '' },
                { title: 'forventer vi at du er hyggelig og grei, empatisk og konstruktiv, og har god arbeidsmoral', text: '' },
                { title: 'tar vi 10 % formidlingsfee', text: 'Vi er åpne om hva vi fakturerer kunden, og du kan se vår andel også.' },
                { title: 'er vi din støttespiller', text: 'Vi hjelper deg også med CV-en din, og er din champion.' },
                { title: 'får du tilgang til vår Slack', text: 'Du blir også invitert med på sosiale ting til tider.' },
              ].map((term) => (
                <div key={term.title} className="grid min-w-0 gap-2 py-5 first:pt-0 last:pb-0 md:grid-cols-5 md:gap-8">
                  <dt className={`min-w-0 break-words text-base font-semibold leading-snug text-custom-dark dark:text-white ${term.text ? 'md:col-span-2' : 'md:col-span-5'}`}>
                    {term.title}
                  </dt>
                  {term.text && (
                    <dd className="min-w-0 break-words text-sm leading-relaxed text-custom-dark/75 dark:text-white/75 md:col-span-3">
                      {term.text}
                    </dd>
                  )}
                </div>
              ))}
            </dl>
            <p className="mt-5 border-t border-custom-dark/10 pt-5 text-sm text-custom-dark/70 dark:border-white/15 dark:text-white/70">Vi er opptatt av ryddighet og transparens.</p>
          </section>

          <FreelanceVsFast />
        </div>
      </div>

      <ContactDialog
        open={selected !== null}
        onClose={() => setSelected(null)}
        kind="kontakt"
        source="oppdrag"
        title="Jeg vil gjerne høre mer"
        messageLabel="Melding"
        defaultMessage={
          selected
            ? `Hei! Jeg vil gjerne høre mer om oppdraget «${cleanTitle(selected.title).title}»${selected.company ? ` hos ${selected.company}` : ''}.`
            : ''
        }
        thanks="Takk! Vi tar kontakt så snart vi kan."
      />
    </section>
  );
}
