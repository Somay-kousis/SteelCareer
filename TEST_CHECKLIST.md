# Steelcareer Manual Testing Checklist

Use this checklist to verify all features work correctly before deploying to production.

## Prerequisites

- [ ] Local dev server running (`npm run dev`)
- [ ] Supabase project created and migration applied
- [ ] Email confirmation enabled in Supabase
- [ ] Admin account created and verified
- [ ] `.env.local` configured with correct Supabase credentials

---

## 1. Homepage & Navigation

### Navigation
- [ ] Homepage loads without errors
- [ ] "Sign in" link in navbar navigates to `/auth/signin`
- [ ] "Create account" button in navbar navigates to `/auth/signup`
- [ ] "Begin with us" button in hero navigates to sign up
- [ ] All sections visible: Hero, Workflow, Ecosystem, Trust, Final CTA
- [ ] Footer links are present and styled

### Mobile Responsiveness
- [ ] Layout is readable on mobile (< 640px)
- [ ] Hero section adjusts properly
- [ ] Buttons are accessible on mobile
- [ ] No horizontal scrolling

---

## 2. Seeker Signup & Login

### Signup Flow
- [ ] Navigate to `/auth/signup`
- [ ] Click "I'm a seeker" button
- [ ] Fill in signup form:
  - [ ] Full name: "John Doe"
  - [ ] Email: valid email (e.g., test-seeker@example.com)
  - [ ] Password: 8+ characters
  - [ ] Confirm password matches
- [ ] Click "Create account"
- [ ] Success message or redirect appears
- [ ] Check email for confirmation link
- [ ] Click confirmation link in email
- [ ] Redirected to `/seeker/onboarding/steps/1`

### Database Verification (Seeker)
In Supabase Table Editor:
- [ ] New user in `auth.users` table
- [ ] New row in `profiles` table with `role = 'seeker'`
- [ ] New row in `seekers` table with matching `user_id`
- [ ] User cannot access another seeker's profile (RLS test)

### Login as Seeker
- [ ] Sign out (if logged in)
- [ ] Go to `/auth/signin`
- [ ] Enter seeker email and password
- [ ] Login succeeds and redirects to `/seeker/dashboard`
- [ ] Dashboard displays: Profile status, completion percentage, support resources

### Edit Profile
- [ ] From seeker dashboard, click "Edit Profile"
- [ ] Redirects to onboarding step 1
- [ ] Form is pre-filled with existing data (if any)
- [ ] Can modify and save
- [ ] Data persists after refresh

---

## 3. Seeker Onboarding (7 Steps)

### Step 1: Basic Info
- [ ] Form displays correctly
- [ ] Can fill: First Name, Last Name, Email, Phone, Country
- [ ] "Next" button saves data and advances to Step 2
- [ ] Data persists in database

### Step 2: Background
- [ ] Form displays correctly
- [ ] Can fill: Current Title, Years Experience, Background Summary
- [ ] "Back" button returns to Step 1 without data loss
- [ ] "Next" button saves and advances to Step 3

### Step 3: Career Goals
- [ ] Form displays correctly
- [ ] Can select multiple target roles
- [ ] Can select multiple preferred regions
- [ ] Can toggle visa sponsorship needed
- [ ] Can fill goals summary
- [ ] Data saves correctly

### Step 4: Links & Portfolio
- [ ] Form displays correctly
- [ ] Can add portfolio links (JSONB field)
- [ ] Can fill LinkedIn, GitHub, website URLs
- [ ] Links are validated (basic URL validation)

### Step 5: Documents
- [ ] Form displays correctly
- [ ] Resume URL field exists
- [ ] Cover letter URL field exists
- [ ] Can save URLs (future: integrate file upload)

### Step 6: Support Needs
- [ ] Form displays correctly
- [ ] Can select multiple support areas
- [ ] Can fill additional notes
- [ ] Data saves correctly

### Step 7: Review & Submit
- [ ] All previous data is displayed
- [ ] Can edit individual sections inline
- [ ] "Complete Onboarding" button is clickable
- [ ] After submit: `onboarding_completed_at` is set in database
- [ ] Seeker status changes to `'active'`
- [ ] Redirect to `/seeker/dashboard`

---

## 4. Provider Signup & Login

### Signup Flow
- [ ] Navigate to `/auth/signup`
- [ ] Click "I'm a provider" button
- [ ] Fill signup form with email and password
- [ ] Click "Create account"
- [ ] Confirm email (check inbox)
- [ ] Redirected to `/provider/onboarding`

### Provider Onboarding
- [ ] Select provider type: Recruiter or Company
- [ ] Fill provider information:
  - [ ] Company name
  - [ ] Company website
  - [ ] Hiring regions (multiple)
  - [ ] Description
  - [ ] Contact person name
  - [ ] Contact email
  - [ ] Contact phone
- [ ] Click "Complete Setup"
- [ ] New row in `providers` table

### Database Verification (Provider)
In Supabase Table Editor:
- [ ] New user in `auth.users` table
- [ ] New row in `profiles` table with `role = 'provider'`
- [ ] New row in `providers` table with matching `user_id`

### Login as Provider
- [ ] Go to `/auth/signin`
- [ ] Enter provider email and password
- [ ] Login succeeds and redirects to `/provider/dashboard`

---

## 5. Provider Job Posting

### Create Job Posting
- [ ] From provider dashboard, click "Post New Job"
- [ ] Redirected to `/provider/job-posting`
- [ ] Fill form:
  - [ ] Job title: "Senior Software Engineer"
  - [ ] Description: Full job description
  - [ ] Requirements: Required skills/experience
  - [ ] Salary range (optional)
  - [ ] Location: "San Francisco, CA"
  - [ ] Job type: "Full-time", "Remote", etc.
