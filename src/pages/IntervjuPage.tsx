import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SlotPicker } from '../components/SlotPicker';
import {
  formatDay, formatRange, googleCalendarUrl, icsFile,
  type BookedSlot, type Slot,
} from '../utils/interview';

const ENDPOINT = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/intervju`;

type State = { name: string | null; expired: boolean; locked: boolean; booked: BookedSlot | null; slots: Slot[]; minutes: number };
type Load = { kind: 'loading' } | { kind: 'invalid' } | { kind: 'error' } | { kind: 'ready'; state: State };

async function call(body: Record<string, string>): Promise<{ status: number; json: unknown }> {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return { status: res.status, json: await res.json().catch(() => ({})) };
}

const card = 'rounded-xl bg-white p-6 shadow-sm dark:bg-zinc-800 md:p-8';
const primary =
  'rounded-md bg-custom-dark px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 dark:bg-white dark:text-custom-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-custom-dark focus-visible:ring-offset-2';
const secondary =
  'rounded-md border border-custom-dark/25 px-5 py-2.5 text-sm font-semibold text-custom-dark transition-colors hover:border-custom-dark dark:border-white/25 dark:text-white dark:hover:border-white focus:outline-none focus-visible:ring-2 focus-visible:ring-custom-dark dark:focus-visible:ring-white';

function Message({ title, text }: { title: string; text: string }) {
  return (
    <div className={card}>
      <h1 className="text-2xl font-bold text-custom-dark dark:text-white">{title}</h1>
      <p className="mt-3 text-custom-dark/75 dark:text-white/75">{text}</p>
    </div>
  );
}

function Booked({ slot, locked, canChange, onChange }: { slot: BookedSlot; locked: boolean; canChange: boolean; onChange: () => void }) {
  const download = () => {
    const url = URL.createObjectURL(new Blob([icsFile(slot)], { type: 'text/calendar;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'intervju-rubberduck.ics';
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className={card}>
      <h1 className="text-2xl font-bold text-custom-dark dark:text-white">Da er det avtalt</h1>
      <p className="mt-4 text-lg font-semibold text-custom-dark dark:text-white">{formatDay(slot.starts_at)}</p>
      <p className="text-lg tabular-nums text-custom-dark dark:text-white">kl. {formatRange(slot)}</p>
      <p className="mt-1 text-xs text-custom-dark/60 dark:text-white/60">Norsk tid</p>

      {slot.meet_url && (
        <p className="mt-5 text-custom-dark/80 dark:text-white/80">
          Vi møtes på Google Meet:{' '}
          <a className="font-medium underline underline-offset-2 break-all" href={slot.meet_url} target="_blank" rel="noopener noreferrer">
            {slot.meet_url}
          </a>
        </p>
      )}

      <p className="mt-6 text-sm font-semibold text-custom-dark dark:text-white">Legg den i kalenderen din, så glemmer du den ikke</p>
      <div className="mt-3 flex flex-wrap gap-3">
        <a className={primary} href={googleCalendarUrl(slot)} target="_blank" rel="noopener noreferrer">Google Kalender</a>
        <button type="button" className={secondary} onClick={download}>Last ned .ics (Apple, Outlook)</button>
      </div>

      <p className="mt-8 border-t border-custom-dark/10 pt-5 text-sm text-custom-dark/70 dark:border-white/15 dark:text-white/70">
        {canChange ? (
          <>
            Passer det ikke likevel?{' '}
            <button type="button" onClick={onChange} className="font-medium underline underline-offset-2">Velg en annen tid</button>
          </>
        ) : locked ? (
          'Det er under et døgn til, så tiden kan ikke endres her. Trenger du å flytte den, ta kontakt med oss.'
        ) : (
          'Trenger du å flytte den, ta kontakt med oss.'
        )}
      </p>
    </div>
  );
}

export function IntervjuPage() {
  const { token = '' } = useParams();
  const [load, setLoad] = useState<Load>({ kind: 'loading' });
  const [selected, setSelected] = useState<Slot | null>(null);
  const [changing, setChanging] = useState(false);
  const [sending, setSending] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);

  // Siden skal ikke havne i søk.
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => { meta.remove(); };
  }, []);

  const fetchState = useCallback(async () => {
    try {
      const { status, json } = await call({ action: 'get', token });
      if (status === 404) return setLoad({ kind: 'invalid' });
      if (status !== 200) return setLoad({ kind: 'error' });
      setLoad({ kind: 'ready', state: json as State });
    } catch {
      setLoad({ kind: 'error' });
    }
  }, [token]);

  useEffect(() => { void fetchState(); }, [fetchState]);

  const confirm = async () => {
    if (!selected) return;
    setSending(true);
    setProblem(null);
    try {
      const { status, json } = await call({ action: 'book', token, startsAt: selected.starts_at });
      if (status === 200) {
        setLoad({ kind: 'ready', state: json as State });
        setSelected(null);
        setChanging(false);
      } else {
        const code = (json as { error?: string }).error;
        setProblem(
          code === 'taken' || code === 'unavailable'
            ? 'Den tiden ble akkurat tatt. Velg en annen.'
            : code === 'expired'
              ? 'Invitasjonen har utløpt.'
              : 'Noe gikk galt. Prøv igjen om litt.',
        );
        setSelected(null);
        await fetchState();
      }
    } catch {
      setProblem('Noe gikk galt. Prøv igjen om litt.');
    } finally {
      setSending(false);
    }
  };

  let content: JSX.Element;
  if (load.kind === 'loading') {
    content = (
      <div className="flex justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-custom-dark/20 border-t-custom-dark dark:border-white/20 dark:border-t-white" />
      </div>
    );
  } else if (load.kind === 'invalid') {
    content = <Message title="Vi finner ikke invitasjonen" text="Lenken ser ikke riktig ut. Sjekk at du har kopiert hele, eller ta kontakt med oss." />;
  } else if (load.kind === 'error') {
    content = <Message title="Noe gikk galt" text="Vi fikk ikke hentet tidene akkurat nå. Prøv å laste siden på nytt om litt." />;
  } else {
    const { state } = load;
    if (state.booked && !changing) {
      content = (
        <Booked
          slot={state.booked}
          locked={state.locked}
          canChange={!state.expired && !state.locked && state.slots.length > 0}
          onChange={() => setChanging(true)}
        />
      );
    } else if (state.expired && !state.booked) {
      content = <Message title="Invitasjonen har utløpt" text="Ta kontakt med oss, så finner vi en ny tid." />;
    } else if (state.slots.length === 0) {
      content = <Message title={state.name ? `Hei ${state.name}` : 'Hei'} text="Det er ingen ledige tider akkurat nå. Ta kontakt med oss, så finner vi en som passer." />;
    } else {
      content = (
        <div className={card}>
          <h1 className="text-2xl font-bold text-custom-dark dark:text-white">{state.name ? `Hei ${state.name}` : 'Hei'}</h1>
          <p className="mt-3 text-custom-dark/75 dark:text-white/75">
            {changing ? 'Velg en ny tid, så flytter vi avtalen.' : `Velg en tid som passer for en prat. Det tar omtrent ${state.minutes} minutter, på Google Meet.`}
          </p>
          <p className="mt-1 text-xs text-custom-dark/60 dark:text-white/60">Alle tider er i norsk tid.</p>

          <div className="mt-6">
            <SlotPicker slots={state.slots} selectedStart={selected?.starts_at ?? null} onSelect={setSelected} />
          </div>

          {problem && <p role="alert" className="mt-5 text-sm font-medium text-red-700 dark:text-red-300">{problem}</p>}

          <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-custom-dark/10 pt-6 dark:border-white/15">
            {selected ? (
              <>
                <p className="text-sm text-custom-dark dark:text-white">
                  <span>{formatDay(selected.starts_at)}</span> kl. {formatRange(selected)}
                </p>
                <button type="button" className={primary} disabled={sending} onClick={confirm}>
                  {sending ? 'Booker …' : 'Bekreft tiden'}
                </button>
              </>
            ) : (
              <p className="text-sm text-custom-dark/60 dark:text-white/60">Velg en tid over.</p>
            )}
            {changing && (
              <button type="button" className="text-sm underline underline-offset-2 text-custom-dark dark:text-white" onClick={() => { setChanging(false); setSelected(null); setProblem(null); }}>
                Behold den jeg har
              </button>
            )}
          </div>
        </div>
      );
    }
  }

  return (
    <section className="min-h-screen py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl">{content}</div>
      </div>
    </section>
  );
}
