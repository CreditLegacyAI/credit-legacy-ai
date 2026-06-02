'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { Stethoscope, Upload, Sparkles, AlertCircle } from 'lucide-react';

export default function AuditPage() {
  const locale = useLocale();
  const isES = locale === 'es';
  const [running, setRunning] = useState(false);

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center">
          <Stethoscope className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="text-xs text-gold uppercase tracking-wider font-medium">
            {isES ? 'El Doctor' : 'The Doctor'}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Smart Audit Engine</h1>
        </div>
      </div>
      <p className="text-graydark mb-8">
        {isES
          ? 'Análisis profesional de tu reporte de crédito con inteligencia artificial.'
          : 'Professional analysis of your credit report with artificial intelligence.'}
      </p>

      {/* Coming Soon Notice */}
      <div className="bg-gold/10 border-2 border-gold/30 rounded-2xl p-6 mb-6 flex items-start gap-4">
        <AlertCircle className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
        <div>
          <h3 className="font-bold text-black mb-1">
            {isES ? 'Próximamente · Julio 2026' : 'Coming Soon · July 2026'}
          </h3>
          <p className="text-sm text-graydark">
            {isES
              ? 'La integración con Array para pulls automáticos de los 3 bureaus estará disponible próximamente. Por ahora, esta es una vista previa de cómo funcionará.'
              : 'Array integration for automatic 3-bureau pulls will be available soon. For now, this is a preview of how it will work.'}
          </p>
        </div>
      </div>

      {/* Upload area mockup */}
      <div className="bg-white rounded-2xl p-8 border-2 border-dashed border-gold/30 text-center mb-6">
        <Upload className="w-12 h-12 text-gold/50 mx-auto mb-4" />
        <h3 className="font-bold text-black mb-2">
          {isES ? 'Conexión Directa con Bureaus' : 'Direct Bureau Connection'}
        </h3>
        <p className="text-sm text-graydark mb-4">
          {isES
            ? 'Una vez activado Array, podrás conectar Equifax, Experian y TransUnion con un click.'
            : 'Once Array is active, you can connect Equifax, Experian and TransUnion with one click.'}
        </p>
        <button
          disabled
          className="bg-gold/30 text-white px-6 py-3 rounded-full font-medium cursor-not-allowed"
        >
          {isES ? 'Conectar Bureaus (Próximamente)' : 'Connect Bureaus (Coming Soon)'}
        </button>
      </div>

      {/* What you'll get preview */}
      <div className="bg-white rounded-2xl p-8 border border-gold/20">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-gold" />
          <h3 className="font-bold text-black">
            {isES ? 'Lo que recibirás:' : 'What you will get:'}
          </h3>
        </div>
        <ul className="space-y-3 text-sm text-graydark">
          <li className="flex items-start gap-2">
            <span className="text-gold flex-shrink-0">→</span>
            <span>
              {isES
                ? 'Análisis simultáneo de los 3 bureaus (Equifax, Experian, TransUnion)'
                : 'Simultaneous 3-bureau analysis (Equifax, Experian, TransUnion)'}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gold flex-shrink-0">→</span>
            <span>
              {isES
                ? 'Detección de TODOS los items disputables con precisión clínica'
                : 'Detection of ALL disputable items with clinical precision'}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gold flex-shrink-0">→</span>
            <span>
              {isES
                ? 'Priorización inteligente por impacto en tu score'
                : 'Smart prioritization by impact on your score'}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gold flex-shrink-0">→</span>
            <span>
              {isES
                ? 'Reporte ejecutivo en español o inglés'
                : 'Executive report in Spanish or English'}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gold flex-shrink-0">→</span>
            <span>
              {isES
                ? 'Strategy Generator automático con tu Round 1: Personal Info Cleanup'
                : 'Automatic Strategy Generator with your Round 1: Personal Info Cleanup'}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
