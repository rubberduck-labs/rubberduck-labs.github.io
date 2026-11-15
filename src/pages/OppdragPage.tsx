import { useEffect, useState } from 'react';
import { ContactDialog } from '../components/ContactDialog';
import { MapPin, Calendar, Clock, Linkedin, Mail, Phone } from 'lucide-react';

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
