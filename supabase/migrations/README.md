# Database Migrations

This directory contains SQL migration files for the Supabase database schema.

## Running Migrations

There are two ways to run these migrations:

### Option 1: Using Supabase SQL Editor (Recommended for Manual Setup)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New query**
4. Copy the contents of the migration file (e.g., `001_create_newsletter_metadata.sql`)
5. Paste into the SQL editor
6. Click **Run** to execute the migration
7. Verify the table was created by going to **Table Editor**

### Option 2: Using Supabase CLI (For Automated Deployments)

If you have the Supabase CLI installed:

```bash
# Initialize Supabase in your project (first time only)
supabase init

# Link to your remote project
supabase link --project-ref your-project-ref

# Push migrations to your remote database
supabase db push
```

## Migration Files

- `001_create_newsletter_metadata.sql` - Creates the newsletter_metadata table with indexes
- `002_create_newsletter_distributions.sql` - Creates the newsletter_distributions table with indexes
- `003_create_rate_limit_log.sql` - Creates the rate_limit_log table with indexes for rate limiting
- `004_create_rls_policies.sql` - Creates Row Level Security policies for all tables
- `005_create_storage_bucket.sql` - Creates the newsletters storage bucket with RLS policies

## Verifying Migrations

After running a migration, verify it was successful:

### For newsletter_metadata table:

1. Go to **Table Editor** in Supabase dashboard
2. Look for the `newsletter_metadata` table
3. Check that all columns are present:
   - id (uuid, primary key)
   - filename (text)
   - storage_path (text, unique)
   - upload_date (timestamptz)
   - last_modified (timestamptz)
   - file_size (integer)
   - sent_date (timestamptz, nullable)
   - recipient_count (integer, nullable)
   - created_by (uuid, foreign key to auth.users)

### For newsletter_distributions table:

1. Go to **Table Editor** in Supabase dashboard
2. Look for the `newsletter_distributions` table
3. Check that all columns are present:
   - id (uuid, primary key)
   - newsletter_id (uuid, foreign key to newsletter_metadata)
   - sent_at (timestamptz)
   - total_recipients (integer)
   - successful_count (integer)
   - failed_count (integer)
   - failures (jsonb, nullable)

### For rate_limit_log table:

1. Go to **Table Editor** in Supabase dashboard
2. Look for the `rate_limit_log` table
3. Check that all columns are present:
   - id (uuid, primary key)
   - ip_address (inet)
   - attempt_time (timestamptz)
   - success (boolean)

### For newsletters storage bucket:

1. Go to **Storage** in Supabase dashboard
2. Look for the `newsletters` bucket
3. Verify it shows:
   - 🔒 **Private** (not public)
   - File size limit: 5MB
4. Click the **Policies** tab
5. Verify 4 policies exist:
   - Admin can read newsletters (SELECT)
   - Admin can insert newsletters (INSERT)
   - Admin can update newsletters (UPDATE)
   - Admin can delete newsletters (DELETE)

## Next Steps

After running all migrations:

1. ✅ Create database tables (Migrations 001, 002, 003)
2. ✅ Set up Row Level Security policies (Migration 004)
3. ✅ Create Supabase Storage bucket (Migration 005)
4. ➡️ Implement authentication service (Task 3.1)
5. ➡️ Implement newsletter repository (Task 4.1)
