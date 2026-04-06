# Supabase Setup Guide for Admin Newsletter Dashboard

This guide walks you through setting up Supabase for the admin newsletter dashboard feature.

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in (or create an account)
2. Click "New Project"
3. Fill in the project details:
   - **Name**: `techieneighbor-admin` (or your preferred name)
   - **Database Password**: Generate a strong password and save it securely
   - **Region**: Choose the region closest to your users (e.g., `us-east-1`)
4. Click "Create new project"
5. Wait for the project to finish setting up (this takes 1-2 minutes)

## Step 2: Get Your Supabase Credentials

Once your project is ready:

1. Go to **Project Settings** (gear icon in the sidebar)
2. Click on **API** in the left menu
3. You'll see three important values:
   - **Project URL**: This is your `PUBLIC_SUPABASE_URL`
   - **anon public**: This is your `PUBLIC_SUPABASE_ANON_KEY`
   - **service_role**: This is your `SUPABASE_SERVICE_ROLE_KEY` (click "Reveal" to see it)

⚠️ **Important**: The `service_role` key has admin privileges and should NEVER be exposed to the client. Keep it secret!

## Step 3: Configure Authentication

1. In your Supabase dashboard, go to **Authentication** → **Providers**
2. Ensure **Email** is enabled (it should be by default)
3. Go to **Authentication** → **URL Configuration**
4. Set the **Site URL** to your production URL: `https://techieneighbor.net`
5. Add **Redirect URLs**:
   - `http://localhost:3000/admin/dashboard` (for development)
   - `https://techieneighbor.net/admin/dashboard` (for production)

## Step 4: Create Admin User Account

1. Go to **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Fill in:
   - **Email**: `admin@techieneighbor.net` (or your preferred admin email)
   - **Password**: Create a strong password and save it securely
   - **Auto Confirm User**: ✅ Check this box (so you don't need to verify email)
4. Click **Create user**
5. **Important**: Save this email and password - you'll use them to log into the admin dashboard

## Step 5: Set Up Environment Variables

### For Development (.env.local)

Add these variables to your `.env.local` file:

```env
# Supabase Configuration
PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Admin Configuration
ADMIN_EMAIL=admin@techieneighbor.net

# Klaviyo Configuration (you'll set this up later)
KLAVIYO_API_KEY=pk_xxxxx
KLAVIYO_LIST_ID=xxxxx
```

Replace the placeholder values with your actual credentials from Step 2.

### For Production (Vercel)

When you're ready to deploy:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each of the above variables:
   - Variable name: `PUBLIC_SUPABASE_URL`
   - Value: Your Supabase URL
   - Environment: Select **Production**, **Preview**, and **Development**
4. Repeat for all variables
5. Redeploy your application for the changes to take effect

## Step 6: Verify Setup

To verify everything is working:

1. Make sure your `.env.local` file has all the required variables
2. Restart your development server: `pnpm dev`
3. The Supabase client should now be able to connect to your project

## Next Steps

After completing this setup:

1. ✅ Task 1 is complete
2. Next, you'll create the database schema (tables and storage bucket) in Task 2
3. Then implement authentication in Task 3

## Troubleshooting

### "Invalid API key" error
- Double-check that you copied the full API keys (they're very long)
- Make sure there are no extra spaces or line breaks
- Verify the keys are in the correct environment variables

### "Project not found" error
- Verify your `PUBLIC_SUPABASE_URL` is correct
- Make sure your Supabase project is fully initialized (not still setting up)

### Authentication not working
- Ensure you created the admin user with "Auto Confirm User" checked
- Verify the email matches your `ADMIN_EMAIL` environment variable
- Check that Email authentication is enabled in Supabase

## Security Notes

- ⚠️ **Never commit** `.env.local` to git (it's already in `.gitignore`)
- ⚠️ **Never expose** `SUPABASE_SERVICE_ROLE_KEY` to the client
- ⚠️ Keep your admin password secure and use a password manager
- ⚠️ The service role key bypasses Row Level Security - only use it server-side

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [SvelteKit + Supabase Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-sveltekit)
