# Steelcareer

Steelcareer is a hiring platform where people, not a matching algorithm, connect job seekers with recruiters and companies. Seekers fill in a profile, an admin reviews it and sets up calls, and providers post jobs and request candidates.

**Live:** https://steel-career.vercel.app

Next.js 16 · TypeScript · Supabase (Postgres, Auth, Row Level Security) · Tailwind CSS 4 · shadcn/ui

## What each role can do

| Role | Pages | Can do |
|---|---|---|
| Seeker | `/seeker/onboarding`, `/seeker/dashboard` | 5-step onboarding (identity, work authorization, experience, location and salary, screening slot), see profile completion and review status, request a consultation call, add LinkedIn / GitHub / website links |
| Provider | `/provider/onboarding`, `/provider/dashboard`, `/provider/job-posting` | Pick recruiter or company, set up a profile, post jobs, send support requests |
| Admin | `/admin`, `/admin/{seekers,providers,jobs}/[id]` | Tabs for seekers, providers, jobs and requests, open any profile, approve or reject requests and attach a meeting link |

## How it works

- **Auth.** Supabase Auth. The role (`seeker` or `provider`) is chosen at sign-up and sent in `raw_user_meta_data`. A Postgres trigger, `handle_new_user`, writes the `profiles` row and creates the matching `seekers` or `providers` row.
- **Access.** Row Level Security is on for every table. Seekers and providers read and write only their own rows. Admins get read access across tables. Admin API routes under `app/api/admin/` also check `profiles.role = 'admin'` before answering.
- **Schema.** `supabase/migrations/001_init_steelcareer.sql`:

| Table | Holds |
|---|---|
| `profiles` | Role and name for each auth user |
| `seekers` | Candidate profile: experience, location, work authorization |
| `providers` | Recruiter or company profile, hiring preferences, regions |
| `job_postings` | Jobs posted by providers |
| `meetings` | Scheduled sessions between seekers and providers |
| `documents` | Uploaded files waiting for admin verification |
| `applications` | Seeker applications to jobs |
| `support_requests` | Seeker support requests |

```
app/
  admin/        admin workspace and detail pages
  api/          route handlers: admin/, seeker/, provider/, jobs/, requests/
  auth/         sign in, sign up with role choice, OAuth callback
  seeker/       dashboard, onboarding/steps/[step]
  provider/     dashboard, onboarding, job-posting
components/     auth forms, seeker onboarding steps, shared badges, shadcn/ui
lib/supabase/   browser and server clients
supabase/migrations/
```

## Run it

Needs Node.js 20.9+ (the minimum for Next.js 16) and a Supabase project.

```bash
git clone https://github.com/Somay-kousis/SteelCareer.git
cd SteelCareer
npm install
cp .env.example .env.local
```

Fill in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
```

`.env.example` also lists `SUPABASE_SERVICE_ROLE_KEY`. No code reads it today; if you set it, keep it server side.

Run `supabase/migrations/001_init_steelcareer.sql` in the Supabase SQL editor, then:

```bash
npm run dev   # http://localhost:3000
```

In production (Vercel) set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Leave out `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL`: the sign-up form then falls back to `window.location.origin/auth/callback`.

## Limitations

- **The migration starts with `DROP SCHEMA IF EXISTS public CASCADE`.** Running it on a project that already has data deletes everything in `public`. Use a fresh project.
- **No admin sign-up.** The trigger only accepts `seeker` or `provider`. Make an admin by updating `profiles.role` to `admin` by hand in Supabase.
- **The request routes use a `requests` table that the migration does not create** (`app/api/requests/route.ts`, `app/api/admin/requests/route.ts`; the migration has `support_requests`). The consultation request and meeting link flow needs that table added before it works on a fresh database.
- No automated tests in the repo.
