-- ============================================================================
-- Credit Legacy AI · Migration 003 · Smart Audit Engine Tables
-- ============================================================================
-- Tables for the Smart Audit Engine v1:
--   - audits: master record per analysis run
--   - audit_files: PDF files uploaded (1-3 per audit)
--   - disputable_items: items detected by Claude that can be disputed
-- ============================================================================

-- ============================================================================
-- TABLE: audits
-- ============================================================================
CREATE TABLE IF NOT EXISTS audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Status tracking
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'parsing', 'analyzing', 'completed', 'failed')),
  error_message TEXT,

  -- Report type detection
  report_type TEXT CHECK (report_type IN ('myfico_3b', 'single_bureau', 'multi_bureau')),
  bureaus_included TEXT[], -- ['equifax', 'experian', 'transunion']

  -- Extracted scores per bureau
  score_equifax INTEGER CHECK (score_equifax IS NULL OR (score_equifax >= 300 AND score_equifax <= 850)),
  score_experian INTEGER CHECK (score_experian IS NULL OR (score_experian >= 300 AND score_experian <= 850)),
  score_transunion INTEGER CHECK (score_transunion IS NULL OR (score_transunion >= 300 AND score_transunion <= 850)),

  -- Report metadata
  report_date DATE, -- date the report was generated
  total_accounts INTEGER DEFAULT 0,
  total_disputable_items INTEGER DEFAULT 0,

  -- Claude analysis result (full structured JSON)
  raw_extracted_json JSONB, -- Output of parser
  ai_analysis_json JSONB,   -- Output of Claude analysis
  executive_summary_es TEXT,
  executive_summary_en TEXT,

  -- Cost tracking
  claude_input_tokens INTEGER DEFAULT 0,
  claude_output_tokens INTEGER DEFAULT 0,
  estimated_cost_usd DECIMAL(10, 4) DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audits_user_id ON audits(user_id);
CREATE INDEX IF NOT EXISTS idx_audits_status ON audits(status);
CREATE INDEX IF NOT EXISTS idx_audits_created_at ON audits(created_at DESC);

-- ============================================================================
-- TABLE: audit_files
-- ============================================================================
CREATE TABLE IF NOT EXISTS audit_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID NOT NULL REFERENCES audits(id) ON DELETE CASCADE,

  -- File metadata
  storage_path TEXT NOT NULL, -- Supabase Storage path
  original_filename TEXT NOT NULL,
  file_size_bytes INTEGER NOT NULL,
  mime_type TEXT NOT NULL DEFAULT 'application/pdf',

  -- Detected bureau (or null if multi-bureau MyFICO)
  detected_bureau TEXT CHECK (detected_bureau IS NULL OR detected_bureau IN ('equifax', 'experian', 'transunion', 'myfico_3b', 'unknown')),

  -- Parsing result
  page_count INTEGER,
  raw_text TEXT, -- Full extracted text (could be large)
  parse_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (parse_status IN ('pending', 'parsing', 'completed', 'failed')),
  parse_error TEXT,

  -- Timestamps
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  parsed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_audit_files_audit_id ON audit_files(audit_id);

-- ============================================================================
-- TABLE: disputable_items
-- ============================================================================
CREATE TABLE IF NOT EXISTS disputable_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Categorization
  category TEXT NOT NULL CHECK (category IN (
    'personal_info',      -- Wrong name, address, employer
    'incorrect_balance',  -- Balance doesn't match
    'incorrect_status',   -- Status incorrect (paid showing unpaid, etc.)
    'incorrect_dates',    -- DOFD wrong, payment dates wrong
    'duplicate_account',  -- Same debt showing twice
    'not_mine',           -- Account doesn't belong to user
    'outdated',           -- Past 7-year reporting limit
    'collection',         -- Collection items
    'charge_off',         -- Charge-offs
    'late_payment',       -- Late payment marks
    'hard_inquiry',       -- Unauthorized hard inquiries
    'public_record',      -- Bankruptcies, judgments, liens
    'mixed_file',         -- Data from another person mixed in
    'other'
  )),

  -- Impact priority
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  estimated_score_impact INTEGER, -- Estimated points if removed

  -- Affected bureaus
  affected_bureaus TEXT[] NOT NULL, -- ['equifax', 'experian'] etc.

  -- Item details
  creditor_name TEXT,
  account_number_masked TEXT, -- Last 4 digits typically
  account_type TEXT,
  description_es TEXT NOT NULL,
  description_en TEXT NOT NULL,

  -- Legal basis for dispute (FCRA section)
  legal_basis TEXT, -- e.g. "FCRA § 611" or "FCRA § 605"

  -- Recommended dispute round (1 = personal info cleanup, 2 = high impact, etc.)
  recommended_round INTEGER NOT NULL DEFAULT 1 CHECK (recommended_round BETWEEN 1 AND 5),

  -- Dispute tracking (Phase 2)
  dispute_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (dispute_status IN ('pending', 'letter_generated', 'sent', 'responded', 'removed', 'verified', 'rejected')),

  -- Raw data snapshot
  raw_data JSONB, -- Original parsed data for reference

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_disputable_items_audit_id ON disputable_items(audit_id);
CREATE INDEX IF NOT EXISTS idx_disputable_items_user_id ON disputable_items(user_id);
CREATE INDEX IF NOT EXISTS idx_disputable_items_priority ON disputable_items(priority);
CREATE INDEX IF NOT EXISTS idx_disputable_items_category ON disputable_items(category);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- audits: users can only see their own
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own audits"
  ON audits FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own audits"
  ON audits FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own audits"
  ON audits FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own audits"
  ON audits FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- audit_files: same as audits (linked via audit_id)
ALTER TABLE audit_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view files of their audits"
  ON audit_files FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM audits
      WHERE audits.id = audit_files.audit_id
      AND audits.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert files for their audits"
  ON audit_files FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM audits
      WHERE audits.id = audit_files.audit_id
      AND audits.user_id = auth.uid()
    )
  );

-- disputable_items: linked via user_id directly
ALTER TABLE disputable_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own disputable items"
  ON disputable_items FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own disputable items"
  ON disputable_items FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own disputable items"
  ON disputable_items FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================================
-- STORAGE BUCKET: credit-reports (run separately in Supabase Storage)
-- ============================================================================
-- Note: Storage bucket creation must be done in Supabase Dashboard or via:
--   INSERT INTO storage.buckets (id, name, public) VALUES ('credit-reports', 'credit-reports', false);
-- With these policies:
--   - Authenticated users can upload to their own folder: {user_id}/{audit_id}/{filename}
--   - Users can only read their own files

COMMENT ON TABLE audits IS 'Smart Audit Engine: master record per credit report analysis run';
COMMENT ON TABLE audit_files IS 'PDFs uploaded for an audit (1 to 3 files)';
COMMENT ON TABLE disputable_items IS 'Items detected by AI that can be legally disputed under FCRA';
