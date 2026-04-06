# Resend Email Service Setup Guide

This guide walks you through setting up Resend for the TechieNeighbor contact form email delivery.

## Table of Contents

1. [Creating a Resend Account](#1-creating-a-resend-account)
2. [Obtaining an API Key](#2-obtaining-an-api-key)
3. [Verifying Your Sending Domain](#3-verifying-your-sending-domain)
4. [Local Development Setup](#4-local-development-setup)
5. [Vercel Production Setup](#5-vercel-production-setup)
6. [Testing Email Delivery](#6-testing-email-delivery)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. Creating a Resend Account

1. Visit [https://resend.com](https://resend.com)
2. Click the **"Sign Up"** button in the top right corner
3. Create your account using:
   - Email and password, or
   - GitHub authentication (recommended for developers)
4. Verify your email address by clicking the link sent to your inbox
5. Complete your profile information

**Note**: Resend offers a generous free tier (100 emails/day) which is perfect for contact form usage.

---

## 2. Obtaining an API Key

1. Log into your Resend dashboard at [https://resend.com/dashboard](https://resend.com/dashboard)
2. Navigate to the **"API Keys"** section in the left sidebar
3. Click **"Create API Key"**
4. Configure your API key:
   - **Name**: Give it a descriptive name (e.g., "TechieNeighbor Production" or "TechieNeighbor Development")
   - **Permission**: Select "Sending access" (this is all you need for the contact form)
   - **Domain**: Select your verified domain (or "All Domains" if you haven't verified yet)
5. Click **"Create"**
6. **IMPORTANT**: Copy the API key immediately - it will only be shown once!
   - The key will look like: `re_123abc456def789ghi012jkl345mno678`
7. Store the key securely (you'll need it for environment variables)

**Security Best Practices**:
- Never commit API keys to version control
- Use different API keys for development and production
- Rotate keys periodically
- If a key is exposed, delete it immediately and create a new one

---

## 3. Verifying Your Sending Domain

Domain verification is required to send emails from your custom domain (e.g., `noreply@techieneighbor.net`).

### Step 1: Add Your Domain

1. In the Resend dashboard, navigate to **"Domains"**
2. Click **"Add Domain"**
3. Enter your domain name: `techieneighbor.net`
4. Click **"Add"**

### Step 2: Configure DNS Records

Resend will provide you with DNS records to add to your domain. You'll need to add these through your domain registrar or DNS provider.

#### SPF Record (Sender Policy Framework)

**IMPORTANT FOR PROTONMAIL USERS**: If you already have an SPF record for ProtonMail, you need to merge them. You cannot have multiple SPF records - they must be combined into one.

**Existing ProtonMail SPF record**:
```
v=spf1 include:_spf.protonmail.ch ~all
```

**Merged SPF record (ProtonMail + Resend)**:
```
v=spf1 include:_spf.protonmail.ch include:amazonses.com ~all
v=spf1 include:amazonses.com ~al
```

**What this means**:
- Both ProtonMail and Resend are authorized to send email from your domain
- Adding Resend will NOT break your ProtonMail email
- The SPF record tells receiving mail servers that both services are legitimate

**How to update**:
1. Log into your domain registrar (e.g., Namecheap, GoDaddy, Cloudflare)
2. Find your existing SPF TXT record
3. Edit it to include both `include:_spf.protonmail.ch` and `include:_spf.resend.com`
4. Save the changes

#### DKIM Record (DomainKeys Identified Mail)

DKIM records are service-specific and won't conflict with ProtonMail.

Resend will provide a DKIM record that looks like:
```
Type: TXT
Name: resend._domainkey
Value: p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC... (long string)
```

**How to add**:
1. In your DNS provider, create a new TXT record
2. Set the name/host to: `resend._domainkey`
3. Set the value to the long string provided by Resend
4. Save the record

#### DMARC Record (Optional but Recommended)

If you don't already have a DMARC record, add one:
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:your-email@techieneighbor.net
```

If you already have a DMARC record for ProtonMail, no changes are needed.

### Step 3: Verify DNS Propagation

1. After adding the DNS records, return to the Resend dashboard
2. Click **"Verify"** next to your domain
3. DNS propagation can take 5-10 minutes (sometimes up to 48 hours)
4. Once verified, the status will show **"Verified"** with a green checkmark

**Tip**: Use [https://mxtoolbox.com/SuperTool.aspx](https://mxtoolbox.com/SuperTool.aspx) to check if your DNS records have propagated.

---

## 4. Local Development Setup

### Step 1: Create Environment File

1. In your project root directory, create a file named `.env.local`
2. Add the following variables:

```env
RESEND_API_KEY=re_your_actual_api_key_here
RESEND_FROM_EMAIL=noreply@techieneighbor.net
RESEND_TO_EMAIL=your-personal-email@example.com
```

**Variable Descriptions**:
- `RESEND_API_KEY`: Your Resend API key from step 2
- `RESEND_FROM_EMAIL`: The "from" address for emails (must be from your verified domain)
- `RESEND_TO_EMAIL`: Where contact form submissions should be sent (your personal email)

### Step 2: Secure the Environment File

1. Ensure `.env.local` is in your `.gitignore` file
2. Check your `.gitignore`:

```bash
cat .gitignore | grep .env.local
```

3. If it's not there, add it:

```bash
echo ".env.local" >> .gitignore
```

### Step 3: Restart Development Server

After creating `.env.local`, restart your development server:

```bash
pnpm dev
```

SvelteKit will automatically load the environment variables.

---

## 5. Vercel Production Setup

### Step 1: Access Environment Variables

1. Open your project in the Vercel dashboard
2. Navigate to **Settings** → **Environment Variables**

### Step 2: Add Variables

Add each of the following variables:

#### RESEND_API_KEY
- **Key**: `RESEND_API_KEY`
- **Value**: Your production API key (from step 2)
- **Environments**: Check "Production" and "Preview" (optional)
- Click **"Save"**

#### RESEND_FROM_EMAIL
- **Key**: `RESEND_FROM_EMAIL`
- **Value**: `noreply@techieneighbor.net`
- **Environments**: Check "Production" and "Preview"
- Click **"Save"**

#### RESEND_TO_EMAIL
- **Key**: `RESEND_TO_EMAIL`
- **Value**: Your personal email address
- **Environments**: Check "Production" and "Preview"
- Click **"Save"**

### Step 3: Redeploy

After adding environment variables, you need to redeploy:

1. Go to the **"Deployments"** tab
2. Click the three dots (**...**) on the latest deployment
3. Select **"Redeploy"**
4. Or push a new commit to trigger automatic deployment

**Note**: Environment variables are only loaded during build time, so redeployment is required.

---

## 6. Testing Email Delivery

### Local Testing

1. Start your development server: `pnpm dev`
2. Navigate to your contact form
3. Fill out the form with test data:
   - **Name**: Test User
   - **Email**: your-test-email@example.com
   - **Message**: This is a test message
4. Submit the form
5. Check your inbox (the email specified in `RESEND_TO_EMAIL`)

### Production Testing

1. After deploying to Vercel, visit your live site
2. Submit a test message through the contact form
3. Verify the email arrives in your inbox

### Checking Delivery Status

1. Log into the Resend dashboard
2. Navigate to **"Logs"** in the left sidebar
3. You'll see all sent emails with their status:
   - ✅ **Delivered**: Email was successfully delivered
   - ⏳ **Queued**: Email is being processed
   - ❌ **Failed**: Email delivery failed (check error details)

### What to Check

- **Email arrives**: Verify you receive the email
- **From address**: Should be `noreply@techieneighbor.net`
- **Reply-to address**: Should be the user's submitted email
- **Subject line**: Should be "Contact Form Submission from [Name]"
- **Email content**: Should include name, email, and message
- **Formatting**: Should be properly formatted HTML

---

## 7. Troubleshooting

### Email Not Received

**Check spam folder**:
- Contact form emails might be filtered as spam initially
- Mark as "Not Spam" to train your email provider

**Verify DNS records**:
- Ensure SPF, DKIM, and DMARC records are properly configured
- Use [MXToolbox](https://mxtoolbox.com/SuperTool.aspx) to verify
- DNS changes can take up to 48 hours to propagate

**Check Resend logs**:
- Log into Resend dashboard → Logs
- Look for error messages or delivery status
- Common issues: "Domain not verified", "Invalid API key"

### API Key Errors

**Error: "Invalid API key"**:
- Verify the API key is correctly copied (no extra spaces)
- Ensure the key starts with `re_`
- Check that the key hasn't been deleted in Resend dashboard
- Verify environment variables are set correctly

**Error: "Missing API key"**:
- Ensure `.env.local` exists in project root
- Restart your development server after creating `.env.local`
- For Vercel, ensure environment variables are set and redeployed

### Domain Verification Issues

**Domain shows "Pending" status**:
- DNS records may not have propagated yet (wait 10-30 minutes)
- Verify DNS records are added correctly
- Check for typos in record names or values
- Some DNS providers require a trailing dot (e.g., `resend._domainkey.`)

**SPF record conflicts**:
- You can only have ONE SPF record per domain
- If you have multiple services, merge them into one record
- Example: `v=spf1 include:service1.com include:service2.com ~all`

### Rate Limiting

**Error: "Rate limit exceeded"**:
- Free tier: 100 emails/day
- Paid tier: Higher limits based on plan
- Implement client-side rate limiting (e.g., 1 submission per minute)
- Consider adding CAPTCHA for additional protection

### Email Formatting Issues

**HTML not rendering**:
- Verify your email client supports HTML emails
- Check the HTML structure in your email template
- Test with different email clients (Gmail, Outlook, etc.)

**Special characters broken**:
- Ensure proper UTF-8 encoding
- Escape special HTML characters in user input
- Test with various character sets (emojis, accents, etc.)

### Network Errors

**Error: "Failed to fetch" or "Network error"**:
- Check your internet connection
- Verify Resend API is operational: [https://resend.com/status](https://resend.com/status)
- Check for firewall or proxy blocking API requests
- Ensure your server can make outbound HTTPS requests

### Vercel Deployment Issues

**Environment variables not working**:
- Verify variables are set in Vercel dashboard
- Ensure you've redeployed after adding variables
- Check variable names match exactly (case-sensitive)
- Verify variables are enabled for the correct environment (Production/Preview)

**Build errors**:
- Check Vercel build logs for specific errors
- Ensure all dependencies are installed
- Verify `package.json` includes `resend` package

---

## Additional Resources

- **Resend Documentation**: [https://resend.com/docs](https://resend.com/docs)
- **Resend API Reference**: [https://resend.com/docs/api-reference](https://resend.com/docs/api-reference)
- **Resend Status Page**: [https://resend.com/status](https://resend.com/status)
- **DNS Checker**: [https://mxtoolbox.com](https://mxtoolbox.com)
- **SPF Record Checker**: [https://mxtoolbox.com/spf.aspx](https://mxtoolbox.com/spf.aspx)

---

## Support

If you encounter issues not covered in this guide:

1. Check the Resend documentation
2. Review Resend dashboard logs for specific error messages
3. Contact Resend support: [https://resend.com/support](https://resend.com/support)
4. Check the project's GitHub issues for similar problems

---

**Last Updated**: January 2026
