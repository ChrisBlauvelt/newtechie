-- Create rate_limit_log table
-- This table tracks login attempts for rate limiting (5 attempts per hour per IP)
-- Requirements: 5.4, 5.5

CREATE TABLE IF NOT EXISTS rate_limit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address INET NOT NULL,
  attempt_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  success BOOLEAN NOT NULL DEFAULT FALSE
);

-- Create indexes for efficient rate limiting queries
CREATE INDEX IF NOT EXISTS idx_rate_limit_ip_time ON rate_limit_log(ip_address, attempt_time DESC);

-- Add comments for documentation
COMMENT ON TABLE rate_limit_log IS 'Tracks login attempts for rate limiting enforcement';
COMMENT ON COLUMN rate_limit_log.ip_address IS 'IP address of the login attempt';
COMMENT ON COLUMN rate_limit_log.attempt_time IS 'Timestamp when the login attempt occurred';
COMMENT ON COLUMN rate_limit_log.success IS 'Whether the login attempt was successful';
