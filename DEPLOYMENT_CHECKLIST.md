# Deployment Checklist

Use this checklist before deploying to production.

## Pre-Deployment (Local Testing)

### Code Quality
- [x] Build passes: `npm run build` ✓
- [ ] No TypeScript errors: `npx tsc --noEmit`
- [ ] No console.log debug statements
- [ ] No hardcoded secrets or passwords

### Database
- [ ] All migrations applied
- [ ] RLS policies enabled on all tables
- [ ] Test user created and verified
- [ ] Admin user created securely

### Environment
- [ ] `.env.local` configured with real Supabase credentials
- [ ] No `.env.local` committed to git
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` is anon key (not service role)
- [ ] Service role key only in `.env.local` (never in .env.example)

### Testing (See TEST_CHECKLIST.md)
- [ ] Seeker signup/login works
- [ ] Provider signup/login works
- [ ] Onboarding flow completes
- [ ] Job posting works
- [ ] RLS policies prevent unauthorized access
- [ ] All routes accessible
- [ ] Error handling works

---

## Vercel Deployment

### 1. Git & Repository
- [ ] All code committed to git (except `.env.local`)
- [ ] Repository is on GitHub/GitLab/Bitbucket
- [ ] Branch is `main` (or your deploy branch)
- [ ] No sensitive files in git history

### 2. Vercel Project
- [ ] Project linked to Vercel
- [ ] Build command: `npm run build` ✓
- [ ] Start command: `npm start` ✓
- [ ] Install command: `npm install` ✓

### 3. Environment Variables (Vercel)
- [ ] `NEXT_PUBLIC_SUPABASE_URL` = production URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` = production anon key
- [ ] `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` = your Vercel domain
- [ ] `SUPABASE_SERVICE_ROLE_KEY` = (if needed for admin operations)
- [ ] No local-only variables (http://localhost)

### 4. Supabase Configuration
- [ ] Project created and configured
- [ ] Database migration applied
- [ ] Email confirmation enabled
- [ ] Auth providers configured
- [ ] SMTP settings for emails
- [ ] Email templates customized

### 5. Auth Redirect URLs (Supabase)
- [ ] Added: `https://yourdomain.vercel.app/auth/callback`
- [ ] Removed: `http://localhost:3000/auth/callback` (or keep for testing)
- [ ] Confirm at: Supabase → Authentication → URL Configuration

### 6. Storage Buckets (Optional)
- [ ] `resumes` bucket created and public
- [ ] `documents` bucket created and public
- [ ] RLS policies configured for uploads
- [ ] CORS configured if needed

### 7. Admin User
- [ ] Created in production Supabase
- [ ] Role set to `admin` via SQL
- [ ] Can access `/admin/workspace`
- [ ] Password securely stored

---

## Post-Deployment

### Verification
- [ ] Site loads on Vercel domain
- [ ] Homepage displays correctly
- [ ] Signup/login flow works
- [ ] Email confirmation works
- [ ] Onboarding flow completes
- [ ] Databases are synced
- [ ] No console errors

### Monitoring
- [ ] Error tracking enabled (Sentry, LogRocket, etc.)
- [ ] Analytics configured
- [ ] Logs accessible
- [ ] Performance monitoring active

### Security Audit
- [ ] Review SECURITY_AUDIT.md
- [ ] Verify RLS policies are enforced
- [ ] Test: Seeker cannot access another seeker's data
- [ ] Test: Provider cannot access seeker data
- [ ] Test: Unauthenticated user cannot access protected routes
- [ ] Test: Unauthorized user cannot use admin APIs

### DNS & Domain
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] CNAME records correct
- [ ] www subdomain redirects (if needed)

### Backups & Recovery
- [ ] Database backups enabled in Supabase
- [ ] Backup frequency set (daily recommended)
- [ ] Backup retention configured
- [ ] Tested backup restoration process

---

## Ongoing Maintenance

### Weekly
- [ ] Check error logs
- [ ] Monitor database size
- [ ] Review failed auth attempts
- [ ] Check Vercel deployment logs

### Monthly
- [ ] Database optimization (analyze/vacuum)
- [ ] Security update checks
- [ ] Review user feedback
- [ ] Test backup restoration

### Quarterly
- [ ] Full security audit
- [ ] Performance review
- [ ] Database cleanup (old sessions)
- [ ] Documentation updates

---

## Rollback Plan

If deployment fails:

1. **Immediate**: Revert deployment in Vercel
   - Go to Vercel Dashboard
   - Click "Deployments"
   - Click last good deployment
   - Click "Redeploy"

2. **Database Issues**: Restore from backup
   - Go to Supabase → Backups
   - Restore to desired point in time
   - Allow 30 minutes for restoration

3. **Environment Variables**: Check Vercel config
   - Verify env vars are correct
   - Re-deploy after fix

4. **Code Issues**: Review error logs
   - Check Vercel build logs
   - Check Supabase errors
   - Fix locally, push to git, re-deploy

---

## Critical Contacts

- **Supabase Support**: [support.supabase.io](https://support.supabase.io)
- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)

---

## Sign-Off

**Deployment Date**: ____________

**Deployed By**: ____________

**Verified By**: ____________

**Notes**:
