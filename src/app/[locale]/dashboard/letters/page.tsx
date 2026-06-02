'use client';

import { useLocale } from 'next-intl';
import { FileText, Download, Clock } from 'lucide-react';

export default function LettersPage() {
  const locale = useLocale();
  const isES = locale === 'es';

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center">
          <FileText className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            {isES ? 'Cartas FCRA' : 'FCRA Letters'}
          </h1>
        </div>
      </div>
      <p className="text-graydark mb-8">
        {isES
          ? 'Cartas profesionales generadas con AI. Formato carta personal de consumidor.'
          : 'Professional letters generated with AI. Personal consumer letter format.'}
      </p>

      {/* Format info */}
      <div className="bg-white rounded-2xl p-6 border border-gold/20 mb-6">
        <h3 className="font-bold text-black mb-3 flex items-center gap-2">
          <FileText className="w-5 h-5 text-gold" />
          {isES ? 'Especificaciones de las cartas' : 'Letter specifications'}
        </h3>
        <ul className="space-y-2 text-sm text-graydark">
          <li className="flex items-start gap-2">
            <span className="text-gold">•</span>
            <span>Times New Roman 12pt · {isES ? 'márgenes 1 pulgada' : '1 inch margins'}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gold">•</span>
            <span>
              {isES
                ? 'En inglés (formato legal estándar US)'
                : 'In English (standard US legal format)'}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gold">•</span>
            <span>
              {isES
                ? 'Apariencia de carta personal (NO corporativa)'
                : 'Personal letter appearance (NOT corporate)'}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gold">•</span>
            <span>
              {isES
                ? 'Solicitan manual investigation (NO e-OSCAR)'
                : 'Request manual investigation (NOT e-OSCAR)'}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gold">•</span>
            <span>
              {isES
                ? 'Una carta por disputed item, citas FCRA en bold con § symbol'
                : 'One letter per disputed item, FCRA citations in bold with § symbol'}
            </span>
          </li>
        </ul>
      </div>

      {/* Empty state */}
      <div className="bg-white rounded-2xl p-12 border border-gold/20 text-center">
        <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-gold" />
        </div>
        <h3 className="text-xl font-bold mb-2">
          {isES ? 'No hay cartas generadas todavía' : 'No letters generated yet'}
        </h3>
        <p className="text-graydark">
          {isES
            ? 'Las cartas se generan automáticamente desde el Strategy Generator.'
            : 'Letters are automatically generated from the Strategy Generator.'}
        </p>
      </div>
    </div>
  );
}
