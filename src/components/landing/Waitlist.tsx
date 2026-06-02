'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { PartyPopper } from 'lucide-react';

export default function Waitlist() {
  const t = useTranslations('Waitlist');
  const locale = useLocale();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error' | 'duplicate'>(
    'idle'
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, locale }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setEmail('');
        setName('');
      } else if (data.code === 'duplicate') {
        setStatus('duplicate');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="waitlist" className="py-20 md:py-28 bg-gradient-to-b from-white to-offwhite">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border-2 border-gold/20 rounded-3xl p-8 md:p-12 shadow-xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-3">{t('title')}</h2>
            <p className="text-graydark">{t('subtitle')}</p>
          </div>

          {status === 'success' ? (
            <div className="text-center py-8 animate-fade-in">
              <PartyPopper className="w-16 h-16 text-gold mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gold mb-2">{t('successTitle')}</h3>
              <p className="text-graydark">{t('successMessage')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder={t('namePlaceholder')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-5 py-4 rounded-full border-2 border-gold/20 focus:border-gold focus:outline-none transition-colors text-base"
              />
              <input
                type="email"
                placeholder={t('emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-5 py-4 rounded-full border-2 border-gold/20 focus:border-gold focus:outline-none transition-colors text-base"
              />
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full bg-gold hover:bg-gold-dark disabled:opacity-50 text-white py-4 rounded-full font-medium transition-all shadow-lg hover:shadow-xl"
              >
                {status === 'submitting' ? t('submitting') : t('submit')}
              </button>

              {status === 'error' && (
                <p className="text-red-600 text-sm text-center">{t('errorMessage')}</p>
              )}
              {status === 'duplicate' && (
                <p className="text-gold text-sm text-center">{t('alreadyRegistered')}</p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
