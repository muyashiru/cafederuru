-- ================================================
-- SUPABASE DATABASE SCHEMA FOR CAFEDERURU PROJECT
-- ================================================
-- Project: SUKMA (Surat Undangan Kafe Matcha)
-- Description: Database schema for storing RSVP responses and signatures
--
-- CARA IMPORT:
-- 1. Buka Supabase Dashboard
-- 2. Klik "SQL Editor" di sidebar
-- 3. Klik "New Query"
-- 4. Copy-paste SELURUH isi file ini
-- 5. Klik "Run" (atau Ctrl/Cmd + Enter)
-- 6. Done! ✅
-- ================================================

-- Drop table if exists (optional - uncomment kalau mau reset)
-- DROP TABLE IF EXISTS rsvp_responses CASCADE;

-- ================================================
-- CREATE TABLE: rsvp_responses
-- ================================================
-- Table untuk menyimpan data RSVP dan signature
CREATE TABLE IF NOT EXISTS rsvp_responses (
  -- Primary Key
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- User Data
  username TEXT NOT NULL,
  login_date DATE NOT NULL,
  response TEXT NOT NULL DEFAULT 'yes',

  -- Signature (Base64 string)
  signature_image TEXT,

  -- Details Page Data
  dress_code TEXT,
  custom_rundown JSONB,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ================================================
-- ADD COMMENTS (Documentation)
-- ================================================
COMMENT ON TABLE rsvp_responses IS 'Stores RSVP responses and signatures for cafe invitation';
COMMENT ON COLUMN rsvp_responses.id IS 'Unique identifier for each response';
COMMENT ON COLUMN rsvp_responses.username IS 'Username selected from dropdown (e.g., "Nasywa Cantik Anak Teknik")';
COMMENT ON COLUMN rsvp_responses.login_date IS 'Date when they last met (used as password)';
COMMENT ON COLUMN rsvp_responses.response IS 'Response status (always "yes" since they reached this point)';
COMMENT ON COLUMN rsvp_responses.signature_image IS 'Base64 encoded signature image';
COMMENT ON COLUMN rsvp_responses.dress_code IS 'Selected dress code color';
COMMENT ON COLUMN rsvp_responses.custom_rundown IS 'Customized rundown in JSON format';
COMMENT ON COLUMN rsvp_responses.created_at IS 'Timestamp when record was created';

-- ================================================
-- CREATE INDEXES (For Performance)
-- ================================================
-- Index on username for faster lookups
CREATE INDEX IF NOT EXISTS idx_rsvp_username
ON rsvp_responses(username);

-- Index on created_at for sorting by date (descending)
CREATE INDEX IF NOT EXISTS idx_rsvp_created_at
ON rsvp_responses(created_at DESC);

-- Composite index for username + login_date (for duplicate check)
CREATE INDEX IF NOT EXISTS idx_rsvp_username_date
ON rsvp_responses(username, login_date);

-- ================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ================================================
-- Enable RLS untuk security
ALTER TABLE rsvp_responses ENABLE ROW LEVEL SECURITY;

-- ================================================
-- CREATE RLS POLICIES
-- ================================================

-- Policy 1: Allow INSERT (untuk save RSVP dari frontend)
CREATE POLICY "Allow public INSERT"
ON rsvp_responses
FOR INSERT
TO public
WITH CHECK (true);

-- Policy 2: Allow SELECT (untuk read data dari frontend)
CREATE POLICY "Allow public SELECT"
ON rsvp_responses
FOR SELECT
TO public
USING (true);

-- Policy 3: Allow UPDATE (untuk update dress_code & custom_rundown)
CREATE POLICY "Allow public UPDATE"
ON rsvp_responses
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Policy 4: (Optional) Allow DELETE - Uncomment kalau butuh
-- CREATE POLICY "Allow public DELETE"
-- ON rsvp_responses
-- FOR DELETE
-- TO public
-- USING (true);

-- ================================================
-- INSERT SAMPLE DATA (Optional - For Testing)
-- ================================================
-- Uncomment untuk insert sample data

-- INSERT INTO rsvp_responses (username, login_date, response, signature_image) VALUES
-- ('Nasywa Cantik Anak Teknik', '2025-05-01', 'yes', 'data:image/png;base64,sample...'),
-- ('Nasywa Fauziyyah', '2025-05-01', 'yes', 'data:image/png;base64,sample...');

-- ================================================
-- VERIFY SETUP (Optional - Check if table exists)
-- ================================================
-- Run this query after import to verify:
-- SELECT * FROM rsvp_responses;

-- ================================================
-- SUCCESS! ✅
-- ================================================
-- Table "rsvp_responses" sudah ready!
-- Sekarang:
-- 1. Update .env file dengan Supabase credentials
-- 2. Restart dev server: npm run dev
-- 3. Test save data dari frontend
-- ================================================
