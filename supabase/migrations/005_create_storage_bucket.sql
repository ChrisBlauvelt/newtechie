-- Migration 005: Create Supabase Storage bucket for newsletters
-- Task 2.5: Create Supabase Storage bucket for newsletters
-- Requirements: 2.3, 3.7

-- Create the newsletters bucket (private)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'newsletters',
  'newsletters',
  false,  -- Private bucket
  5242880,  -- 5MB file size limit
  NULL  -- No MIME type restrictions (validated in application code)
)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects (should already be enabled by default)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Admin can read newsletters" ON storage.objects;
DROP POLICY IF EXISTS "Admin can insert newsletters" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update newsletters" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete newsletters" ON storage.objects;

-- Policy 1: Admin can read newsletter files
CREATE POLICY "Admin can read newsletters"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'newsletters' 
  AND auth.uid() = (SELECT id FROM auth.users WHERE email = 'admin@techieneighbor.net')
);

-- Policy 2: Admin can upload newsletter files
CREATE POLICY "Admin can insert newsletters"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'newsletters' 
  AND auth.uid() = (SELECT id FROM auth.users WHERE email = 'admin@techieneighbor.net')
);

-- Policy 3: Admin can update newsletter files
CREATE POLICY "Admin can update newsletters"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'newsletters' 
  AND auth.uid() = (SELECT id FROM auth.users WHERE email = 'admin@techieneighbor.net')
);

-- Policy 4: Admin can delete newsletter files
CREATE POLICY "Admin can delete newsletters"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'newsletters' 
  AND auth.uid() = (SELECT id FROM auth.users WHERE email = 'admin@techieneighbor.net')
);

-- Add comments for documentation
COMMENT ON POLICY "Admin can read newsletters" ON storage.objects IS 
  'Allows admin@techieneighbor.net to read files from the newsletters bucket';

COMMENT ON POLICY "Admin can insert newsletters" ON storage.objects IS 
  'Allows admin@techieneighbor.net to upload files to the newsletters bucket';

COMMENT ON POLICY "Admin can update newsletters" ON storage.objects IS 
  'Allows admin@techieneighbor.net to update files in the newsletters bucket';

COMMENT ON POLICY "Admin can delete newsletters" ON storage.objects IS 
  'Allows admin@techieneighbor.net to delete files from the newsletters bucket';

-- Verification queries (commented out, run manually to verify)
-- SELECT * FROM storage.buckets WHERE name = 'newsletters';
-- SELECT policyname, cmd FROM pg_policies WHERE tablename = 'objects' AND policyname LIKE '%newsletters%';
