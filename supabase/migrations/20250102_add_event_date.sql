-- Add event_date column to rsvp_responses table
-- This column stores the target date/time for the countdown

ALTER TABLE rsvp_responses
ADD COLUMN IF NOT EXISTS event_date TIMESTAMP WITH TIME ZONE;

-- Add comment to explain the column
COMMENT ON COLUMN rsvp_responses.event_date IS 'Target date and time for the event countdown';

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_rsvp_responses_event_date
ON rsvp_responses(event_date);
