import { useEffect, useRef, useState } from 'react';
import { CustomDialog } from './CustomDialog';
import { track } from '../utils/track';

interface ContactDialogProps {
  open: boolean;
  onClose: () => void;
  /** «kontakt» er en henvendelse, «soknad» en jobbsøknad. De går til hver sin Slack-kanal. */
  kind?: 'kontakt' | 'soknad';
  /** Hvor skjemaet står, så vi ser det i Slack-meldingen. */
  source?: string;
  title?: string;
  messageLabel?: string;
  thanks?: string;
  /** Ferdig utfylt tekst i meldingsfeltet hver gang dialogen åpnes. */
  defaultMessage?: string;
}

const ENDPOINT = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/soknad`;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = 'idle' | 'sending' | 'done' | 'noname' | 'invalid' | 'error';

export function ContactDialog({
  open,
  onClose,
  kind = 'kontakt',
  source = 'forsiden',
  title = 'Kontakt oss',
  messageLabel = 'Hva kan vi hjelpe deg med?',
  thanks = 'Takk! Vi tar kontakt så snart vi kan.',
  defaultMessage = '',
}: ContactDialogProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(defaultMessage);

  // Hver gang dialogen åpnes starter feltet med den ferdige teksten.
  useEffect(() => {
    if (open) setMessage(defaultMessage);
  }, [open, defaultMessage]);
  const [website, setWebsite] = useState(''); // honeypot
  const [status, setStatus] = useState<Status>('idle');
  const started = useRef(false); // «Begynte å skrive» telles én gang per åpning

  const close = () => {
    started.current = false;
    onClose();
    if (status === 'done') {
      setStatus('idle');
      setName('');
      setEmail('');
      setMessage(defaultMessage);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Søknader trenger et navn, så vi vet hvem vi snakker med. Henvendelser sender det ikke.
    if (kind === 'soknad' && !name.trim()) {
      setStatus('noname');
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setStatus('invalid');
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: kind, source, name: kind === 'soknad' ? name.trim() : undefined, email: email.trim(), message, website }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  const inputClass =
    'w-full rounded-md border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-custom-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-custom-dark dark:focus:ring-white';

  return (
    <CustomDialog open={open} onClose={close} title={title}>
      <div className="p-4 sm:p-6">
        {status === 'done' ? (
          <p className="text-custom-dark dark:text-white">{thanks}</p>
        ) : (
          <form onSubmit={submit} noValidate className="space-y-4">
            {kind === 'soknad' && (
              <div>
                <label htmlFor="contact-name" className="block font-semibold mb-1 text-custom-dark dark:text-white">
                  Navn
                </label>
                <input
                  id="contact-name"
                  type="text"
                  autoComplete="name"
                  maxLength={100}
                  placeholder="Fornavn og etternavn"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                />
              </div>
            )}
            <div>
              <label htmlFor="contact-message" className="block font-semibold mb-1 text-custom-dark dark:text-white">
                {messageLabel}
              </label>
              <textarea
                id="contact-message"
                rows={5}
                maxLength={1000}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (!started.current && e.target.value.length > 10) {
                    started.current = true;
                    track('message_started', kind === 'soknad' ? 'Duck wanted' : 'Kontakt');
                  }
                }}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="block font-semibold mb-1 text-custom-dark dark:text-white">
                E-post
              </label>
              <input
                id="contact-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </div>
            <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
              <label>
                Ikke fyll ut
                <input type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
              </label>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={status === 'sending'}
                className="inline-flex h-11 items-center justify-center px-6 bg-custom-dark text-white dark:bg-white dark:text-custom-dark rounded-full font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {status === 'sending' ? 'Sender …' : 'Send'}
              </button>
              <p role="status" aria-live="polite" className="text-sm text-custom-dark/80 dark:text-white/80">
                {status === 'noname' && 'Skriv navnet ditt.'}
                {status === 'invalid' && 'Sjekk at e-postadressen er riktig.'}
                {status === 'error' && 'Noe gikk galt. Send oss en e-post på hei@rubberduck.no i stedet.'}
              </p>
            </div>
          </form>
        )}
      </div>
    </CustomDialog>
  );
}
