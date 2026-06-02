# Credit Legacy AI

> Plataforma SaaS bilingüe de reparación de crédito con inteligencia artificial.
> Diseñada para la comunidad hispana. FCRA compliant. ITIN friendly. 100% transparente.

[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js%2014-black)](https://nextjs.org)
[![Powered by Claude](https://img.shields.io/badge/Powered%20by-Claude%20Sonnet%204.6-AD7B49)](https://anthropic.com)
[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-AD7B49)](#license)

---

## 🎯 Misión

Credit Legacy AI es una **división de Nieves Legacy Partners LLC** que democratiza la reparación de crédito para la comunidad hispana mediante IA. Sin intermediarios, sin promesas falsas, con tecnología real.

**Lanzamiento target: 15 de Abril 2028**

---

## ⚡ Versión Actual: v0.3

### Novedades v0.3

- ✅ **Logo brand integrado** (monograma LN dorado) en todos los assets
  - Favicon multi-tamaño (16, 32, 192, 512, apple-touch 180)
  - OG image 1200x630 para social media
  - PWA manifest con icons completos
- ✅ **9 páginas nuevas** (Nivel 1 + Nivel 2)
  - `/about` — Página institucional con historia, fundador, divisiones NLP, valores
  - `/how-it-works` — 4 pasos detallados del proceso
  - `/contact` — Formulario + WhatsApp + 4 emails + redes sociales
  - `/auth/forgot-password` — Recuperación de contraseña con Supabase
  - `/onboarding` — Wizard de 5 pasos con KYC + cifrado AES-256
  - `/legal/cookies` — Cookie Policy bilingüe
  - `not-found.tsx` — 404 custom branded
  - `error.tsx` — Error boundary branded
  - Sitemap dinámico
- ✅ **SEO completo**: metadata expandido, OpenGraph, Twitter Card, hreflang, manifest, robots.txt, sitemap.xml
- ✅ **Onboarding completo**: 5 pasos (Welcome → Personal → Address → Tax ID → Review) con cifrado AES-256 del SSN/ITIN y validación de CPN
- ✅ **Contact API**: Endpoint `/api/contact` con tabla `contact_messages` en Supabase
- ✅ **Onboarding API**: Endpoint `/api/onboarding` con cifrado AES-256 + detección de CPN
- ✅ **Migration 002**: `contact_messages` table con RLS public-INSERT-only

### Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 |
| i18n | next-intl |
| Auth + DB | Supabase |
| AI | Anthropic Claude Sonnet 4.6 |
| Validation | Zod |
| Icons | Lucide React |
| Deployment | Vercel |
| Domain | creditlegacy.ai |

---

## 🚀 Setup Local

### 1. Clonar y instalar

```bash
git clone https://github.com/CreditLegacyAI/credit-legacy-ai.git
cd credit-legacy-ai
npm install
```

### 2. Variables de entorno

Copia `.env.example` a `.env.local` y llena con tus credenciales:

```bash
cp .env.example .env.local
```

Variables requeridas:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ANTHROPIC_API_KEY`
- `ENCRYPTION_KEY` (32-byte base64)

### 3. Ejecutar migrations en Supabase

Aplica los archivos en orden:

```bash
supabase/migrations/001_initial_schema.sql
supabase/migrations/002_contact_messages.sql
```

### 4. Dev server

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) — redirigirá a `/es`.

---

## 📁 Estructura

```
credit-legacy-ai/
├── public/                          # Assets estáticos
│   ├── logo.png                     # Logo principal (512x512)
│   ├── logo-medium.png              # Navbar (256x256)
│   ├── logo-dark-bg.png             # Footer
│   ├── favicon.ico                  # Multi-tamaño
│   ├── apple-touch-icon.png         # iOS 180x180
│   ├── icon-192.png · icon-512.png  # PWA
│   ├── og-image.png                 # Social media 1200x630
│   ├── manifest.json                # PWA manifest
│   └── robots.txt
│
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── page.tsx             # Landing
│   │   │   ├── about/               # Sobre Nosotros (v0.3)
│   │   │   ├── how-it-works/        # Cómo Funciona (v0.3)
│   │   │   ├── contact/             # Contacto (v0.3)
│   │   │   ├── auth/                # Login, Signup, Verify, Forgot (v0.3)
│   │   │   ├── onboarding/          # KYC Wizard (v0.3)
│   │   │   ├── dashboard/           # Dashboard protegido
│   │   │   ├── legal/               # Terms, Privacy, FCRA, Cookies (v0.3)
│   │   │   ├── not-found.tsx        # 404 branded (v0.3)
│   │   │   ├── error.tsx            # Error boundary (v0.3)
│   │   │   └── layout.tsx
│   │   ├── api/
│   │   │   ├── waitlist/route.ts
│   │   │   ├── contact/route.ts     # Contact form (v0.3)
│   │   │   └── onboarding/route.ts  # KYC submit (v0.3)
│   │   ├── layout.tsx               # Root + metadata + favicon (v0.3)
│   │   ├── sitemap.ts               # Dynamic sitemap (v0.3)
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── landing/                 # Navbar, Hero, Features, etc.
│   │   ├── dashboard/               # Sidebar, Topbar
│   │   └── shared/
│   │
│   ├── lib/
│   │   ├── supabase-client.ts
│   │   ├── supabase-server.ts
│   │   ├── anthropic.ts
│   │   ├── crypto.ts                # AES-256 encryption
│   │   └── validation.ts            # CPN detection + SSN/ITIN validation
│   │
│   └── i18n/
│       ├── config.ts
│       └── messages/
│           ├── es.json
│           └── en.json
│
└── supabase/
    └── migrations/
        ├── 001_initial_schema.sql
        └── 002_contact_messages.sql # (v0.3)
```

---

## 🎨 Brand Guidelines

| Color | Hex | Uso |
|-------|-----|-----|
| Gold (DEFAULT) | `#AD7B49` | Primario, CTAs, acentos |
| Gold Light | `#C99668` | Hover states |
| Gold Dark | `#8B5F38` | Active states |
| Off-white | `#F4F2F2` | Fondos |
| Black | `#000000` | Texto principal |
| Gray Dark | `#3F3F3F` | Texto secundario |

**Font**: SF Pro Display (system stack)
**Tagline**: *"El imperio no se sueña, se construye línea por línea."*

---

## 🔒 Seguridad

- **AES-256-GCM** encryption para SSN/ITIN en reposo
- **CPN detection** automático rechaza inputs ilegales bajo FCRA
- **Row Level Security** activado en todas las tablas de Supabase
- **Service role key** solo en server-side, nunca expuesta al cliente
- **HTTPS** obligatorio en producción (Vercel default)
- **Rate limiting** preparado para Phase 2

---

## 📈 Roadmap

### v0.4 (Próximo)
- Smart Audit Engine MVP (parsing de reporte de crédito)
- Strategy Generator con Claude
- Dashboard con datos reales

### v0.5
- AI Coach (chatbot bilingüe)
- Letter generation (FCRA templates)
- Stripe integration

### v1.0 (Launch · Abril 2028)
- Array integration (3 bureaus OAuth)
- Credit Health Guardian
- Full gamification

---

## 📞 Contacto

- **CEO**: William Nieves — Nieves Legacy Partners LLC
- **General**: hello@creditlegacy.ai
- **Soporte**: support@creditlegacy.ai
- **Legal**: legal@creditlegacy.ai
- **Seguridad**: security@creditlegacy.ai
- **Social**: [@creditlegacyai](https://instagram.com/creditlegacyai) en todas las plataformas

---

## 📜 License

**Proprietary** · © 2026 Nieves Legacy Partners LLC. Todos los derechos reservados.

Credit Legacy AI es una división de Nieves Legacy Partners LLC, basada en Puerto Rico.
