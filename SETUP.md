# Steelcareer Setup Guide

Complete step-by-step instructions for deploying Steelcareer from scratch.

## Table of Contents
1. [Supabase Setup](#supabase-setup)
2. [Database Migration](#database-migration)
3. [Authentication Configuration](#authentication-configuration)
4. [Storage Buckets](#storage-buckets)
5. [Admin User Creation](#admin-user-creation)
6. [Environment Variables](#environment-variables)
7. [Local Development](#local-development)
8. [Vercel Deployment](#vercel-deployment)
9. [Troubleshooting](#troubleshooting)

---

## Supabase Setup

### Step 1: Create a Supabase Project

1. Go to [app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Fill in:
   - **Name**: `steelcareer` (or your preferred name)
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
4. Click "Create new project" and wait for setup (5-10 minutes)

### Step 2: Get API Keys

1. Once project is created, go to **Settings** → **API**
2. Copy these values to a safe place:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Service role** key → `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

---

## Database Migration

### Step 1: Open SQL Editor

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"

### Step 2: Run Migration

1. Open `/supabase/migrations/001_init_steelcareer.sql`
2. Copy the entire SQL file content
3. Paste into the SQL Editor
4. Click **Run** (⌘+Enter or Ctrl+Enter)
5. Verify: You should see "Success" and all tables created

### Step 3: Verify Tables

1. Go to **Table Editor** in Supabase
2. Verify these tables exist:
   - `profiles`
   - `seekers`
   - `providers`
   - `job_postings`
   - `meetings`
   - `documents`
   - `applications`
   - `support_requests`

All tables should have green checkmarks (RLS enabled).

---

## Authentication Configuration

### Enable Email Confirmation (Recommended)

1. Go to **Authentication** → **Providers** → **Email**
2. Under "Email Auth", toggle **Confirm email** ON
   - This ensures users verify their email before accessing the platform
   - Unverified users cannot write to RLS-protected tables

### Configure Email Templates

1. Go to **Authentication** → **Email Templates**
2. Customize these templates:
   - **Confirm Email**: Add your branding/logo
   - **Magic Link**: (optional, for passwordless auth)
3. Update sender email if needed under **SMTP Settings**

### Set Auth Redirect URL

1. Go to **Authentication** → **URL Configuration**
2. Under "Redirect URLs", add:
   - **Local**: `http://localhost:3000/auth/callback`
   - **Production**: `https://yourdomain.com/auth/callback`

---

## Storage Buckets

Storage is optional but recommended for resume/document uploads.

### Create Resumes Bucket

1. Go to **Storage** → Click **Create Bucket**
2. Name: `resumes`
3. Toggle **Public bucket** ON
4. Click **Create bucket**
5. Click on bucket → **Policies** → **New Policy**
6. Select "For authenticated users"
7. Allow:
   - `SELECT` (read own files)
   - `INSERT` (upload own files)
   - `UPDATE` (update own files)
   - `DELETE` (delete own files)

### Create Documents Bucket

Repeat for `documents` bucket (for verified documents, admin verification).

### Create Temp Uploads Bucket (Private)

Repeat for `tmp-uploads` bucket, but:
- Toggle **Public bucket** OFF
- Only allow authenticated users

---

## Admin User Creation

⚠️ **Important**: Admins cannot be self-assigned. They must be created by the project owner.

### Step 1: Create Admin Auth User

1. Go to **Authentication** → **Users**
2. Click **Add user**
3. Fill in:
   - **Email**: your-email@example.com
   - **Password**: Generate a strong password
4. Click **Create user**

### Step 2: Assign Admin Role

1. Go to **SQL Editor** → New Query
2. Run this SQL (replace email):
   ```sql
   UPDATE auth.users
   SET raw_user_meta_data = jsonb_set(
     COALESCE(raw_user_meta_data, '{}'),
     '{role}',
     '"admin"'
   )
   WHERE email = 'your-email@example.com';
   ```
3. Click **Run**

### Step 3: Verify Admin Access

1. Go to **Table Editor** → **profiles**
2. Find your user → verify `role` is `admin`

---

## Environment Variables

### Development (.env.local)

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
   ```

3. **Never commit** `.env.local` to git

### Production (Vercel)

1. Go to **Vercel Project Settings** → **Environment Variables**
2. Add the same variables (except service role key initially)
3. For service role key:
   - This is only needed if you have server-side admin operations
   - If needed, set it only for specific deployment environments
   - Consider using a separate restricted key for limited operations

---

## Local Development

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Server runs on `http://localhost:3000`

### Test Authentication

1. Go to `http://localhost:3000`
2. Click "Create account"
3. Sign up as seeker
4. Check email for confirmation link
5. Verify you're redirected to `/seeker/onboarding/steps/1`

---

## Vercel Deployment

### Step 1: Connect Git Repository

1. Go to [vercel.com](https://vercel.com)
2. Click **Add New** → **Project**
3. Import your Git repository (GitHub/GitLab/Bitbucket)
4. Select the `steelcareer` project

### Step 2: Set Environment Variables

1. In Vercel project settings, go to **Environment Variables**
2. Add all variables from `.env.example`:
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=https://yourdomain.vercel.app/auth/callback
   SUPABASE_SERVICE_ROLE_KEY (if needed for admin operations)
   ```

### Step 3: Deploy

1. Click **Deploy**
2. Vercel builds and deploys automatically
3. Your app is live at `yourdomain.vercel.app`

### Step 4: Update Supabase Redirect URL

1. In Supabase, go to **Authentication** → **URL Configuration**
2. Add your Vercel URL: `https://yourdomain.vercel.app/auth/callback`

---

## Troubleshooting

### "Database connection failed"
- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- Check network access: Supabase → Project Settings → Network
- Ensure firewall allows Supabase IP ranges

### "Invalid API key"
- Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is the **Anon public** key, not service role
- Check `.env.local` is loaded (restart dev server)

### "Email confirmation not sent"
- Go to Supabase → **Authentication** → **Email Templates**
- Verify SMTP settings are configured
- Check spam folder for emails

### "Can't upload files"
- Verify storage bucket is created and set to public
- Check RLS policies allow authenticated uploads
- Verify file size is under bucket limits

### "Build fails on Vercel"
- Ensure all environment variables are set
- Run `npm run build` locally to test
- Check Vercel logs for specific error messages
- Verify TypeScript compilation: `npx tsc --noEmit`

### "Users can't login"
- Verify email confirmation is complete
- Check auth.users table for user
- Verify JWT token is valid in browser console
- Check middleware.ts is processing requests correctly

---

## Next Steps

1. **Create test accounts**:
   - Seeker test account
   - Provider test account
   - Admin account

2. **Test workflows** (see TEST_CHECKLIST.md):
   - Complete seeker onboarding
   - Create job postings as provider
   - Test file uploads
   - Verify admin access

3. **Configure custom domain**:
   - Go to Vercel → Domains
   - Add your custom domain
   - Update Supabase auth redirect URL

4. **Enable monitoring**:
   - Set up error tracking (Sentry, LogRocket)
   - Configure analytics
   - Monitor Supabase logs

5. **Prepare for production**:
   - Review SECURITY_AUDIT.md
   - Enable rate limiting on auth endpoints
   - Set up daily database backups
   - Configure email domain verification (SPF/DKIM)

---

## Support

For issues:
1. Check [Supabase Docs](https://supabase.com/docs)
2. Review [Next.js Docs](https://nextjs.org/docs)
3. Check TROUBLESHOOTING section above
