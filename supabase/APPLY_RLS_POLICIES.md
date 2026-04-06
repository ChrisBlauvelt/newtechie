# How to Apply RLS Policies (Task 2.4)

This guide walks you through applying the Row Level Security policies for the Admin Newsletter Dashboard.

## Prerequisites

✅ Supabase project created  
✅ Tables created (migrations 001, 002, 003 applied)  
✅ Admin user created in Supabase (email: admin@techieneighbor.net)  

## Step-by-Step Instructions

### Step 1: Open Supabase SQL Editor

1. Go to https://supabase.com and log in
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Apply RLS Policies

Copy and paste the entire contents of `supabase/migrations/004_create_rls_policies.sql` into the SQL Editor and click **Run**.

The migration will:
- Enable RLS on all three tables
- Create admin-only policies for newsletter_metadata
- Create admin-only policies for newsletter_distributions  
- Create public read + service insert policies for rate_limit_log

### Step 3: Verify Policies Were Created

1. Go to **Authentication** → **Policies** in the left sidebar
2. You should see three tables listed with their policies:

**newsletter_metadata**
- ✓ Policy: "Admin only access to newsletter_metadata"

**newsletter_distributions**
- ✓ Policy: "Admin only access to newsletter_distributions"

**rate_limit_log**
- ✓ Policy: "Public read access to rate_limit_log"
- ✓ Policy: "Service role can insert rate_limit_log"

### Step 4: Test the Policies (Optional)

Run these test queries in the SQL Editor:

```sql
-- Test 1: Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('newsletter_metadata', 'newsletter_distributions', 'rate_limit_log');
-- All should show rowsecurity = true

-- Test 2: Check policies exist
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('newsletter_metadata', 'newsletter_distributions', 'rate_limit_log');
-- Should show all 4 policies
```

## What These Policies Do

### 🔒 newsletter_metadata (Admin Only)
- **Who can access**: Only admin@techieneighbor.net
- **What they can do**: SELECT, INSERT, UPDATE, DELETE
- **Why**: Protects newsletter content from unauthorized access

### 🔒 newsletter_distributions (Admin Only)
- **Who can access**: Only admin@techieneighbor.net
- **What they can do**: SELECT, INSERT, UPDATE, DELETE
- **Why**: Protects distribution history and subscriber data

### 🔓 rate_limit_log (Public Read, Service Write)
- **Who can read**: Anyone (needed for rate limit checks)
- **Who can write**: Only server-side code with service role key
- **Why**: Allows rate limiting to work without authentication, but prevents abuse

## Security Model

```
┌─────────────────────────────────────────────────────────┐
│                    Client (Browser)                      │
│                                                          │
│  Uses: PUBLIC_SUPABASE_ANON_KEY                         │
│  Can access: rate_limit_log (read only)                 │
│  Cannot access: newsletter_metadata, distributions      │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│              Authenticated Admin User                    │
│                                                          │
│  Email: admin@techieneighbor.net                        │
│  Can access: ALL tables (full CRUD)                     │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│              Server (SvelteKit API Routes)               │
│                                                          │
│  Uses: SUPABASE_SERVICE_ROLE_KEY                        │
│  Can access: ALL tables (bypasses RLS)                  │
│  Used for: Recording rate limit attempts                │
└─────────────────────────────────────────────────────────┘
```

## Troubleshooting

### Error: "new row violates row-level security policy"

**Cause**: Trying to insert/update as non-admin user

**Solution**: 
1. Verify you're logged in as admin@techieneighbor.net
2. Check the admin user exists in Authentication → Users
3. Ensure the email matches exactly (case-sensitive)

### Error: "permission denied for table"

**Cause**: RLS is enabled but no policies exist

**Solution**: Re-run the migration 004 SQL script

### Policies not appearing in dashboard

**Cause**: Migration didn't run successfully

**Solution**: 
1. Check for SQL errors in the SQL Editor
2. Ensure tables exist before creating policies
3. Try running each policy CREATE statement individually

## Next Steps

After applying RLS policies:

✅ Task 2.4 complete  
➡️ Continue to Task 2.5: Create Supabase Storage bucket  
➡️ Then Task 3.1: Implement authentication service  

## Requirements Validated

- ✅ Requirement 1.5: Single admin user access restriction
- ✅ Requirement 5.1: Secure admin dashboard with authentication
- ✅ Requirement 5.4: Rate limiting implementation support
