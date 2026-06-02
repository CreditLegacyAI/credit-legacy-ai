'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { Dumbbell, Send, Sparkles } from 'lucide-react';

export default function CoachPage() {
  const locale = useLocale();
  const isES = locale === 'es';
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'coach'; content: string }[]>([
    {
      role: 'coach',
      content: isES
        ? '¡Hola! Soy tu AI Credit Coach. Estoy aquí 24/7 para responder cualquier pregunta sobre tu crédito. ¿En qué puedo ayudarte hoy?'
        : "Hi! I'm your AI Credit Coach. I'm here 24/7 to answer any question about your credit. How can I help you today?",
    },
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setMessages([
      ...messages,
      { role: 'user', content: message },
      {
        role: 'coach',
        content: isES
          ? '(Próximamente) Esta función se activará en septiembre 2026 con integración completa de Claude AI.'
          : '(Coming soon) This feature will be activated in September 2026 with full Claude AI integration.',
      },
    ]);
    setMessage('');
  };

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto h-screen flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center">
          <Dumbbell className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="text-xs text-gold uppercase tracking-wider font-medium">
            {isES ? 'El Entrenador' : 'The Coach'}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">AI Credit Coach</h1>
        </div>
      </div>

      {/* Chat container */}
      <div className="flex-1 bg-white rounded-2xl border border-gold/20 flex flex-col overflow-hidden mb-4">
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-gold text-white'
                    : 'bg-offwhite text-graydark border border-gold/20'
                }`}
              >
                {msg.role === 'coach' && (
                  <div className="flex items-center gap-1 mb-1 text-xs text-gold font-medium">
                    <Sparkles className="w-3 h-3" />
                    Coach AI
                  </div>
                )}
                <p className="text-sm">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} className="border-t border-gold/20 p-4 flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={isES ? 'Escribe tu pregunta...' : 'Type your question...'}
            className="flex-1 px-4 py-2 rounded-full border-2 border-gold/20 focus:border-gold focus:outline-none"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="bg-gold hover:bg-gold-dark disabled:opacity-50 text-white p-3 rounded-full transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
