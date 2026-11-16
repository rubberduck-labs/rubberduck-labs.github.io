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
  /** Kort hjelpetekst under meldingsfeltet, som blir stående mens man skriver. */
  messageHelp?: string;
  thanks?: string;
  /** Ferdig utfylt tekst i meldingsfeltet. Gjelder bare så lenge man ikke har skrevet noe selv. */
  defaultMessage?: string;
}

const ENDPOINT = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/soknad`;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = 'idle' | 'sending' | 'done' | 'error';
type Errors = { name?: string; email?: string };

export function ContactDialog({
  open,
  onClose,
  kind = 'kontakt',
  source = 'forsiden',
  title = 'Kontakt oss',
  messageLabel = 'Hva kan vi hjelpe deg med?',
  messageHelp,
  thanks = 'Takk! Vi tar kontakt så snart vi kan.',
  defaultMessage = '',
}: ContactDialogProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(defaultMessage);
  const [website, setWebsite] = useState(''); // honeypot
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Errors>({});
  const started = useRef(false); // «Begynte å skrive» telles én gang per åpning
  const touched = useRef(false); // har brukeren skrevet i meldingsfeltet selv?
  const lastDefault = useRef(defaultMessage);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  // Det man har skrevet blir stående når dialogen lukkes og åpnes igjen, helt til meldingen er sendt.
  // Den ferdige teksten brukes bare så lenge man ikke har skrevet selv, eller når den endrer seg (annet oppdrag).
  useEffect(() => {
    if (defaultMessage !== lastDefault.current) {
      lastDefault.current = defaultMessage;
      touched.current = false;
    }
    if (open && !touched.current) setMessage(defaultMessage);
  }, [open, defaultMessage]);

  // Etter sending flyttes fokus til takketeksten, så det blir lest opp og tastaturet lukkes.
  useEffect(() => {
    if (status === 'done') doneRef.current?.focus();
  }, [status]);

  const close = () => {
    started.current = false;
    onClose();
    if (status === 'done') {
      setStatus('idle');
      setName('');
      setEmail('');
      touched.current = false;
      setMessage(defaultMessage);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Søknader trenger et navn, så vi vet hvem vi snakker med. Henvendelser sender det ikke.
    const found: Errors = {};
    if (kind === 'soknad' && !name.trim()) found.name = 'Skriv navnet ditt.';
    if (!EMAIL_RE.test(email.trim())) found.email = 'Sjekk at e-postadressen er riktig.';
    setErrors(found);
    if (found.name) { nameRef.current?.focus(); return; }
    if (found.email) { emailRef.current?.focus(); return; }

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
    'w-full min-h-12 rounded-md border border-gray-400 dark:border-zinc-500 bg-white dark:bg-zinc-800 px-3 py-2.5 text-custom-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-custom-dark dark:focus:ring-white aria-[invalid=true]:border-red-600 dark:aria-[invalid=true]:border-red-400';
  const labelClass = 'block font-semibold mb-1 text-custom-dark dark:text-white';
  const errorClass = 'mt-1 text-sm font-medium text-red-700 dark:text-red-300';

  return (
    <CustomDialog open={open} onClose={close} title={title}>
      <div className="p-4 sm:p-6">
        {status === 'done' ? (
          <div ref={doneRef} tabIndex={-1} role="status" className="focus:outline-none">
            <p className="text-lg font-semibold text-custom-dark dark:text-white">{thanks}</p>
            <button
              type="button"
              onClick={close}
              className="mt-6 inline-flex h-12 w-full sm:w-auto items-center justify-center px-6 bg-custom-dark text-white dark:bg-white dark:text-custom-dark rounded-full font-semibold hover:opacity-90 transition-opacity"
            >
              Lukk
            </button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="space-y-4">
            {kind === 'soknad' && (
              <div>
                <label htmlFor="contact-name" className={labelClass}>
                  Navn
                </label>
                <input
                  ref={nameRef}
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  autoCapitalize="words"
                  maxLength={100}
                  placeholder="Fornavn og etternavn"
                  value={name}
                  onChange={(e) => { setName(e.target.value); if (errors.name) setErrors({ ...errors, name: undefined }); }}
                  aria-invalid={errors.name ? true : undefined}
                  aria-describedby={errors.name ? 'contact-name-error' : undefined}
                  className={inputClass}
                />
                {errors.name && <p id="contact-name-error" role="alert" className={errorClass}>{errors.name}</p>}
              </div>
            )}
            <div>
              <label htmlFor="contact-email" className={labelClass}>
                E-post
              </label>
              <input
                ref={emailRef}
                id="contact-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
                placeholder="navn@epost.no"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: undefined }); }}
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={errors.email ? 'contact-email-error' : undefined}
                className={inputClass}
              />
              {errors.email && <p id="contact-email-error" role="alert" className={errorClass}>{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="contact-message" className={labelClass}>
                {messageLabel}
              </label>
              {messageHelp && (
                <p id="contact-message-help" className="mb-1 text-sm text-custom-dark/70 dark:text-white/70">{messageHelp}</p>
              )}
              <textarea
                id="contact-message"
                name="message"
                rows={4}
                maxLength={1000}
                value={message}
                aria-describedby={messageHelp ? 'contact-message-help' : undefined}
                onChange={(e) => {
                  touched.current = true;
                  setMessage(e.target.value);
                  if (!started.current && e.target.value.length > 10) {
                    started.current = true;
                    track('message_started', kind === 'soknad' ? 'Duck wanted' : 'Kontakt');
                  }
                }}
                className={inputClass}
              />
            </div>
            <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
              <label>
                Ikke fyll ut
                <input type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
              </label>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <button
                type="submit"
                disabled={status === 'sending'}
                className="inline-flex h-12 w-full sm:w-auto items-center justify-center px-6 bg-custom-dark text-white dark:bg-white dark:text-custom-dark rounded-full font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {status === 'sending' ? 'Sender …' : status === 'error' ? 'Prøv igjen' : 'Send'}
              </button>
              <p role="status" aria-live="polite" className="text-sm text-custom-dark/80 dark:text-white/80">
                {status === 'error' && (
                  <>
                    Noe gikk galt, men det du skrev er ikke borte. Prøv igjen, eller send oss en e-post på{' '}
                    <a className="font-medium underline underline-offset-2" href="mailto:hei@rubberduck.no">hei@rubberduck.no</a>.
                  </>
                )}
              </p>
            </div>
          </form>
        )}
      </div>
    </CustomDialog>
  );
}
