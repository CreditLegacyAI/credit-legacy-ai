-- ============================================================
-- Credit Legacy AI · Database Schema v0.2
-- ============================================================
-- Migration: 001_initial_schema.sql
-- Date: 2026-05-31
-- Author: William Nieves
--
-- Crea todo el schema base con Row Level Security (RLS)
-- para Credit Legacy AI.
--
-- IMPORTANTE: Ejecutar en orden. Cada sección depende de la anterior.
-- ============================================================


-- ============================================================
-- 1. PROFILES (extiende auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    locale TEXT DEFAULT 'es' CHECK (locale IN ('es', 'en')),
    phone TEXT,
    date_of_birth DATE,
    address JSONB,
    tax_id_encrypted TEXT,  -- SSN/ITIN cifrado con AES-256-GCM
    tax_id_type TEXT CHECK (tax_id_type IN ('SSN', 'ITIN')),
    tax_id_last4 TEXT,       -- Últimos 4 dígitos para display
    kyc_completed BOOLEAN DEFAULT FALSE,
    kyc_completed_at TIMESTAMP WITH TIME ZONE,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles(email);
CREATE INDEX IF NOT EXISTS profiles_kyc_idx ON public.profiles(kyc_completed);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);


-- ============================================================
-- 2. WAITLIST (público para pre-launch)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.waitlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    locale TEXT DEFAULT 'es' CHECK (locale IN ('es', 'en')),
    source TEXT,             -- 'landing', 'social', 'referral'
    referrer TEXT,           -- email del que refirió
    signed_up_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    converted BOOLEAN DEFAULT FALSE,
    converted_at TIMESTAMP WITH TIME ZONE,
    notes TEXT
);

CREATE INDEX IF NOT EXISTS waitlist_email_idx ON public.waitlist(email);
CREATE INDEX IF NOT EXISTS waitlist_signed_up_idx ON public.waitlist(signed_up_at DESC);

ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Cualquiera puede agregarse al waitlist (signup público)
CREATE POLICY "Anyone can sign up for waitlist"
    ON public.waitlist FOR INSERT
    WITH CHECK (true);

-- Solo admins pueden ver (manejo via service_role en backend)
CREATE POLICY "No public read on waitlist"
    ON public.waitlist FOR SELECT
    USING (false);


-- ============================================================
-- 3. SUBSCRIPTIONS (tier + estado de billing)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    tier TEXT NOT NULL CHECK (tier IN ('monitoring', 'basic', 'pro', 'pro_plus', 'beta')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled', 'trial')),
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT UNIQUE,
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    -- Filosofía anti-extractiva: tracking de uso real
    usage_last_30d JSONB DEFAULT '{}'::jsonb,
    downgrade_suggested BOOLEAN DEFAULT FALSE,
    downgrade_suggested_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS subs_user_idx ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS subs_status_idx ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS subs_tier_idx ON public.subscriptions(tier);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription"
    ON public.subscriptions FOR SELECT
    USING (auth.uid() = user_id);


-- ============================================================
-- 4. AUDITS (Smart Audit Engine results)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    bureau TEXT CHECK (bureau IN ('equifax', 'experian', 'transunion', 'all')),
    raw_report JSONB,        -- Reporte original (puede ser grande)
    analysis TEXT NOT NULL,  -- Análisis de Claude
    score_at_audit INTEGER,  -- Score al momento del audit
    disputable_items_count INTEGER DEFAULT 0,
    high_priority_count INTEGER DEFAULT 0,
    locale TEXT DEFAULT 'es',
    status TEXT DEFAULT 'completed' CHECK (status IN ('processing', 'completed', 'failed')),
    error_message TEXT,
    tokens_used INTEGER,
    cost_usd DECIMAL(10, 4),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS audits_user_idx ON public.audits(user_id);
CREATE INDEX IF NOT EXISTS audits_created_idx ON public.audits(created_at DESC);

ALTER TABLE public.audits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own audits"
    ON public.audits FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own audits"
    ON public.audits FOR INSERT
    WITH CHECK (auth.uid() = user_id);


-- ============================================================
-- 5. STRATEGIES (Strategy Generator results)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.strategies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    audit_id UUID REFERENCES public.audits(id) ON DELETE SET NULL,
    user_goal TEXT,
    plan JSONB NOT NULL,      -- Rounds estructurados
    total_rounds INTEGER,
    current_round INTEGER DEFAULT 1,
    estimated_completion_days INTEGER,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS strategies_user_idx ON public.strategies(user_id);
CREATE INDEX IF NOT EXISTS strategies_status_idx ON public.strategies(status);

ALTER TABLE public.strategies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own strategies"
    ON public.strategies FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own strategies"
    ON public.strategies FOR ALL
    USING (auth.uid() = user_id);


-- ============================================================
-- 6. DISPUTES (items específicos en disputa)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.disputes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    strategy_id UUID REFERENCES public.strategies(id) ON DELETE SET NULL,
    bureau TEXT NOT NULL CHECK (bureau IN ('equifax', 'experian', 'transunion')),
    item_type TEXT NOT NULL CHECK (item_type IN ('personal_info', 'public_record', 'inquiry', 'account', 'collection')),
    item_details JSONB NOT NULL,
    dispute_reason TEXT NOT NULL,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    round_number INTEGER DEFAULT 1,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'letter_generated', 'sent', 'investigating', 'resolved', 'rejected', 'cancelled')),
    sent_at TIMESTAMP WITH TIME ZONE,
    response_deadline DATE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolution TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS disputes_user_idx ON public.disputes(user_id);
