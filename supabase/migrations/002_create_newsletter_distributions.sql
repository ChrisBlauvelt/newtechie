-- Create newsletter_distributions table
-- This table tracks newsletter distribution history including success/failure counts
-- Requirements: 4.5, 4.6, 4.7

CREATE TABLE IF NOT EXISTS newsletter_distributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  newsletter_id UUID REFERENCES newsletter_metadata(id) ON DELETE CASCADE,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  total_recipients INTEGER NOT NULL,
  successful_count INTEGER NOT NULL,
  failed_count INTEGER NOT NULL,
  failures JSONB
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_distribution_newsletter ON newsletter_distributions(newsletter_id);
CREATE INDEX IF NOT EXISTS idx_distribution_sent_at ON newsletter_distributions(sent_at DESC);

-- Add comments for documentation
COMMENT ON TABLE newsletter_distributions IS 'Tracks newsletter distribution history with success and failure metrics';
COMMENT ON COLUMN newsletter_distributions.newsletter_id IS 'Reference to the newsletter that was sent';
COMMENT ON COLUMN newsletter_distributions.sent_at IS 'Timestamp when the distribution was initiated';
COMMENT ON COLUMN newsletter_distributions.total_recipients IS 'Total number of recipients the newsletter was sent to';
COMMENT ON COLUMN newsletter_distributions.successful_count IS 'Number of successful email deliveries';
COMMENT ON COLUMN newsletter_distributions.failed_count IS 'Number of failed email deliveries';
COMMENT ON COLUMN newsletter_distributions.failures IS 'JSON array of failed deliveries with email and error details';
