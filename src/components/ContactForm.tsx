import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

export function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/.netlify/functions/send-to-slack', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          message,
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');
      
      setSubmitStatus('success');
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-xl">
      <h2 className="text-2xl font-bold text-custom-dark dark:text-white mb-6">
        Send oss en melding
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label 
            htmlFor="name" 
            className="block text-sm font-medium text-custom-dark dark:text-white mb-2"
          >
            Navn
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-custom-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <div>
          <label 
            htmlFor="email" 
            className="block text-sm font-medium text-custom-dark dark:text-white mb-2"
          >
            E-post
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-custom-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <div>
          <label 
            htmlFor="message" 
            className="block text-sm font-medium text-custom-dark dark:text-white mb-2"
          >
            Melding
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={5}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-custom-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`
              w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold
              ${isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-custom-dark text-white dark:bg-white dark:text-custom-dark hover:opacity-90'}
              transition-opacity
            `}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sender...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Send melding
              </>
            )}
          </button>
        </div>

        {submitStatus === 'success' && (
          <p className="text-green-600 dark:text-green-400 text-center">
            Meldingen din er sendt! Vi tar kontakt så snart som mulig.
          </p>
        )}

        {submitStatus === 'error' && (
          <p className="text-red-600 dark:text-red-400 text-center">
            Beklager, noe gikk galt. Vennligst prøv igjen senere eller send oss en e-post direkte.
          </p>
        )}
      </form>
    </div>
  );
}