# Storage Bucket Quick Reference

## Bucket Configuration

| Property | Value |
|----------|-------|
| **Name** | `newsletters` |
| **Privacy** | Private (requires authentication) |
| **File Size Limit** | 5MB (5242880 bytes) |
| **MIME Types** | None (validated in app code) |

## File Naming Convention

```
{timestamp}_{original_filename}.md
```

**Example:**
```
1704067200000_january-2024-newsletter.md
```

## RLS Policies

All policies restrict access to: `admin@techieneighbor.net`

| Policy Name | Operation | Purpose |
|-------------|-----------|---------|
| Admin can read newsletters | SELECT | View/download files |
| Admin can insert newsletters | INSERT | Upload new files |
| Admin can update newsletters | UPDATE | Modify existing files |
| Admin can delete newsletters | DELETE | Remove files |

## Access Methods

### Client-Side (Browser)
```typescript
import { supabase } from '$lib/supabase';

// Upload file (requires admin authentication)
const { data, error } = await supabase.storage
  .from('newsletters')
  .upload(storagePath, file);

// Download file
const { data, error } = await supabase.storage
  .from('newsletters')
  .download(storagePath);

// Delete file
const { error } = await supabase.storage
  .from('newsletters')
  .remove([storagePath]);
```

### Server-Side (API Routes)
```typescript
import { supabaseAdmin } from '$lib/supabase';

// Upload file (bypasses RLS)
const { data, error } = await supabaseAdmin.storage
  .from('newsletters')
  .upload(storagePath, file);
```

## Verification Commands

Run in Supabase SQL Editor:

```sql
-- Check bucket exists
SELECT * FROM storage.buckets WHERE name = 'newsletters';

-- Check policies exist
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%newsletters%';

-- Count files in bucket
SELECT COUNT(*) 
FROM storage.objects 
WHERE bucket_id = 'newsletters';
```

## Common Operations

### Upload Flow
1. Admin authenticates
2. Client validates file (.md, <5MB)
3. Generate unique storage path
4. Upload to bucket
5. Create metadata record in `newsletter_metadata` table

### Delete Flow
1. Admin authenticates
2. Delete file from bucket
3. Delete metadata record from `newsletter_metadata` table
4. Both operations must succeed (transaction)

## Troubleshooting

| Error | Cause | Solution |
|-------|-------|----------|
| "new row violates row-level security policy" | Not authenticated as admin | Login as admin@techieneighbor.net |
| "Bucket not found" | Bucket not created | Create bucket in Storage dashboard |
| "File size exceeds limit" | File >5MB | Compress or split file |
| "Permission denied" | Missing RLS policy | Apply storage policies |

## Related Files

- **Migration**: `supabase/migrations/005_create_storage_bucket.sql`
- **Setup Guide**: `supabase/CREATE_STORAGE_BUCKET.md`
- **Client Config**: `src/lib/supabase.ts`
- **Metadata Table**: `newsletter_metadata` (migration 001)

## Requirements Validated

- ✅ Requirement 2.3: Newsletter file storage with metadata
- ✅ Requirement 3.7: Delete removes from storage
- ✅ Requirement 5.1: Secure storage with admin-only access
