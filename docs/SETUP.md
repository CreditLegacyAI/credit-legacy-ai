# SETUP · Credit Legacy AI

Guía paso a paso para configurar el proyecto desde cero.

---

## Pre-requisitos

- Node.js 20+ (`node -v`)
- npm o pnpm (`npm -v`)
- Cuenta de Supabase (free tier funciona)
- Cuenta de Anthropic Console
- Cuenta de Vercel
- Git instalado

---

## Paso 1 · Clonar e instalar

```bash
# Si vienes del v0.1 deployado en GitHub:
git pull origin main

# Si es proyecto fresh:
git clone https://github.com/CreditLegacyAI/credit-legacy-ai.git
cd credit-legacy-ai

# Instalar dependencias
npm install
```

---

## Paso 2 · Variables de entorno

Copia `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

Luego edita `.env.local` con tus valores reales:

```env
# Supabase (obtén estas keys en supabase.com → Settings → API)
NEXT_PUBLIC_SUPABASE_URL=https://efdwsgqqadkjcyutksox.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui

# Anthropic (obtén tu key en console.anthropic.com)
ANTHROPIC_API_KEY=sk-ant-tu_key_aqui

# Cifrado (generar con: openssl rand -base64 32)
ENCRYPTION_SECRET=tu_secret_de_32_caracteres_minimo

# Site URL (cambiar en production)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## Paso 3 · Configurar Supabase

### 3.1 · Crear las tablas

1. Ve a tu proyecto en supabase.com
2. Click en **SQL Editor** en el sidebar
3. Click en **New query**
4. Abre el archivo `supabase/migrations/001_initial_schema.sql`
5. Copia TODO el contenido y pégalo en el SQL Editor
6. Click en **Run** (esquina inferior derecha)
7. Espera el mensaje "Success. No rows returned"

### 3.2 · Verificar las tablas

1. Click en **Table Editor** en el sidebar
2. Deberías ver 9 tablas:
   - profiles
   - waitlist
   - subscriptions
   - audits
   - strategies
   - disputes
   - letters
   - coach_sessions
   - audit_logs

### 3.3 · Configurar Authentication

1. Click en **Authentication** → **Providers**
2. Asegúrate que **Email** esté habilitado
3. Para Magic Links: **Authentication** → **Email Templates** y personaliza si quieres
4. **Authentication** → **URL Configuration**:
   - **Site URL**: `http://localhost:3000` (dev) o `https://creditlegacy.ai` (prod)
   - **Redirect URLs**: agregar ambas

---

## Paso 4 · Correr en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

Deberías ver:
- Landing page en español (detección automática)
- Switch ES/EN funcional
- Todas las secciones: Hero, Features, Pricing, Philosophy, FAQ, Waitlist, Footer

---

## Paso 5 · Test básico

### Test del waitlist

1. Scroll hasta la sección Waitlist
2. Ingresa nombre + email de prueba
3. Click "Reservar mi Lugar"
4. Deberías ver "¡Estás dentro!"
5. Verifica en Supabase → Table Editor → waitlist que aparezca el registro

### Test de signup

1. Click "Comenzar" arriba a la derecha
2. Completa el formulario
3. Verifica tu email
4. Deberías ser redirigido al dashboard

---

## Paso 6 · Deploy a Vercel

### 6.1 · Push a GitHub

```bash
git add .
git commit -m "v0.2 - Full feature build"
git push origin main
```

### 6.2 · Configurar Vercel

1. Ve a vercel.com → Import Project
2. Selecciona `CreditLegacyAI/credit-legacy-ai`
3. En **Environment Variables**, agrega TODAS las del `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ANTHROPIC_API_KEY`
   - `ENCRYPTION_SECRET`
   - `NEXT_PUBLIC_SITE_URL` (poner `https://tu-dominio.vercel.app`)
4. Click **Deploy**
5. Espera ~2 minutos

---

## Paso 7 · Conectar dominio custom (opcional)

Si quieres usar `app.creditlegacy.ai`:

1. Vercel → Settings → Domains → Add Domain
2. Ingresa `app.creditlegacy.ai`
3. Vercel te dará registros DNS para agregar
4. Ve a Cloudflare → DNS de creditlegacy.ai
5. Agrega los registros que Vercel pidió (CNAME)
6. Espera propagación (1-5 minutos)
7. Vercel auto-emitirá SSL

---

## Troubleshooting

Ver `docs/TROUBLESHOOTING.md` para problemas comunes.

---

## Próximos pasos

Una vez que todo esté funcionando:

1. Lee `docs/ARCHITECTURE.md` para entender la estructura
2. Lee `docs/DEPLOYMENT.md` para deploys avanzados
3. Comienza a iterar en el feature flag que quieras avanzar
