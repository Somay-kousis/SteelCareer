<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://readme-typing-svg.demolab.com?font=Geist&weight=300&size=42&duration=3000&pause=1000&color=D4956A&center=true&vCenter=true&width=600&height=80&lines=steelcareer;Human+hiring%2C+not+algorithms.">
  <img alt="Steelcareer" src="https://readme-typing-svg.demolab.com?font=Geist&weight=300&size=42&duration=3000&pause=1000&color=D4956A&center=true&vCenter=true&width=600&height=80&lines=steelcareer;Human+hiring%2C+not+algorithms.">
</picture>

<p align="center">
  A structured international hiring platform built on trust, introductions, and human coordination.
</p>

<p align="center">
  <a href="https://steel-career-415l4p5or-somaykaush-6383s-projects.vercel.app">
    <img src="https://img.shields.io/badge/Live%20Demo-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" />
  </a>
  <img src="https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js 15" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=black" alt="Supabase" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
</p>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" alt="divider" />

</div>

## What is Steelcareer

Steelcareer is a premium career guidance and international hiring platform. Instead of algorithmic matching, it operates on a concierge model — real people reviewing profiles, facilitating introductions, and coordinating meetings between job seekers and hiring providers.

The platform serves three distinct user types: **seekers** looking for career guidance and international opportunities, **providers** (recruiters and companies) sourcing vetted candidates, and **admins** who coordinate the entire ecosystem.

---

## Architecture

```
steelcareer/
├── app/
│   ├── admin/                  # Admin dashboard — seekers, providers, jobs, requests
│   │   ├── seekers/[id]/       # Seeker profile detail view
│   │   ├── providers/[id]/     # Provider profile detail view
│   │   └── jobs/[id]/          # Job posting detail view
│   ├── api/
│   │   ├── admin/              # Protected admin API routes
│   │   ├── seeker/             # Seeker profile CRUD
│   │   ├── provider/           # Provider profile CRUD
│   │   ├── jobs/               # Job postings CRUD
│   │   └── requests/           # Consultation request management
│   ├── auth/                   # Sign in / Sign up with role selection
│   ├── seeker/
│   │   ├── dashboard/          # Seeker home — profile, status, call scheduling
│   │   └── onboarding/steps/   # 5-step onboarding flow
│   └── provider/
│       ├── dashboard/          # Provider home — jobs, profile, support
│       ├── onboarding/         # Provider profile setup
│       └── job-posting/        # Create new job listings
├── components/
│   ├── seeker/                 # Step components for onboarding
│   ├── auth/                   # Sign-in / sign-up forms, role selector
│   ├── ui/                     # shadcn/ui component library
│   └── shared/                 # Reusable status badges, skeletons, progress
├── lib/
│   ├── api.ts                  # Client-side fetch utilities
│   └── supabase/               # Browser + server Supabase clients
└── supabase/
    └── migrations/             # Full schema — profiles, seekers, providers, jobs
```

---

## Tech Stack

<table>
  <tr>
    <td><strong>Framework</strong></td>
    <td>Next.js 15 (App Router)</td>
  </tr>
  <tr>
    <td><strong>Language</strong></td>
    <td>TypeScript</td>
  </tr>
  <tr>
    <td><strong>Database</strong></td>
    <td>Supabase (PostgreSQL + Row Level Security)</td>
  </tr>
  <tr>
    <td><strong>Auth</strong></td>
    <td>Supabase Auth with role-based redirect</td>
  </tr>
  <tr>
    <td><strong>Styling</strong></td>
    <td>Tailwind CSS v4 with oklch design tokens</td>
  </tr>
  <tr>
    <td><strong>Components</strong></td>
    <td>shadcn/ui, Radix UI primitives</td>
  </tr>
  <tr>
    <td><strong>Animations</strong></td>
    <td>Framer Motion</td>
  </tr>
  <tr>
    <td><strong>Forms</strong></td>
    <td>React Hook Form + Zod validation</td>
  </tr>
  <tr>
    <td><strong>Deployment</strong></td>
    <td>Vercel</td>
  </tr>
</table>

---

## Features

**For Seekers**
- 5-step onboarding: identity, work authorization, experience, location/salary, screening slot selection
- Dashboard with profile completion score, review status, and consultation call scheduling
- External links management — LinkedIn, GitHub, personal website

**For Providers**
- Onboarding flow with recruiter vs. company type selection
- Job posting creation and management
- Support request system with meeting link integration

**For Admins**
- Unified workspace with tabs for seekers, providers, jobs, and requests
- Full profile detail pages for each entity
- Request approval/rejection with optional meeting link attachment

---

## Getting Started

**Prerequisites:** Node.js 18+, a Supabase project

```bash
# Clone the repo
git clone https://github.com/your-username/steelcareer.git
cd steelcareer

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

Add the following to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
```

```bash
# Run the database migration
# In your Supabase dashboard, run the contents of:
# supabase/migrations/001_init_steelcareer.sql

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Database Schema

The schema is defined in `supabase/migrations/001_init_steelcareer.sql` and includes:

| Table | Description |
|---|---|
| `profiles` | Auth user metadata — role, name |
| `seekers` | Full candidate profile — experience, location, work auth |
| `providers` | Company / recruiter profile — hiring preferences, regions |
| `job_postings` | Listings created by providers |
| `meetings` | Scheduled sessions between seekers and providers |
| `documents` | Uploaded files pending admin verification |
| `requests` | Consultation call requests with status tracking |
| `applications` | Seeker-to-job applications |

Row Level Security is enabled on all tables. Admins get cross-table read access; seekers and providers are restricted to their own rows.

---

## User Roles

| Role | Access |
|---|---|
| `seeker` | Onboarding, personal dashboard, request calls |
| `provider` | Company profile, job postings, provider dashboard |
| `admin` | Full platform view, request management, all profiles |

Role is set at signup via `raw_user_meta_data` and stored in the `profiles` table. A Postgres trigger (`handle_new_user`) automatically creates the matching `seekers` or `providers` row on registration.

---

## Deployment

The project is deployed on Vercel. Environment variables required in production:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

No `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` needed in production — the auth callback defaults to `window.location.origin/auth/callback`.

---

<div align="center">

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" alt="divider" />

<img src="https://readme-typing-svg.demolab.com?font=Geist&weight=300&size=14&duration=4000&pause=2000&color=888888&center=true&vCenter=true&width=500&height=30&lines=Built+with+human+coordination+in+mind." alt="tagline" />

</div>
