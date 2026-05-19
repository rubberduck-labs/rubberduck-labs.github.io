import { useEffect, useState } from 'react';
import { MapPin, Calendar, Clock, ExternalLink, Mail } from 'lucide-react';

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
      {/* Newsletter */}
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

      {/* Slack */}
      <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-6 flex flex-col gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-5 h-5 text-custom-dark dark:text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
            </svg>
            <h2 className="text-lg font-bold text-custom-dark dark:text-white">Slack-app</h2>
          </div>
          <p className="text-sm text-custom-dark/70 dark:text-white/70">
            Installer Slack-appen vår og få nye oppdrag rett i din Slack-workspace.
          </p>
        </div>
        <div className="mt-auto">
          <a
            href="#"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-200 dark:border-zinc-600 text-custom-dark dark:text-white rounded-full text-sm font-semibold hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
          >
            Installer Slack-appen
          </a>
        </div>
      </div>
    </div>
  );
}

function AssignmentCard({ assignment }: { assignment: Assignment }) {
  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-6 flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-bold text-custom-dark dark:text-white mb-1">
          {assignment.title}
        </h2>
        <p className="text-custom-dark/70 dark:text-white/70 font-medium">
          {assignment.company}
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
        {assignment.expectedDuration && (
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4 shrink-0" />
            {assignment.expectedDuration}
          </span>
        )}
      </div>

      {assignment.llmDescription && (
        <p className="text-custom-dark/80 dark:text-white/80 text-sm leading-relaxed">
          {assignment.llmDescription}
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

      {assignment.link && (
        <div className="mt-auto pt-2">
          <a
            href={assignment.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-custom-dark text-white dark:bg-white dark:text-custom-dark rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Se oppdrag
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      )}
    </div>
  );
}

export function OppdragPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-custom-dark dark:text-white mb-4">
              Ledige oppdrag
            </h1>
            <p className="text-lg text-custom-dark/80 dark:text-white/80">
              Freelance? Dette er oppdrag vi har ledig akkurat nå.
            </p>
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
            <div className="flex flex-col gap-6">
              {assignments.map((assignment) => (
                <AssignmentCard key={assignment.id} assignment={assignment} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
