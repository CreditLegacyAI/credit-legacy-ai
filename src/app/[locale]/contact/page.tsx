'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import {
  Mail,
  MessageCircle,
  Clock,
  Send,
  Instagram,
  Youtube,
  Music2,
  Facebook,
  Linkedin,
  CheckCircle2,
} from 'lucide-react';

export default function ContactPage() {
  const t = useTranslations('Contact');
  const locale = useLocale();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message, locale }),
      });

      if (res.ok) {
        setStatus('success');
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const emails = [
    { icon: Mail, label: t('emailLabel'), value: 'hello@creditlegacy.ai' },
    { icon: Mail, label: t('emailSupport'), value: 'support@creditlegacy.ai' },
    { icon: Mail, label: t('emailLegal'), value: 'legal@creditlegacy.ai' },
    { icon: Mail, label: t('emailSecurity'), value: 'security@creditlegacy.ai' },
  ];

  const socials = [
    { icon: Instagram, label: 'Instagram', href: 'https://instagram.com/creditlegacyai' },
    { icon: Youtube, label: 'YouTube', href: 'https://youtube.com/@creditlegacyai' },
    { icon: Music2, label: 'TikTok', href: 'https://tiktok.com/@creditlegacyai' },
    { icon: Facebook, label: 'Facebook', href: 'https://facebook.com/creditlegacyai' },
    { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com/in/william-nieves-2940b63b5' },
  ];

  return (
    <>
      <Navbar />
      <main className="bg-offwhite">
        {/* Hero */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-offwhite to-white">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-black mb-4">{t('title')}</h1>
            <p className="text-lg text-graydark">{t('subtitle')}</p>
          </div>
        </section>

        {/* Form + Channels */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <div className="bg-offwhite rounded-3xl p-8 md:p-10 border border-gold/20">
              <h2 className="text-2xl font-bold text-black mb-6">{t('formTitle')}</h2>

              {status === 'success' ? (
                <div className="text-center py-12">
                  <CheckCircle2 className="w-16 h-16 text-gold mx-auto mb-4" />
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
                    className="w-full px-5 py-3 rounded-full border-2 border-gold/20 focus:border-gold focus:outline-none bg-white"
                  />
                  <input
                    type="email"
                    placeholder={t('emailPlaceholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-5 py-3 rounded-full border-2 border-gold/20 focus:border-gold focus:outline-none bg-white"
                  />
                  <input
                    type="text"
                    placeholder={t('subjectPlaceholder')}
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    className="w-full px-5 py-3 rounded-full border-2 border-gold/20 focus:border-gold focus:outline-none bg-white"
                  />
                  <textarea
                    placeholder={t('messagePlaceholder')}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={5}
                    className="w-full px-5 py-3 rounded-3xl border-2 border-gold/20 focus:border-gold focus:outline-none bg-white resize-none"
                  />
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full bg-gold hover:bg-gold-dark disabled:opacity-50 text-white py-3 rounded-full font-medium transition-all flex items-center justify-center gap-2"
                  >
                    {status === 'submitting' ? (
                      t('submitting')
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        {t('submit')}
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Channels */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-black mb-6">{t('channelsTitle')}</h2>
                <div className="space-y-3">
                  {emails.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <a
                        key={i}
                        href={`mailto:${item.value}`}
                        className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gold/20 hover:border-gold transition-all"
                      >
                        <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-gold" />
                        </div>
                        <div>
                          <p className="text-xs text-gold uppercase tracking-wider font-medium">
                            {item.label}
                          </p>
                          <p className="text-sm text-black font-medium">{item.value}</p>
                        </div>
                      </a>
                    );
                  })}

                  {/* WhatsApp */}
                  <a
                    href="https://wa.me/message/4K6L54GNI57XB1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gold/20 hover:border-gold transition-all"
                  >
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <p className="text-xs text-gold uppercase tracking-wider font-medium">
                        {t('whatsappLabel')}
                      </p>
                      <p className="text-sm text-black font-medium">{t('whatsappText')}</p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Social */}
              <div>
                <h3 className="text-lg font-bold text-black mb-4">{t('socialTitle')}</h3>
                <div className="flex flex-wrap gap-3">
                  {socials.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        className="w-11 h-11 rounded-full border border-gold/30 hover:border-gold hover:bg-gold/10 flex items-center justify-center transition-all"
                      >
                        <Icon className="w-5 h-5 text-gold" />
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Hours */}
              <div className="bg-white rounded-2xl p-5 border border-gold/20">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-5 h-5 text-gold" />
                  <h3 className="font-bold text-black">{t('hoursTitle')}</h3>
                </div>
                <p className="text-sm text-graydark">{t('hoursText')}</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
