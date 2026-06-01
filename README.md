# Credit Legacy AI

División de **Nieves Legacy Partners LLC**.
Plataforma SaaS bilingüe de reparación de crédito DIY para la comunidad hispana.

**Launch oficial:** 15 de abril de 2028

---

## Stack

- **Framework:** Next.js 14 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **i18n:** next-intl (español/inglés con detección automática)
- **Auth + DB:** Supabase
- **Deploy:** Vercel
- **Editor:** Cursor + Claude API

---

## Setup local

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
Copia `.env.example` a `.env.local` y completa con tus credenciales:
```bash
cp .env.example .env.local
```

Necesitas:
- `NEXT_PUBLIC_SUPABASE_URL` — URL de tu proyecto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Anon key de Supabase

### 3. Configurar tabla en Supabase
Ejecuta este SQL en el editor de Supabase:

```sql
-- Tabla de waitlist
CREATE TABLE waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  locale TEXT DEFAULT 'es',
  signed_up_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: solo permitir INSERT desde el frontend
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir insert público" ON waitlist
  FOR INSERT WITH CHECK (true);
```

### 4. Correr en desarrollo
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

---

## Estructura

```
src/
├── app/
│   ├── [locale]/           # Rutas localizadas (es/en)
│   │   ├── page.tsx        # Landing page
│   │   ├── auth/
│   │   │   ├── login/      # Login
│   │   │   └── signup/     # Signup
│   │   └── dashboard/      # Dashboard protegido
│   ├── api/
│   │   └── waitlist/       # API para waitlist
│   ├── layout.tsx
│   └── globals.css
├── components/             # Componentes React
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── Features.tsx
│   ├── Philosophy.tsx
│   ├── Waitlist.tsx
│   └── Footer.tsx
├── i18n/
│   ├── request.ts          # Config next-intl
│   └── messages/
│       ├── es.json         # Traducciones español
│       └── en.json         # Traducciones inglés
├── lib/
│   ├── supabase-client.ts  # Cliente browser
│   └── supabase-server.ts  # Cliente server
└── middleware.ts           # Detección automática de idioma
```

---

## Brand Identity

| Color | Hex |
|-------|-----|
| Gold (primary) | `#AD7B49` |
| Off-white | `#F4F2F2` |
| Black | `#000000` |
| Gray dark | `#3F3F3F` |

**Tipografía:** SF Pro Display (system fallback Helvetica)

---

## Deploy a Vercel

1. Push al repo `CreditLegacyAI/credit-legacy-ai`
2. Importar en Vercel
3. Configurar variables de entorno
4. Conectar dominio `app.creditlegacy.ai`

---

**William Nieves · Founder & CEO**
Nieves Legacy Partners LLC