- [ ] Click "Post Job"
- [ ] New row in `job_postings` table
- [ ] `provider_id` references correct provider
- [ ] `is_active = TRUE`

### View Job Postings
- [ ] From provider dashboard, see list of posted jobs
- [ ] Can edit job posting details
- [ ] Can deactivate job posting
- [ ] Can view applications received

---

## 6. File Upload (Documents)

### Resume Upload (Future Implementation)
- [ ] During onboarding or profile edit
- [ ] Can upload PDF/DOC file
- [ ] File size limits enforced
- [ ] Progress bar shows upload status
- [ ] File URL stored in `documents` or `seekers.resume_url`
- [ ] File accessible after upload

### Document Verification (Admin)
- [ ] Admin can view all uploaded documents
- [ ] Admin can mark document as "verified" or "rejected"
- [ ] `document_status` updated in database
- [ ] Seeker receives notification (future)

---

## 7. RLS Security Checks

### Seeker Data Isolation
Test with two seeker accounts:
- [ ] Seeker A logs in
- [ ] In browser console, test RLS:
  ```javascript
  supabase.from('seekers').select('*').then(d => console.log(d.data.length))
  ```
- [ ] Should return 1 (only own profile)
- [ ] Log in as Seeker B
- [ ] Repeat query, should still return 1 (only own profile)
- [ ] Seeker A cannot see Seeker B's data ✓

### Provider Data Isolation
- [ ] Same test as above with provider accounts
- [ ] Providers can only see their own profiles

### Job Posting Access
- [ ] Unauthenticated user can view active jobs
- [ ] Seeker can view all jobs
- [ ] Provider can only edit their own jobs
- [ ] Test: Try to edit another provider's job via SQL
  ```sql
  UPDATE job_postings SET title = 'Hacked' WHERE provider_id != YOUR_PROVIDER_ID;
  ```
- [ ] Should fail with RLS error ✓

### Provider Cannot Access Seeker Data
- [ ] Provider account logs in
- [ ] Try to query seekers table:
  ```javascript
  supabase.from('seekers').select('*').then(d => console.log(d.data))
  ```
- [ ] Returns empty or error (no permission) ✓

---

## 8. Protected Routes

### Authentication Wall
- [ ] Navigate to `/seeker/dashboard` without logging in
- [ ] Should redirect to login (middleware check)
- [ ] Same for `/provider/dashboard` and `/admin/workspace`

### Role-Based Access
- [ ] Seeker logged in
- [ ] Try to navigate to `/provider/dashboard`
- [ ] Should redirect or show error (future: add role check)
- [ ] Provider logged in
- [ ] Try to navigate to `/seeker/dashboard`
- [ ] Should redirect or show error

### Admin Access
- [ ] Admin account logs in
- [ ] Can access `/admin/workspace`
- [ ] Can view all seekers via `/api/admin/seekers`
- [ ] Can view all providers via `/api/admin/providers`
- [ ] Can verify documents via `/api/admin/documents`

---

## 9. API Routes

### Test API Endpoints (using curl or Postman)

### GET /api/jobs
```bash
curl http://localhost:3000/api/jobs
```
- [ ] Returns active job postings
- [ ] Does NOT expose sensitive provider data (contact email, phone, etc.)
- [ ] Only shows: company_name, description, company_size

### GET /api/seeker (Authenticated)
```bash
# Get auth token from login, then:
curl -H "Authorization: Bearer TOKEN" http://localhost:3000/api/seeker
```
- [ ] Returns own seeker profile
- [ ] Returns 401 if not authenticated

### POST /api/seeker (Authenticated)
```bash
curl -X POST -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"first_name":"John","last_name":"Doe"}' \
  http://localhost:3000/api/seeker
```
- [ ] Updates own profile
- [ ] Cannot update another seeker's profile

---

## 10. Error Handling

### Network Errors
- [ ] Sign up with network disabled
- [ ] Error message displays
- [ ] Can retry

### Invalid Input
- [ ] Try signup with invalid email format
- [ ] Error displays: "Please enter a valid email"
- [ ] Try password < 8 characters
- [ ] Error displays: "Password must be at least 8 characters"

### Database Errors
- [ ] Manually disable RLS policy for testing
- [ ] RLS violation should block query
- [ ] Re-enable RLS

---

## 11. Performance

### Load Times
- [ ] Homepage loads in < 2 seconds
- [ ] Login page loads in < 1 second
- [ ] Seeker dashboard loads in < 2 seconds
- [ ] Job listings load in < 2 seconds

### Database Queries
- [ ] No N+1 queries (check browser network tab)
- [ ] Queries properly indexed
- [ ] Large datasets paginated (if applicable)

---

## 12. Mobile Experience

### Responsive Design
- [ ] Test on iPhone (375px width)
- [ ] Test on iPad (768px width)
- [ ] Test on Android (360px width)

### Touch Interactions
- [ ] All buttons are easily tappable (min 48px)
- [ ] Forms are mobile-friendly
- [ ] No elements cut off on mobile

---

## Sign-Off

- [ ] All tests passed
- [ ] No critical bugs found
- [ ] Ready for staging/production deployment

**Tested by**: ________________ **Date**: ____________

**Issues found**: (List any bugs or edge cases)
- 
- 
-

---

## Additional Notes

- This checklist covers manual testing
- For automated testing, see `__tests__/` directory (when available)
- Always test in a separate environment before production deployment
