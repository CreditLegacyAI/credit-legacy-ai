-- ============================================================================
-- Credit Legacy AI · Migration 004 · Storage Bucket Setup
-- ============================================================================
-- Sets up the `credit-reports` storage bucket with RLS policies.
-- IMPORTANT: Run this AFTER 003_audits.sql.
-- ============================================================================

-- 1. Create the bucket (private, not public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'credit-reports',
  'credit-reports',
  false,
  20971520, -- 20MB limit per file
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- 2. RLS Policies for credit-reports bucket
-- Path structure: {user_id}/{audit_id}/{filename}.pdf

-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload to their own folder"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'credit-reports'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow authenticated users to read their own files
CREATE POLICY "Users can read their own files"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'credit-reports'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow authenticated users to delete their own files
CREATE POLICY "Users can delete their own files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'credit-reports'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

COMMENT ON POLICY "Users can upload to their own folder" ON storage.objects
  IS 'Credit report PDFs are stored at {user_id}/{audit_id}/{filename}';
