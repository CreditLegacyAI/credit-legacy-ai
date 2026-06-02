# ARCHITECTURE · Credit Legacy AI

## Stack tecnológico

### Frontend
- **Next.js 14** · App Router + Server Components
- **TypeScript** · Type safety en todo el codebase
- **Tailwind CSS** · Styling con design tokens custom
- **next-intl** · i18n con detección automática (ES/EN)
- **Framer Motion** · Animaciones suaves
- **Lucide React** · Iconos

### Backend
- **Next.js API Routes** · Endpoints serverless
- **Supabase** · PostgreSQL + Auth + Storage
- **Anthropic Claude** · IA para Audit, Strategy, Letters, Coach
- **Zod** · Validación de schemas

### Infraestructura
- **Vercel** · Hosting + CDN + Serverless functions
- **Supabase Cloud** · Database + Auth
- **Cloudflare** · DNS para creditlegacy.ai
- **GitHub** · Version control (org: CreditLegacyAI)

---

## Estructura del proyecto

```
credit-legacy-ai/
├── docs/                      # Documentación
│   ├── SETUP.md
│   ├── ARCHITECTURE.md (este archivo)
│   ├── DEPLOYMENT.md
│   └── TROUBLESHOOTING.md
├── public/                    # Assets estáticos
├── src/
│   ├── app/
│   │   ├── [locale]/          # Rutas localizadas (ES/EN)
│   │   │   ├── auth/          # Login, signup, verify
│   │   │   ├── dashboard/     # App autenticada
│   │   │   ├── legal/         # Terms, Privacy, FCRA
│   │   │   ├── layout.tsx     # Layout con NextIntl provider
│   │   │   └── page.tsx       # Landing page
│   │   ├── api/               # API routes
│   │   │   ├── waitlist/
│   │   │   ├── auth/signout/
│   │   │   ├── audit/         # Smart Audit (calls Claude)
│   │   │   └── letters/       # Letter generator (calls Claude)
│   │   ├── layout.tsx         # Root layout con metadata
│   │   ├── globals.css        # Estilos globales
│   │   └── page.tsx           # Redirect a /es
│   ├── components/
│   │   ├── landing/           # Navbar, Hero, Features, etc.
│   │   ├── dashboard/         # Sidebar, etc.
│   │   ├── ui/                # Componentes reusables
│   │   └── shared/            # Cross-context
│   ├── i18n/
│   │   ├── messages/          # Traducciones
│   │   │   ├── es.json
│   │   │   └── en.json
│   │   └── request.ts         # Config de NextIntl
│   ├── lib/
│   │   ├── supabase-client.ts # Browser
│   │   ├── supabase-server.ts # Server Components
│   │   ├── anthropic.ts       # Claude client
│   │   ├── prompts.ts         # System prompts (Audit, Strategy, Coach, Letters)
│   │   ├── validation.ts      # Zod schemas + CPN detection
│   │   ├── crypto.ts          # AES-256-GCM para SSN/ITIN
│   │   └── utils.ts           # Helpers generales
│   └── middleware.ts          # i18n middleware
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   └── README.md
├── .env.example
├── next.config.mjs
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## Flujos clave

### 1 · Onboarding de usuario

```
User → /es/auth/signup
  → Supabase Auth crea entry en auth.users
  → Trigger handle_new_user() crea profile + subscription beta
  → Email de confirmación enviado
  → User click link → /es/auth/verify
  → Redirect a /es/dashboard
```

### 2 · Smart Audit Engine

```
User en /es/dashboard/audit
  → (Phase 2: conecta Array API para pull de bureaus)
  → POST /api/audit con creditReport
  → Validar autenticación (supabase.auth.getUser())
  → askClaude({ system: SYSTEM_PROMPTS.smartAudit, prompt: ..., locale })
  → Guardar en tabla `audits`
  → Retornar análisis al frontend
  → Auto-trigger Strategy Generator
```

### 3 · Letter generation

```
User en /es/dashboard/letters
  → Selecciona dispute item
  → POST /api/letters con disputedItem, bureau, consumerInfo
  → askClaude({ system: SYSTEM_PROMPTS.letterGenerator, ... })
  → Genera carta en INGLÉS, formato carta personal
  → Solicita "manual investigation, NOT e-OSCAR"
  → Cita FCRA § 611(a)(1)(A)
  → Guardar en tabla `letters`
  → (Phase 2: generar .docx con Word format)
```

---

## Seguridad

### Datos sensibles
- **SSN/ITIN**: cifrado AES-256-GCM antes de guardar (`src/lib/crypto.ts`)
- **Solo se muestran los últimos 4 dígitos** al usuario (`maskTaxId()`)
- **CPN detection**: rechazo automático en validación (`detectCPN()`)

### RLS (Row Level Security)
- Todas las tablas tienen RLS habilitado en Supabase
- Cada usuario solo ve/modifica sus propios datos
- Tabla `waitlist` permite INSERT público (signup) pero no SELECT

### API endpoints
- Todos los endpoints autenticados verifican `supabase.auth.getUser()`
- Validación Zod en cada input
- Errores nunca filtran info sensible

### Compliance
- **FCRA**: documentado en `/legal/fcra`
- **CROA**: cumplimiento documentado
- **Puerto Rico Ley Núm. 236**: Nieves Legacy Partners LLC opera bajo licencia OCIF cuando aplique

---

## Decisiones arquitectónicas

### ¿Por qué Next.js 14 App Router?
- Server Components → mejor performance + SEO bilingüe
- API Routes built-in → no backend separado en Phase 1
- Middleware nativo para i18n
- Deploy con Vercel = zero config

### ¿Por qué Supabase?
- PostgreSQL real (no NoSQL)
- Auth built-in con magic links + email
- RLS = security a nivel de database
- Realtime para features futuras
- Free tier generoso

### ¿Por qué Claude (Anthropic)?
- Calidad superior en análisis de texto largo (reportes de crédito)
- Bilingüe nativo (ES/EN)
- Sonnet 4.5 = balance ideal costo/calidad
- API stable + documentación excelente

### ¿Por qué next-intl?
- Standard de facto para Next.js
- Detección automática de locale del browser
- Pluralización + interpolación
- Server Components support nativo
