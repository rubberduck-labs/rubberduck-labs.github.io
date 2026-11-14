import { useEffect, useState } from 'react';
import { MapPin, Calendar, Clock, Mail, X } from 'lucide-react';

interface Assignment {
  id: string;
  title: string;
  company: string;
  llmDescription: string;
  link: string | null;
  source: string;
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

function AssignmentModal({ assignment, onClose }: { assignment: Assignment; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-6 pb-0">
          <div>
            <h2 className="text-2xl font-bold text-custom-dark dark:text-white mb-1">
              {cleanTitle(assignment.title).title}
            </h2>
            <p className="text-custom-dark/70 dark:text-white/70 font-medium">
              {assignment.company}
              {cleanTitle(assignment.title).ref && (
                <span className="ml-2 text-xs font-normal text-custom-dark/50 dark:text-white/50">Ref. {cleanTitle(assignment.title).ref}</span>
              )}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-full transition-colors shrink-0 ml-4"
          >
            <X className="w-5 h-5 text-custom-dark dark:text-white" />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5">
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

          {assignment.llmDescription ? (
            <p className="text-custom-dark/80 dark:text-white/80 leading-relaxed">
              {assignment.llmDescription}
            </p>
          ) : (
            <p className="text-custom-dark/60 dark:text-white/60 leading-relaxed">
              Vi har ikke en kort beskrivelse av dette oppdraget ennå. Ta kontakt, så sender vi deg det vi har.
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

          <div className="pt-2 border-t border-gray-100 dark:border-zinc-700">
            <a
              href={`mailto:hei@rubberduck.no?subject=Interesse for oppdrag: ${encodeURIComponent(assignment.title)}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-custom-dark text-white dark:bg-white dark:text-custom-dark rounded-full font-semibold hover:opacity-90 transition-opacity"
            >
              <Mail className="w-4 h-4" />
              Kontakt oss
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

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

      {assignment.llmDescription ? (
        <p className="text-custom-dark/80 dark:text-white/80 text-sm leading-relaxed line-clamp-3">
          {assignment.llmDescription}
        </p>
      ) : (
        <p className="text-custom-dark/50 dark:text-white/50 text-sm leading-relaxed">
          Ingen beskrivelse ennå. Åpne oppdraget for å ta kontakt.
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
          Se oppdrag
        </button>
      </div>
    </div>
  );
}

function SubscribeSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'duplicate'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/Subscribers`, {
      method: 'POST',
      headers: {
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ email }),
    });

    if (res.status === 201) {
      setStatus('success');
      setEmail('');
    } else if (res.status === 409) {
      setStatus('duplicate');
    } else {
      setStatus('error');
    }
  };

  return (
    <div className="mb-12 md:max-w-md">
      <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-6 flex flex-col gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Mail className="w-5 h-5 text-custom-dark dark:text-white" />
            <h2 className="text-lg font-bold text-custom-dark dark:text-white">Nyhetsbrev</h2>
          </div>
          <p className="text-sm text-custom-dark/70 dark:text-white/70">
            Vi varsler deg på e-post når nye oppdrag er tilgjengelige.
          </p>
        </div>

        {status === 'success' ? (
          <p className="text-green-600 dark:text-green-400 text-sm font-medium">
            🎉 Du er påmeldt!
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => { setEmail(e.target.value); setStatus('idle'); }}
              placeholder="din@epost.no"
              className="w-full px-4 py-2.5 rounded-full border border-gray-200 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-custom-dark dark:text-white placeholder-custom-dark/40 dark:placeholder-white/40 outline-none focus:ring-2 focus:ring-custom-dark/20 dark:focus:ring-white/20 text-sm"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-custom-dark text-white dark:bg-white dark:text-custom-dark rounded-full text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {status === 'loading' ? 'Sender...' : 'Meld meg på'}
            </button>
            {status === 'duplicate' && (
              <p className="text-xs text-custom-dark/60 dark:text-white/60 text-center">
                Denne e-postadressen er allerede påmeldt.
              </p>
            )}
            {status === 'error' && (
              <p className="text-xs text-red-500 dark:text-red-400 text-center">
                Noe gikk galt. Prøv igjen senere.
              </p>
            )}
          </form>
        )}
      </div>

    </div>
  );
}

export function OppdragPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Assignment | null>(null);

  useEffect(() => {
    const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/Assignments?isDirect=eq.true&status=eq.ACTIVE&order=publishedDate.desc`;
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
            <h1 className="text-3xl md:text-4xl font-bold text-custom-dark dark:text-white mb-4">
              Ledige oppdrag
            </h1>
            <p className="text-lg text-custom-dark/80 dark:text-white/80">
              Freelance? Dette er oppdrag vi har ledig akkurat nå.
            </p>
            {!loading && !error && assignments.length > 0 && (
              <p className="mt-2 text-sm font-medium text-custom-dark/60 dark:text-white/60">
                {assignments.length} {assignments.length === 1 ? 'ledig oppdrag' : 'ledige oppdrag'}
              </p>
            )}
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

      {selected && (
        <AssignmentModal assignment={selected} onClose={() => setSelected(null)} />
      )}
    </section>
  );
}