CREATE INDEX IF NOT EXISTS disputes_status_idx ON public.disputes(status);
CREATE INDEX IF NOT EXISTS disputes_bureau_idx ON public.disputes(bureau);

ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own disputes"
    ON public.disputes FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own disputes"
    ON public.disputes FOR ALL
    USING (auth.uid() = user_id);


-- ============================================================
-- 7. LETTERS (cartas FCRA generadas)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.letters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    dispute_id UUID REFERENCES public.disputes(id) ON DELETE SET NULL,
    bureau TEXT NOT NULL CHECK (bureau IN ('equifax', 'experian', 'transunion')),
    disputed_item JSONB NOT NULL,
    content TEXT NOT NULL,            -- Contenido de la carta (en inglés)
    docx_url TEXT,                    -- URL del archivo .docx generado
    pdf_url TEXT,                     -- URL del PDF
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'ready', 'sent', 'archived')),
    sent_method TEXT CHECK (sent_method IN ('certified_mail', 'regular_mail', 'online_portal')),
    sent_at TIMESTAMP WITH TIME ZONE,
    tracking_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS letters_user_idx ON public.letters(user_id);
CREATE INDEX IF NOT EXISTS letters_dispute_idx ON public.letters(dispute_id);
CREATE INDEX IF NOT EXISTS letters_status_idx ON public.letters(status);

ALTER TABLE public.letters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own letters"
    ON public.letters FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own letters"
    ON public.letters FOR ALL
    USING (auth.uid() = user_id);


-- ============================================================
-- 8. COACH_SESSIONS (chat con AI Coach)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.coach_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    session_title TEXT,
    messages JSONB NOT NULL DEFAULT '[]'::jsonb,
    locale TEXT DEFAULT 'es',
    total_tokens INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS coach_user_idx ON public.coach_sessions(user_id);
CREATE INDEX IF NOT EXISTS coach_updated_idx ON public.coach_sessions(updated_at DESC);

ALTER TABLE public.coach_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions"
    ON public.coach_sessions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own sessions"
    ON public.coach_sessions FOR ALL
    USING (auth.uid() = user_id);


-- ============================================================
-- 9. AUDIT_LOGS (registro de acciones sensibles)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource_type TEXT,
    resource_id UUID,
    ip_address INET,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS audit_logs_user_idx ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS audit_logs_action_idx ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS audit_logs_created_idx ON public.audit_logs(created_at DESC);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own audit logs"
    ON public.audit_logs FOR SELECT
    USING (auth.uid() = user_id);


-- ============================================================
-- 10. FUNCTIONS Y TRIGGERS
-- ============================================================

-- Auto-update timestamp en cualquier UPDATE
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar a tablas con updated_at
CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER subscriptions_updated_at
    BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER strategies_updated_at
    BEFORE UPDATE ON public.strategies
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER disputes_updated_at
    BEFORE UPDATE ON public.disputes
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER letters_updated_at
    BEFORE UPDATE ON public.letters
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER coach_sessions_updated_at
    BEFORE UPDATE ON public.coach_sessions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();


-- Auto-crear profile cuando se crea un usuario en auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, locale)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'locale', 'es')
    );

    -- Auto-asignar plan beta a nuevos usuarios pre-launch
    INSERT INTO public.subscriptions (user_id, tier, status)
    VALUES (NEW.id, 'beta', 'trial');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();


-- ============================================================
-- 11. PERMISOS
-- ============================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT ON public.waitlist TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;


-- ============================================================
-- FIN DE MIGRATION 001
-- ============================================================
-- Total: 9 tablas, 3 funciones, múltiples policies RLS
-- Listo para production
-- ============================================================
