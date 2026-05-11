-- ================================================
-- DATABASE MIGRATION FOR DETAILS PAGE
-- ================================================
-- Run this if you already have the rsvp_responses table
-- and need to add the new columns for DetailsPage
-- ================================================

-- Add new columns for DetailsPage features
ALTER TABLE rsvp_responses
ADD COLUMN IF NOT EXISTS dress_code TEXT,
ADD COLUMN IF NOT EXISTS custom_rundown JSONB;

-- Add comments
COMMENT ON COLUMN rsvp_responses.dress_code IS 'Selected dress code color';
COMMENT ON COLUMN rsvp_responses.custom_rundown IS 'Customized rundown in JSON format';

-- Enable UPDATE policy if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'rsvp_responses'
    AND policyname = 'Allow public UPDATE'
  ) THEN
    CREATE POLICY "Allow public UPDATE"
    ON rsvp_responses
    FOR UPDATE
    TO public
    USING (true)
    WITH CHECK (true);
  END IF;
END
$$;

-- ================================================
-- SUCCESS! ✅
-- ================================================
-- Columns added:
-- - dress_code (TEXT)
-- - custom_rundown (JSONB)
--
-- Policy enabled:
-- - Allow public UPDATE
-- ================================================
