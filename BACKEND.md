# Steelcareer Backend Implementation

## Overview
Complete backend for Steelcareer platform with Supabase PostgreSQL database, authentication, and API routes.

## Database Schema

### Tables Created

#### 1. **profiles** - User metadata table
Stores basic user information tied to Supabase auth users.
- `id` (UUID) - References auth.users(id)
- `email` (TEXT) - User email
- `role` (user_role) - 'seeker', 'provider', 'admin'
- `first_name`, `last_name` (TEXT)
- `created_at`, `updated_at` (TIMESTAMP)

#### 2. **seekers** - Career seeker profiles
Complete seeker profile with 7-step onboarding data.
- `id` (UUID) - Primary key
- `user_id` (UUID) - References auth.users(id)
- `status` (seeker_status) - 'onboarding', 'active', 'archived', 'completed'
- Step 1: `first_name`, `last_name`, `email`, `phone`, `country`
- Step 2: `current_title`, `years_experience`, `background_summary`
- Step 3: `target_roles[]`, `preferred_regions[]`, `visa_sponsorship_needed`, `goals_summary`
- Step 4: `portfolio_links`, `linkedin_profile`, `github_profile`, `website_url`
- Step 5: `resume_url`, `cover_letter_url`
- Step 6: `support_areas[]`, `additional_notes`
- `onboarding_completed_at`, `created_at`, `updated_at`

#### 3. **providers** - Hiring provider profiles
Recruiter or company profiles for job posting.
- `id` (UUID) - Primary key
- `user_id` (UUID) - References auth.users(id)
- `provider_type` (provider_type) - 'recruiter', 'company'
- `company_name`, `company_website` (TEXT)
- `hiring_regions[]` (TEXT[])
- `description`, `contact_person_name`, `contact_email`, `contact_phone`
- `linkedin_url`, `verified` (BOOLEAN)
- `created_at`, `updated_at`

#### 4. **job_postings** - Job listings
Jobs posted by providers.
- `id` (UUID) - Primary key
- `provider_id` (UUID) - References providers(id)
- `title`, `description`, `requirements` (TEXT)
- `salary_range`, `location`, `job_type` (TEXT)
- `is_active` (BOOLEAN)
- `created_at`, `updated_at`

#### 5. **meetings** - Meeting coordination
Meetings between seekers and providers.
- `id` (UUID) - Primary key
- `seeker_id` (UUID) - References seekers(id)
- `provider_id` (UUID) - References providers(id)
- `title`, `description` (TEXT)
- `scheduled_at` (TIMESTAMP)
- `status` (meeting_status) - 'scheduled', 'completed', 'cancelled'
- `notes` (TEXT)
- `created_at`, `updated_at`

#### 6. **documents** - Seeker documents
Profile documents (resume, cover letter, etc).
- `id` (UUID) - Primary key
- `seeker_id` (UUID) - References seekers(id)
- `file_name`, `file_url` (TEXT)
- `document_type` (TEXT)
- `status` (document_status) - 'pending', 'verified', 'rejected'
- `uploaded_at`, `verified_at`

#### 7. **applications** - Job applications
Seekers applying to jobs.
- `id` (UUID) - Primary key
- `seeker_id` (UUID) - References seekers(id)
- `job_posting_id` (UUID) - References job_postings(id)
- `status` (TEXT)
- `applied_at` (TIMESTAMP)
- UNIQUE constraint on (seeker_id, job_posting_id)

#### 8. **support_requests** - Support tracking
Support requests from seekers.
- `id` (UUID) - Primary key
- `seeker_id` (UUID) - References seekers(id)
- `category`, `description` (TEXT)
- `status` (TEXT)
- `created_at`, `updated_at`

## Enum Types

```sql
CREATE TYPE user_role AS ENUM ('seeker', 'provider', 'admin');
CREATE TYPE provider_type AS ENUM ('recruiter', 'company');
CREATE TYPE seeker_status AS ENUM ('onboarding', 'active', 'archived', 'completed');
CREATE TYPE meeting_status AS ENUM ('scheduled', 'completed', 'cancelled');
CREATE TYPE document_status AS ENUM ('pending', 'verified', 'rejected');
```

## Row Level Security (RLS)

All tables have RLS enabled with policies ensuring users can only access their own data:

- **profiles**: Users can only view/update/delete their own profile
- **seekers**: Seekers can only access their own record
- **providers**: Providers can only access their own record
- **job_postings**: Public read (all users can view active jobs), providers can create/update/delete their own
- **meetings**: Both parties (seeker and provider) can view and update their meetings
- **documents**: Seekers can view/upload their own documents
- **applications**: Seekers can apply to jobs (insert), view their applications
- **support_requests**: Seekers can create and view their own requests

## Database Triggers

