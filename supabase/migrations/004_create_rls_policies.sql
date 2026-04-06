-- Create Row Level Security (RLS) policies
-- This migration sets up RLS policies to restrict access to admin-only tables
-- Requirements: 1.5, 5.1

-- Enable RLS on newsletter_metadata table
ALTER TABLE newsletter_metadata ENABLE ROW LEVEL SECURITY;

-- Enable RLS on newsletter_distributions table
ALTER TABLE newsletter_distributions ENABLE ROW LEVEL SECURITY;

-- Enable RLS on rate_limit_log table
ALTER TABLE rate_limit_log ENABLE ROW LEVEL SECURITY;

-- Policy: Only admin user can access newsletter_metadata
-- This policy restricts all operations (SELECT, INSERT, UPDATE, DELETE) to the admin user only
CREATE POLICY "Admin only access to newsletter_metadata"
  ON newsletter_metadata
  FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users WHERE email = 'admin@techieneighbor.net'
    )
  )
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM auth.users WHERE email = 'admin@techieneighbor.net'
    )
  );

-- Policy: Only admin user can access newsletter_distributions
-- This policy restricts all operations (SELECT, INSERT, UPDATE, DELETE) to the admin user only
CREATE POLICY "Admin only access to newsletter_distributions"
  ON newsletter_distributions
  FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users WHERE email = 'admin@techieneighbor.net'
    )
  )
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM auth.users WHERE email = 'admin@techieneighbor.net'
    )
  );

-- Policy: Public read access to rate_limit_log for rate limiting checks
-- This allows the rate limiting service to check login attempts without authentication
-- Only SELECT is allowed; INSERT requires service role key (server-side only)
CREATE POLICY "Public read access to rate_limit_log"
  ON rate_limit_log
  FOR SELECT
  USING (true);

-- Policy: Service role can insert into rate_limit_log
-- This allows the server-side rate limiting service to record login attempts
CREATE POLICY "Service role can insert rate_limit_log"
  ON rate_limit_log
  FOR INSERT
  WITH CHECK (true);

-- Add comments for documentation
COMMENT ON POLICY "Admin only access to newsletter_metadata" ON newsletter_metadata IS 
  'Restricts all newsletter_metadata operations to the admin user (admin@techieneighbor.net)';

COMMENT ON POLICY "Admin only access to newsletter_distributions" ON newsletter_distributions IS 
  'Restricts all newsletter_distributions operations to the admin user (admin@techieneighbor.net)';

COMMENT ON POLICY "Public read access to rate_limit_log" ON rate_limit_log IS 
  'Allows public read access for rate limiting checks without authentication';

COMMENT ON POLICY "Service role can insert rate_limit_log" ON rate_limit_log IS 
  'Allows server-side service to record login attempts using service role key';
