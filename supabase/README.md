# Supabase Database Migrations

This directory contains SQL migration files for the Admin Newsletter Dashboard feature.

## Migration Files

1. `001_create_newsletter_metadata.sql` - Creates the newsletter metadata table
2. `002_create_newsletter_distributions.sql` - Creates the distribution tracking table
3. `003_create_rate_limit_log.sql` - Creates the rate limiting log table
4. `004_create_rls_policies.sql` - Sets up Row Level Security policies

## Applying Migrations

### Option 1: Using Supabase Dashboard (Recommended for initial setup)

1. Log in to your Supabase project dashboard at https://supabase.com
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the contents of each migration file in order (001, 002, 003, 004)
5. Click **Run** to execute each migration
6. Verify the tables and policies were created in the **Table Editor** and **Authentication > Policies** sections

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
# Initialize Supabase in your project (if not already done)
supabase init

# Link to your remote project
supabase link --project-ref your-project-ref

# Push migrations to your remote database
supabase db push
```

### Option 3: Manual Execution via psql

If you have direct database access:

```bash
psql "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres" \
  -f supabase/migrations/001_create_newsletter_metadata.sql \
  -f supabase/migrations/002_create_newsletter_distributions.sql \
  -f supabase/migrations/003_create_rate_limit_log.sql \
  -f supabase/migrations/004_create_rls_policies.sql
```

## Row Level Security (RLS) Policies

The RLS policies enforce the following security rules:

### newsletter_metadata
- **Policy**: Admin only access
- **Effect**: Only the admin user (admin@techieneighbor.net) can SELECT, INSERT, UPDATE, or DELETE newsletter metadata
- **Requirements**: 1.5, 5.1

### newsletter_distributions
- **Policy**: Admin only access
- **Effect**: Only the admin user (admin@techieneighbor.net) can SELECT, INSERT, UPDATE, or DELETE distribution records
- **Requirements**: 1.5, 5.1

### rate_limit_log
- **Policy 1**: Public read access
  - **Effect**: Anyone can SELECT from rate_limit_log (needed for rate limiting checks)
- **Policy 2**: Service role can insert
  - **Effect**: Server-side code using the service role key can INSERT login attempts
- **Requirements**: 5.4, 5.5

## Verifying RLS Policies

After applying the migrations, verify the policies are active:

1. Go to **Authentication > Policies** in your Supabase dashboard
2. You should see:
   - `newsletter_metadata` with "Admin only access to newsletter_metadata" policy
   - `newsletter_distributions` with "Admin only access to newsletter_distributions" policy
   - `rate_limit_log` with two policies: "Public read access" and "Service role can insert"

## Admin User Setup

The RLS policies reference the admin user email: `admin@techieneighbor.net`

**Important**: You must create this admin user in Supabase before the policies will work:

1. Go to **Authentication > Users** in your Supabase dashboard
2. Click **Add User** → **Create new user**
3. Enter:
   - Email: `admin@techieneighbor.net`
   - Password: (choose a strong password)
   - Auto Confirm User: ✓ (checked)
4. Click **Create User**

## Testing RLS Policies

To test that RLS is working correctly:

### Test 1: Admin can access newsletter_metadata
```sql
-- Run this in SQL Editor while authenticated as admin user
SELECT * FROM newsletter_metadata;
-- Should return results (or empty if no data yet)
```

### Test 2: Non-admin cannot access newsletter_metadata
```sql
-- Run this in SQL Editor with anon key (not authenticated)
SELECT * FROM newsletter_metadata;
-- Should return 0 rows due to RLS
```

### Test 3: Anyone can read rate_limit_log
```sql
-- Run this in SQL Editor with anon key
SELECT * FROM rate_limit_log;
-- Should return results (or empty if no data yet)
```

## Troubleshooting

### "new row violates row-level security policy"
- Ensure you're authenticated as the admin user (admin@techieneighbor.net)
- Verify the admin user exists in Authentication > Users
- Check that the email matches exactly in the policy

### "permission denied for table"
- Ensure RLS is enabled on the table: `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`
- Verify the policies exist: Check Authentication > Policies in dashboard

### Policies not working
- Make sure you applied migration 004 after creating the tables
- Try disabling and re-enabling RLS on the table
- Verify the policy SQL syntax is correct

## Security Notes

- The service role key bypasses RLS - keep it secret and only use server-side
- The anon key respects RLS - safe to use in client-side code
- Rate limiting logs are publicly readable but only insertable by server
- All newsletter data is restricted to the single admin user
