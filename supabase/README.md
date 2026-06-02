# Database Schema · Credit Legacy AI

## Overview

Schema completo para Credit Legacy AI con Row Level Security (RLS) habilitado en todas las tablas.

## Tablas

| Tabla | Propósito |
|-------|-----------|
| `profiles` | Datos extendidos del usuario (KYC, dirección, tax ID cifrado) |
| `waitlist` | Lista de espera pre-launch (público) |
| `subscriptions` | Tier y estado de billing por usuario |
| `audits` | Resultados del Smart Audit Engine |
| `strategies` | Planes generados por Strategy Generator |
| `disputes` | Items específicos en disputa |
| `letters` | Cartas FCRA generadas con AI |
| `coach_sessions` | Chats con AI Credit Coach |
| `audit_logs` | Registro de acciones sensibles (compliance) |

## Cómo aplicar

### Opción A · Supabase Dashboard (recomendado para Phase 1)

1. Ir a Supabase Dashboard → Tu proyecto
2. Click en **SQL Editor**
3. Click en **New query**
4. Copiar el contenido completo de `001_initial_schema.sql`
5. Pegar y ejecutar
6. Verificar en **Table Editor** que las 9 tablas aparezcan

### Opción B · Supabase CLI (recomendado para Phase 2+)

```bash
npx supabase login
npx supabase link --project-ref efdwsgqqadkjcyutksox
npx supabase db push
```

## Seguridad

Todas las tablas tienen RLS habilitado. Los usuarios solo pueden ver y modificar sus propios datos. La tabla `waitlist` permite INSERT público (para signup) pero no SELECT público.

## Datos sensibles

Los SSN/ITIN se cifran con AES-256-GCM antes de guardarse en `profiles.tax_id_encrypted`. La función de cifrado está en `src/lib/crypto.ts`.

## Próximas migrations

- `002_array_integration.sql` · Tablas para integración con Array API (Q3 2026)
- `003_referrals.sql` · Sistema de referidos
- `004_admin_dashboard.sql` · Vistas y funciones para panel admin
