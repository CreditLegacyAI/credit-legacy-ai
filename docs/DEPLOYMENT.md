# DEPLOYMENT · Credit Legacy AI

## Resumen

Credit Legacy AI usa **deploy automático**: cada push a `main` triggerea un build en Vercel.

---

## Flujo completo de deploy

```
Local code change
  → git add .
  → git commit -m "..."
  → git push origin main
  → Vercel detecta el push
  → Vercel pull del repo
  → Vercel install dependencies (npm install)
  → Vercel build (npm run build)
  → Vercel deploy a producción
  → Live en ~2 minutos
```

---

## Environment Variables en Vercel

**CRÍTICO**: Sin estas variables el build falla.

### Variables requeridas

| Variable | Ejemplo | Notas |
|----------|---------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://efdwsgqqadkjcyutksox.supabase.co` | Visible en frontend |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGc...` | Visible en frontend |
| `ANTHROPIC_API_KEY` | `sk-ant-...` | SOLO server-side |
| `ENCRYPTION_SECRET` | (32+ chars) | SOLO server-side |
| `NEXT_PUBLIC_SITE_URL` | `https://creditlegacy.ai` | Para redirects |

### Cómo configurar

1. Vercel Dashboard → tu proyecto
2. **Settings** → **Environment Variables**
3. Para cada variable:
   - Name: el nombre exacto (sensible a mayúsculas)
   - Value: el valor real
   - Environment: marcar **Production**, **Preview**, **Development**
4. Click **Save**
5. **Redeploy** el último deployment para aplicar cambios

---

## Build settings

Vercel auto-detecta Next.js. No necesitas tocar nada, pero por si acaso:

- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install`
- **Node Version**: 20.x

---

## Custom domains

### Setup de `app.creditlegacy.ai`

1. Vercel → Settings → Domains → Add
2. Ingresa `app.creditlegacy.ai`
3. Vercel te dará: CNAME apuntando a `cname.vercel-dns.com`
4. Cloudflare → DNS para creditlegacy.ai
5. Add Record:
   - Type: CNAME
   - Name: `app`
   - Target: `cname.vercel-dns.com`
   - Proxy status: **DNS only** (gris, NO naranja)
6. Save
7. Volver a Vercel → debería decir "Valid Configuration" en ~5 min
8. SSL automático

### Setup de `creditlegacy.ai` (root)

Mismo proceso pero usa A records que Vercel te da, o ALIAS si Cloudflare lo soporta.

---

## Rollback de un deploy

Si un deploy rompe algo:

1. Vercel → Deployments
2. Busca el último deploy que funcionaba
3. Click `...` → **Promote to Production**
4. Live en ~30 segundos

---

## Logs y debugging

### En tiempo real

```bash
# Si tienes Vercel CLI:
vercel logs --follow

# O en el dashboard:
Vercel → tu proyecto → Logs
```

### Build logs

Vercel → Deployments → click en el deploy → Build Logs

### Runtime logs

Vercel → Logs (sidebar) → filtrar por function

---

## Checklist pre-deploy

Antes de hacer push a main:

- [ ] `npm run build` corre sin errores locales
- [ ] `npm run type-check` pasa
- [ ] No hay `console.log` en código de producción
- [ ] `.env.local` NO está commiteado (debe estar en `.gitignore`)
- [ ] Las nuevas env vars están agregadas en Vercel también
- [ ] Branch protection rules en GitHub si trabajas con PRs

---

## Monitoreo post-launch

Cuando llegue el 15 de abril de 2028:

- **Vercel Analytics**: free tier suficiente para Phase 1
- **Supabase Dashboard**: monitorear queries lentas, RLS denials
- **Anthropic Console**: monitorear costo de API + rate limits
- **Sentry** (futuro): error tracking
- **PostHog** (futuro): product analytics
