import { useState } from 'react';
import { CustomDialog } from './CustomDialog';

interface ContactDialogProps {
  open: boolean;
  onClose: () => void;
}

const ENDPOINT = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/soknad`;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = 'idle' | 'sending' | 'done' | 'invalid' | 'error';

export function ContactDialog({ open, onClose }: ContactDialogProps) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState(''); // honeypot
  const [status, setStatus] = useState<Status>('idle');

  const close = () => {
    onClose();
    if (status === 'done') {
      setStatus('idle');
      setEmail('');
      setMessage('');
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setStatus('invalid');
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'kontakt', source: 'forsiden', email: email.trim(), message, website }),
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
    <CustomDialog open={open} onClose={close} title="Kontakt oss">
      <div className="p-4 sm:p-6">
        {status === 'done' ? (
          <p className="text-custom-dark dark:text-white">Takk! Vi tar kontakt så snart vi kan.</p>
        ) : (
          <form onSubmit={submit} noValidate className="space-y-4">
            <div>
              <label htmlFor="contact-message" className="block font-semibold mb-1 text-custom-dark dark:text-white">
                Hva kan vi hjelpe deg med?
              </label>
              <textarea
                id="contact-message"
                rows={5}
                maxLength={1000}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
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
