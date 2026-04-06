-- Create newsletter_metadata table
-- This table stores metadata for uploaded newsletter markdown files
-- Requirements: 2.3, 3.1, 6.1

CREATE TABLE IF NOT EXISTS newsletter_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL UNIQUE,
  upload_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_modified TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  file_size INTEGER NOT NULL,
  sent_date TIMESTAMPTZ,
  recipient_count INTEGER,
  created_by UUID REFERENCES auth.users(id)
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_newsletter_upload_date ON newsletter_metadata(upload_date DESC);
CREATE INDEX IF NOT EXISTS idx_newsletter_sent_date ON newsletter_metadata(sent_date DESC);

-- Add comment for documentation
COMMENT ON TABLE newsletter_metadata IS 'Stores metadata for newsletter markdown files uploaded by admin';
COMMENT ON COLUMN newsletter_metadata.filename IS 'Original filename of the uploaded newsletter';
COMMENT ON COLUMN newsletter_metadata.storage_path IS 'Path to the file in Supabase Storage bucket';
COMMENT ON COLUMN newsletter_metadata.upload_date IS 'Timestamp when the newsletter was first uploaded';
COMMENT ON COLUMN newsletter_metadata.last_modified IS 'Timestamp when the newsletter was last modified';
COMMENT ON COLUMN newsletter_metadata.file_size IS 'Size of the newsletter file in bytes';
COMMENT ON COLUMN newsletter_metadata.sent_date IS 'Timestamp when the newsletter was sent to subscribers (null if not sent)';
COMMENT ON COLUMN newsletter_metadata.recipient_count IS 'Number of recipients the newsletter was sent to';
COMMENT ON COLUMN newsletter_metadata.created_by IS 'UUID of the admin user who uploaded the newsletter';
