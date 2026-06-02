# TROUBLESHOOTING · Credit Legacy AI

Soluciones a problemas comunes basadas en experiencia real del deploy v0.1.

---

## Errores de build en Vercel

### "Parameter 'X' implicitly has an 'any' type"

**Causa**: TypeScript strict mode requiere tipos explícitos.

**Solución**: Asegúrate que `src/lib/supabase-server.ts` use el tipo correcto:

```typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr';

type CookieToSet = {
  name: string;
  value: string;
  options?: CookieOptions;
};

// Luego en setAll:
setAll(cookiesToSet: CookieToSet[]) { ... }
```

### "Module not found: Can't resolve '@/...'"

**Causa**: TypeScript paths no configurados.

**Solución**: Verifica `tsconfig.json` tiene:

```json
{
  "compilerOptions": {
    "paths": { "@/*": ["./src/*"] }
  }
}
```

### "Environment Variable references Secret which does not exist"

**Causa**: Falta configurar env vars en Vercel.

**Solución**: 
1. Vercel → Settings → Environment Variables
2. Agregar TODAS las del `.env.example`
3. Marcar Production + Preview + Development
4. Redeploy

---

## Errores de git push

### "Updates were rejected because the remote contains work..."

**Causa**: El repo remoto tiene commits (README, gitignore) que tu local no tiene.

**Solución 1 · La primera vez (force push)**:
```bash
git push -u origin main --force
```

⚠️ Solo seguro si eres el único trabajando y el remoto solo tiene README inicial.

**Solución 2 · Si ya hay trabajo importante en remoto**:
```bash
git config pull.rebase false
git pull origin main --allow-unrelated-histories
# Resuelve conflictos manualmente
git add .
git commit -m "Merge"
git push
```

### "Merge conflict en .gitignore / README.md"

**Causa**: Tanto local como remoto modificaron el mismo archivo.

**Solución rápida**:
```bash
git merge --abort
git push -u origin main --force
```

---

## Errores de Supabase

### "Invalid login credentials"

**Causa común 1**: Email no confirmado.
**Solución**: User debe hacer click en el link del email.

**Causa común 2**: Password mal escrito.
**Solución**: Usar magic link como alternativa.

### "permission denied for table X"

**Causa**: RLS está habilitado pero falta policy o el usuario no está autenticado.

**Solución**:
1. Verifica que la query se ejecute en contexto autenticado
2. Verifica las policies en Supabase → Authentication → Policies
3. Para debug temporal: ejecutar como service_role (NUNCA en producción)

### "Failed to fetch / Network error"

**Causa**: Env vars mal configuradas o URL incorrecta.

**Solución**:
- Verifica `NEXT_PUBLIC_SUPABASE_URL` no tenga slash al final
- Verifica que la anon key sea la correcta del proyecto

---

## Errores de Claude API

### "Authentication failed"

**Causa**: `ANTHROPIC_API_KEY` mal configurada.

**Solución**:
- Verifica que la key empiece con `sk-ant-`
- Genera una nueva en console.anthropic.com si dudas

### "Rate limit exceeded"

**Causa**: Demasiadas llamadas en poco tiempo (free tier).

**Solución**:
- Implementa retry con backoff exponencial
- Considera upgrade a Build tier ($5+ en créditos)
- Cachea responses cuando sea posible

### "Model not found"

**Causa**: Nombre del modelo incorrecto o deprecated.

**Solución**: Usar el modelo correcto. Actual recomendado para Credit Legacy AI:
```typescript
export const DEFAULT_MODEL = 'claude-sonnet-4-5';
```

---

## Errores de Next.js

### "Hydration mismatch"

**Causa**: Server render ≠ client render. Común con `Date.now()`, `Math.random()`, `useState` con valor del browser.

**Solución**:
- Usar `useEffect` para código que solo corre en client
- O envolver en `'use client'` el componente afectado

### "Cannot find module 'next-intl'"

**Causa**: Falta instalar o config mal.

**Solución**:
```bash
npm install next-intl
```

Y verifica `next.config.mjs`:
```javascript
import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
export default withNextIntl(nextConfig);
```

### "params is now async"

**Causa**: Next.js 15+ cambió params a async. En 14 sigue sincrónico.

**Solución**: Mantén `params: { locale }` directamente como prop. Si actualizas a Next 15, await params.

---

## Errores de dominios (Cloudflare + Vercel)

### "DNS_PROBE_FINISHED_NXDOMAIN"

**Causa**: DNS no propagado o mal configurado.

**Solución**:
1. Espera 5-30 minutos
2. Verifica en https://dnschecker.org
3. Asegúrate que en Cloudflare el record sea **DNS only** (gris), no proxied (naranja)

### "Too many redirects"

**Causa**: Cloudflare proxied + Vercel SSL = loop.

**Solución**: En Cloudflare, pon el record en **DNS only** mode.

---

## Performance

### Build time muy largo

**Solución**:
- Vercel cachea `node_modules` automáticamente
- Si compila desde cero cada vez, verifica el `package-lock.json` esté commiteado

### Bundle size warning

**Solución**:
- Lazy load componentes pesados con `dynamic()`
- Considera reemplazar dependencias grandes
- Usa `next/image` para optimización automática

---

## Cuándo pedir ayuda

Si después de revisar este doc el problema persiste:

1. Capturar **screenshot del error completo**
2. Capturar **logs de Vercel** (Build Logs o Runtime Logs)
3. Capturar **estado actual** (qué cambió desde el último deploy que funcionaba)
4. Mandarlo todo en Cursor o en chat para análisis

---

## Comandos útiles de diagnóstico

```bash
# Verificar versiones
node -v
npm -v

# Limpiar y reinstalar
rm -rf node_modules .next
npm install

# Verificar tipos
npm run type-check

# Build local (debug rápido)
npm run build

# Logs detallados de Next.js
DEBUG=* npm run dev
```
