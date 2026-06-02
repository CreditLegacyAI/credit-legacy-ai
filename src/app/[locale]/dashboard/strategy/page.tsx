'use client';

import { useLocale } from 'next-intl';
import { Navigation, Target, Clock } from 'lucide-react';

export default function StrategyPage() {
  const locale = useLocale();
  const isES = locale === 'es';

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center">
          <Navigation className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="text-xs text-gold uppercase tracking-wider font-medium">
            {isES ? 'El GPS' : 'The GPS'}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Strategy Generator</h1>
        </div>
      </div>
      <p className="text-graydark mb-8">
        {isES
          ? 'Tu plan personalizado paso a paso para reparar tu crédito.'
          : 'Your personalized step-by-step plan to repair your credit.'}
      </p>

      {/* Round 1 always */}
      <div className="bg-white rounded-2xl p-6 border-2 border-gold mb-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-white font-bold flex-shrink-0">
            1
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-bold text-black">
                {isES ? 'Round 1: Personal Info Cleanup' : 'Round 1: Personal Info Cleanup'}
              </h3>
              <span className="text-xs bg-gold/10 text-gold px-2 py-1 rounded-full font-medium">
                {isES ? 'OBLIGATORIO' : 'MANDATORY'}
              </span>
            </div>
            <p className="text-sm text-graydark mb-3">
              {isES
                ? 'Todo plan de reparación de crédito SIEMPRE empieza limpiando información personal incorrecta. Es la base de todo.'
                : 'Every credit repair plan ALWAYS starts by cleaning incorrect personal information. It is the foundation.'}
            </p>
            <div className="flex items-center gap-4 text-xs text-graydark">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{isES ? '30 días estimado' : '30 days estimated'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Target className="w-3 h-3" />
                <span>{isES ? 'Alta prioridad' : 'High priority'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Empty state */}
      <div className="bg-white rounded-2xl p-12 border border-gold/20 text-center">
        <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
          <Navigation className="w-8 h-8 text-gold" />
        </div>
        <h3 className="text-xl font-bold mb-2">
          {isES ? 'Completa tu Smart Audit primero' : 'Complete your Smart Audit first'}
        </h3>
        <p className="text-graydark mb-6">
          {isES
            ? 'La estrategia personalizada se genera automáticamente después de tu primer audit.'
            : 'The personalized strategy is automatically generated after your first audit.'}
        </p>
      </div>
    </div>
  );
}