### 1. Auto-create Profile on User Signup
When a new user is created in auth.users, automatically creates a profile row with the user's email and role from metadata.

```
Function: public.handle_new_user()
Trigger: on_auth_user_created
```

### 2. Auto-create Seeker Record
When a seeker profile is created, automatically creates a seeker record with basic info from user metadata.

```
Function: public.handle_new_seeker()
Trigger: on_seeker_profile_created
```

## Authentication

### Setup Files
- `lib/supabase/client.ts` - Browser client setup
- `lib/supabase/server.ts` - Server-side client setup
- `lib/supabase/proxy.ts` - Session proxy for middleware
- `middleware.ts` - Next.js middleware for session refresh
- `app/auth/callback/route.ts` - Auth callback handler

### Sign Up Flow
1. User selects role (seeker/provider) in UI
2. Calls `supabase.auth.signUp()` with email/password and user metadata
3. Metadata includes `first_name`, `last_name`, `role`
4. Email confirmation is sent (required before user can perform operations)
5. Profile is auto-created via trigger
6. If seeker, seeker record is auto-created via trigger
7. User redirected to appropriate onboarding flow

### Sign In Flow
1. User enters email/password
2. Calls `supabase.auth.signInWithPassword()`
3. User role from metadata determines redirect (provider → `/provider/dashboard`, seeker → `/seeker/dashboard`)

## API Routes

### `/api/seeker` - Seeker Profile Management
**POST** - Create or update seeker data
- Request body: Seeker fields to update
- Returns: `{ success: true }`
- Saves data to seekers table for authenticated user

**GET** - Fetch seeker profile
- Returns: `{ seeker: {...} }`
- Retrieves complete seeker data for authenticated user

### `/api/provider` - Provider Profile Management
**POST** - Create or update provider data
- Request body: Provider fields to update
- Returns: `{ success: true }`
- Saves data to providers table for authenticated user

**GET** - Fetch provider profile
- Returns: `{ provider: {...} }`
- Retrieves complete provider data for authenticated user

### `/api/jobs` - Job Postings
**GET** - List all active jobs
- Returns: `{ jobs: [...] }`
- Public endpoint showing all active job postings with provider info

**POST** - Create new job posting
- Request body: Job posting data (title, description, requirements, etc)
- Returns: `{ job: {...} }`
- Creates job posting linked to authenticated provider

## Client-Side Utilities

### `lib/api.ts` - API Helper Functions

```typescript
fetchSeeker()              // GET /api/seeker
updateSeeker(data)         // POST /api/seeker
fetchProvider()            // GET /api/provider
updateProvider(data)       // POST /api/provider
fetchJobs()                // GET /api/jobs
createJobPosting(data)     // POST /api/jobs
```

## Environment Variables

All required Supabase env vars are already configured:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_URL`
- `POSTGRES_URL`

## Security Features

1. **Row Level Security (RLS)** - Database-level security ensures users only access their own data
2. **Email Confirmation** - Users must verify email before operations
3. **Secure Session Management** - Handled by Supabase middleware
4. **Server-side Auth Checks** - All API routes verify authenticated user
5. **Parameterized Queries** - Supabase client prevents SQL injection
6. **CORS Protected** - API routes only accessible from authenticated sessions

## Usage Examples

### Save Seeker Data
```typescript
import { updateSeeker } from '@/lib/api';

// In a form component
const handleSubmit = async (formData) => {
  try {
    await updateSeeker({
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone: formData.phone,
    });
  } catch (error) {
    console.error('Failed to save:', error);
  }
};
```

### Fetch User Profile
```typescript
import { fetchSeeker } from '@/lib/api';

// In a component
useEffect(() => {
  const loadProfile = async () => {
    try {
      const data = await fetchSeeker();
      setSeeker(data.seeker);
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };
  loadProfile();
}, []);
```

### Create Job Posting
```typescript
import { createJobPosting } from '@/lib/api';

const handleCreateJob = async (jobData) => {
  try {
    const response = await createJobPosting({
      title: jobData.title,
      description: jobData.description,
      requirements: jobData.requirements,
      location: jobData.location,
    });
    console.log('Job created:', response.job.id);
  } catch (error) {
    console.error('Failed to create job:', error);
  }
};
```

## Testing

To test authentication locally:
1. Sign up at `/auth/signup` with your email
2. Check email for confirmation link (or use Supabase dashboard)
3. Confirm email
4. Sign in at `/auth/signin`
5. Should be redirected to appropriate dashboard

## Next Steps

To extend the backend:
1. Create more API routes for meetings, documents, applications
2. Add file upload handling for resume/documents
3. Implement admin endpoints for operations dashboard
4. Add email notifications for important events
5. Create webhook handlers for async operations
6. Add analytics and reporting endpoints
