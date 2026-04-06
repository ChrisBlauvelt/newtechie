# How to Create Supabase Storage Bucket (Task 2.5)

This guide walks you through creating the Supabase Storage bucket for newsletter files.

## Prerequisites

✅ Supabase project created  
✅ Tables created (migrations 001, 002, 003 applied)  
✅ RLS policies applied (migration 004)  
✅ Admin user created in Supabase (email: admin@techieneighbor.net)  

## Step-by-Step Instructions

### Step 1: Open Supabase Storage

1. Go to https://supabase.com and log in
2. Select your project
3. Click **Storage** in the left sidebar
4. Click **New bucket** button

### Step 2: Create the Newsletters Bucket

Fill in the bucket creation form:

- **Name**: `newsletters`
- **Public bucket**: ❌ **UNCHECK THIS** (bucket must be private)
- **File size limit**: Leave default or set to 5MB (5242880 bytes)
- **Allowed MIME types**: Leave empty (we'll validate .md files in application code)

Click **Create bucket**

### Step 3: Configure Bucket Policies

After creating the bucket, you need to set up Row Level Security policies for admin-only access.

1. In the Storage section, click on the **Policies** tab
2. You should see your `newsletters` bucket listed
3. Click **New policy** for the newsletters bucket

### Step 4: Create Admin-Only Read Policy

Create a policy for reading files:

- **Policy name**: `Admin can read newsletters`
- **Allowed operation**: SELECT
- **Policy definition**: 

```sql
(auth.uid() = (SELECT id FROM auth.users WHERE email = 'admin@techieneighbor.net'))
```

- **Target roles**: authenticated
- Click **Review** then **Save policy**

### Step 5: Create Admin-Only Insert Policy

Create a policy for uploading files:

- **Policy name**: `Admin can insert newsletters`
- **Allowed operation**: INSERT
- **Policy definition**: 

```sql
(auth.uid() = (SELECT id FROM auth.users WHERE email = 'admin@techieneighbor.net'))
```

- **Target roles**: authenticated
- Click **Review** then **Save policy**

### Step 6: Create Admin-Only Update Policy

Create a policy for updating files:

- **Policy name**: `Admin can update newsletters`
- **Allowed operation**: UPDATE
- **Policy definition**: 

```sql
(auth.uid() = (SELECT id FROM auth.users WHERE email = 'admin@techieneighbor.net'))
```

- **Target roles**: authenticated
- Click **Review** then **Save policy**

### Step 7: Create Admin-Only Delete Policy

Create a policy for deleting files:

- **Policy name**: `Admin can delete newsletters`
- **Allowed operation**: DELETE
- **Policy definition**: 

```sql
(auth.uid() = (SELECT id FROM auth.users WHERE email = 'admin@techieneighbor.net'))
```

- **Target roles**: authenticated
- Click **Review** then **Save policy**

### Step 8: Verify Bucket Configuration

1. Go back to **Storage** → **Buckets**
2. You should see the `newsletters` bucket listed
3. Verify it shows:
   - 🔒 **Private** (not public)
   - 📁 **0 objects** (empty, as expected)
4. Click on the bucket name to view its contents (should be empty)
5. Click the **Policies** tab to verify all 4 policies are listed

## Alternative: Using SQL to Create Policies

If you prefer to use SQL, you can run this in the SQL Editor:

```sql
-- Enable RLS on storage.objects for the newsletters bucket
-- (RLS should already be enabled by default)

-- Admin can read newsletters
CREATE POLICY "Admin can read newsletters"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'newsletters' 
  AND auth.uid() = (SELECT id FROM auth.users WHERE email = 'admin@techieneighbor.net')
);

-- Admin can insert newsletters
CREATE POLICY "Admin can insert newsletters"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'newsletters' 
  AND auth.uid() = (SELECT id FROM auth.users WHERE email = 'admin@techieneighbor.net')
);

-- Admin can update newsletters
CREATE POLICY "Admin can update newsletters"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'newsletters' 
  AND auth.uid() = (SELECT id FROM auth.users WHERE email = 'admin@techieneighbor.net')
);

-- Admin can delete newsletters
CREATE POLICY "Admin can delete newsletters"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'newsletters' 
  AND auth.uid() = (SELECT id FROM auth.users WHERE email = 'admin@techieneighbor.net')
);
```

## What This Bucket Does

### 🗂️ Storage Structure

- **Bucket name**: `newsletters`
- **Privacy**: Private (requires authentication)
- **File naming convention**: `{timestamp}_{original_filename}.md`
- **Example path**: `newsletters/1704067200000_january-2024-newsletter.md`

### 🔒 Security Model

```
┌─────────────────────────────────────────────────────────┐
│                    Client (Browser)                      │
│                                                          │
│  Uses: PUBLIC_SUPABASE_ANON_KEY                         │
│  Cannot access: newsletters bucket (private)            │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│              Authenticated Admin User                    │
│                                                          │
│  Email: admin@techieneighbor.net                        │
│  Can: Upload, read, update, delete newsletter files     │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│              Server (SvelteKit API Routes)               │
│                                                          │
│  Uses: SUPABASE_SERVICE_ROLE_KEY                        │
│  Can: Full access to bucket (bypasses RLS)              │
│  Used for: Server-side file operations                  │
└─────────────────────────────────────────────────────────┘
```

## Testing the Bucket

### Test 1: Verify Bucket Exists

Run this query in the SQL Editor:

```sql
SELECT * FROM storage.buckets WHERE name = 'newsletters';
```

You should see one row with:
- `name`: newsletters
- `public`: false

### Test 2: Verify Policies Exist

Run this query in the SQL Editor:

```sql
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%newsletters%';
```

You should see 4 policies:
- Admin can read newsletters (SELECT)
- Admin can insert newsletters (INSERT)
- Admin can update newsletters (UPDATE)
- Admin can delete newsletters (DELETE)

### Test 3: Try Uploading a Test File (Optional)

You can test the bucket by uploading a test file through the Supabase dashboard:

1. Go to **Storage** → **newsletters** bucket
2. Click **Upload file**
3. Select any .md file from your computer
4. The upload should succeed if you're logged in as admin

**Note**: You can delete this test file after verifying the upload works.

## Troubleshooting

### Error: "Bucket already exists"

**Cause**: The bucket was already created

**Solution**: 
1. Go to Storage → Buckets
2. Verify the `newsletters` bucket exists
3. Check if it's private (not public)
4. Proceed to configure policies

### Error: "new row violates row-level security policy"

**Cause**: Trying to upload as non-admin user or policies not configured

**Solution**: 
1. Verify you're logged in as admin@techieneighbor.net
2. Check that all 4 storage policies are created
3. Ensure the admin user exists in Authentication → Users

### Error: "Policy already exists"

**Cause**: Policies were already created

**Solution**: 
1. Go to Storage → Policies
2. Verify all 4 policies exist for the newsletters bucket
3. If they exist, you're done!

### Cannot see the bucket in the dashboard

**Cause**: Bucket creation failed or you're in the wrong project

**Solution**: 
1. Verify you're in the correct Supabase project
2. Try refreshing the page
3. Check the browser console for errors
4. Try creating the bucket again

## File Upload Flow

Once the bucket is configured, here's how file uploads will work:

1. Admin logs in to the dashboard
2. Admin selects a .md file to upload
3. Client validates file (extension, size)
4. Client sends file to `/api/newsletters` endpoint
5. Server validates file again
6. Server generates unique storage path: `{timestamp}_{filename}.md`
7. Server uploads file to `newsletters` bucket using admin client
8. Server creates metadata record in `newsletter_metadata` table
9. Server returns success response
10. Client displays success message

## Next Steps

After creating the storage bucket:

✅ Task 2.5 complete  
➡️ Continue to Task 3.1: Implement authentication service  
➡️ Then Task 4.1: Implement newsletter repository  

## Requirements Validated

- ✅ Requirement 2.3: Newsletter file storage with metadata
- ✅ Requirement 3.7: Delete removes from storage
- ✅ Requirement 5.1: Secure storage with admin-only access

