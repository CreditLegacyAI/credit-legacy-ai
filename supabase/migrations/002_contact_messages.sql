-- ============================================================================
-- Credit Legacy AI · Migration 002 · Contact Messages Table
-- ============================================================================
-- Stores form submissions from the public Contact page.
-- Public can INSERT (anyone can send a message), only service role can SELECT.
-- ============================================================================

CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'es' CHECK (locale IN ('es', 'en')),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  read_at TIMESTAMPTZ,
  replied_at TIMESTAMPTZ
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON contact_messages(email);

-- Enable Row Level Security
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Anyone can INSERT (public contact form)
CREATE POLICY "Anyone can submit contact form"
  ON contact_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only authenticated users with service role can read
-- (admin will use service_role key from Supabase dashboard or admin panel)
CREATE POLICY "No public read access"
  ON contact_messages
  FOR SELECT
  TO authenticated
  USING (false);

-- Comment
COMMENT ON TABLE contact_messages IS 'Public contact form submissions. Phase 1: review manually. Phase 2: auto-forward via Resend.';
