# Credit Legacy AI

> Plataforma SaaS bilingüe de reparación de crédito con inteligencia artificial.
> Diseñada para la comunidad hispana. FCRA compliant. ITIN friendly. 100% transparente.

[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js%2014-black)](https://nextjs.org)
[![Powered by Claude](https://img.shields.io/badge/Powered%20by-Claude%20Sonnet%204.5-AD7B49)](https://anthropic.com)
[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-AD7B49)](#license)

---

## ¿Qué es Credit Legacy AI?

Credit Legacy AI es una división de **Nieves Legacy Partners LLC** que ofrece reparación de crédito DIY (Do It Yourself) con inteligencia artificial. Combina las herramientas más poderosas del mercado en una plataforma bilingüe (Español/Inglés) accesible para la comunidad hispana.

**Filosofía**: Ayudar a la mayor cantidad de personas posible en el menor tiempo posible. Anti-extractivo: si no usas tu plan, te avisamos para bajarlo. Cero tarifas ocultas.

---

## Las 4 herramientas

### Smart Audit Engine · "El Doctor"
Analiza tu reporte de los 3 bureaus y detecta TODO lo disputable con precisión clínica.

### Strategy Generator · "El GPS"
Genera tu plan personalizado paso a paso. Round 1 siempre: Personal Info Cleanup.

### AI Credit Coach · "El Entrenador"
Tips semanales, alertas y gamificación. Chatbot bilingüe 24/7.

### Credit Health Guardian · "El Guardián"
Te protege incluso después de cancelar. Tu crédito nunca queda solo.

---

## Quick start

```bash
# Clonar
git clone https://github.com/CreditLegacyAI/credit-legacy-ai.git
cd credit-legacy-ai

# Instalar
npm install

# Configurar env
cp .env.example .env.local
# Editar .env.local con tus keys reales

# Correr Supabase migrations
# Ver: supabase/README.md

# Dev server
npm run dev
```

Para guía completa de setup, ver [`docs/SETUP.md`](docs/SETUP.md).

---

## Stack

- **Next.js 14** (App Router) + **TypeScript** + **Tailwind CSS**
- **Supabase** (PostgreSQL + Auth + Storage)
- **Anthropic Claude Sonnet 4.5** para IA
- **next-intl** para bilingüe ES/EN
- **Vercel** para hosting
- **Cloudflare** para DNS

---

## Documentación

| Doc | Propósito |
|-----|-----------|
| [`docs/SETUP.md`](docs/SETUP.md) | Setup paso a paso desde cero |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Estructura del proyecto y decisiones |
| [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) | Deploy a Vercel y dominios |
| [`docs/TROUBLESHOOTING.md`](docs/TROUBLESHOOTING.md) | Errores comunes y soluciones |
| [`supabase/README.md`](supabase/README.md) | Database schema y migrations |

---

## Roadmap

| Phase | Período | Estado |
|-------|---------|--------|
| **v0.1** · MVP Landing + Auth + Dashboard skeleton | Mayo 2026 | ✅ Done |
| **v0.2** · Landing completo + Auth + Dashboard mockups + Legal + Schemas | Junio 2026 | ✅ Done |
| **v0.3** · Array integration + Smart Audit funcional | Julio 2026 | 🔄 In progress |
| **v0.4** · Strategy + Letters (.docx export) | Agosto 2026 | ⏳ Planned |
| **v0.5** · AI Coach completo + Stripe billing | Sep-Oct 2026 | ⏳ Planned |
| **v1.0** · Public launch | 15 abril 2028 | 🎯 Target |

---

## Compliance

- **FCRA** (Fair Credit Reporting Act): cumplimiento documentado en `/legal/fcra`
- **CROA** (Credit Repair Organizations Act): cartas en formato consumer personal
- **Puerto Rico Ley Núm. 236**: OCIF licensing cuando aplique
- **CPN Detection**: rechazo automático en validación (CPN es ilegal bajo FCRA)
- **Manual investigation**: todas las cartas solicitan investigación manual, NO e-OSCAR

---

## Filosofía anti-extractiva

A diferencia de servicios tradicionales que maximizan revenue empujando upgrades, Credit Legacy AI:

- Sugiere **downgrade** cuando el usuario no usa todas las features de su tier
- Muestra **transparencia total** de precios sin tarifas ocultas
- Permite **cancelación con un click** sin retención agresiva
- Mantiene plan **Monitoring ($9.99/mo)** post-reparación opcional
- Educa al usuario para que **no nos necesite** en el largo plazo

---

## Contacto

**Empresa**: Nieves Legacy Partners LLC
**Fundador**: William Nieves
**Email**: hello@creditlegacy.ai
**Soporte**: support@creditlegacy.ai
**Legal**: legal@creditlegacy.ai
**Seguridad**: security@creditlegacy.ai

---

## License

**Proprietary**. © 2026 Nieves Legacy Partners LLC. All rights reserved.

El código fuente es público con fines de transparencia, pero el uso, redistribución o modificación están sujetos a los términos de Nieves Legacy Partners LLC.

---

*"El imperio no se sueña, se construye línea por línea."*

— William Nieves, Founder & CEO
