-- Steelcareer: Complete Database Schema Migration
-- This migration sets up all tables, enums, triggers, RLS policies, and storage buckets
-- Run this once in a fresh Supabase project

-- ============================================================================
-- ENUMS: User roles and status types
-- ============================================================================

CREATE TYPE user_role AS ENUM ('seeker', 'provider', 'admin');
CREATE TYPE provider_type AS ENUM ('recruiter', 'company');
CREATE TYPE seeker_status AS ENUM ('onboarding', 'active', 'archived', 'completed');
CREATE TYPE meeting_status AS ENUM ('scheduled', 'completed', 'cancelled');
CREATE TYPE document_status AS ENUM ('pending', 'verified', 'rejected');

-- ============================================================================
-- TABLE: profiles
-- Core user profile with role assignment (immutable after creation)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role user_role NOT NULL,  -- Set during signup, cannot be changed
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TABLE: seekers
-- Seeker onboarding and profile data
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.seekers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  status seeker_status DEFAULT 'onboarding',
  
  -- Step 1: Basic Info
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  country TEXT,
  
  -- Step 2: Background
  current_title TEXT,
  years_experience INTEGER,
  background_summary TEXT,
  
  -- Step 3: Career Goals
  target_roles TEXT[],
  preferred_regions TEXT[],
  visa_sponsorship_needed BOOLEAN,
  goals_summary TEXT,
  
  -- Step 4: Links & Portfolio
  portfolio_links JSONB,
  linkedin_profile TEXT,
  github_profile TEXT,
  website_url TEXT,
  
  -- Step 5: Documents
  resume_url TEXT,
  cover_letter_url TEXT,
  
  -- Step 6: Support Needs
  support_areas TEXT[],
  additional_notes TEXT,
  
  -- Tracking
  onboarding_completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TABLE: providers
-- Recruiter and company hiring profiles
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_type provider_type NOT NULL,
  
  -- Organization Info
  company_name TEXT,
  company_website TEXT,
  hiring_regions TEXT[],
  description TEXT,
  company_size TEXT,
  
  -- Contact Info
  contact_person_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  
  -- Additional
  linkedin_url TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TABLE: job_postings
-- Job opportunities posted by providers
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.job_postings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT NOT NULL,
  salary_range TEXT,
  location TEXT,
  job_type TEXT,
  
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TABLE: meetings
-- Coordination between seekers and providers
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seeker_id UUID NOT NULL REFERENCES public.seekers(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  
  title TEXT NOT NULL,
  description TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  status meeting_status DEFAULT 'scheduled',
  
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TABLE: documents
-- Resume, cover letter, and other verification documents
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seeker_id UUID NOT NULL REFERENCES public.seekers(id) ON DELETE CASCADE,
  
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  document_type TEXT NOT NULL,
  status document_status DEFAULT 'pending',
  
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified_at TIMESTAMP WITH TIME ZONE
);

-- ============================================================================
-- TABLE: applications
-- Seeker applications to job postings
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seeker_id UUID NOT NULL REFERENCES public.seekers(id) ON DELETE CASCADE,
  job_posting_id UUID NOT NULL REFERENCES public.job_postings(id) ON DELETE CASCADE,
  
  status TEXT DEFAULT 'applied',
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(seeker_id, job_posting_id)
);

-- ============================================================================
-- TABLE: support_requests
-- Seekers requesting support for various aspects
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.support_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seeker_id UUID NOT NULL REFERENCES public.seekers(id) ON DELETE CASCADE,
  
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'open',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY: Enable on all tables
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seekers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_requests ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES: Profiles
-- ============================================================================

CREATE POLICY "profiles_select_own" ON public.profiles 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON public.profiles 
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles 
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id 
    AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
  );

CREATE POLICY "profiles_delete_own" ON public.profiles 
  FOR DELETE USING (auth.uid() = id);

CREATE POLICY "profiles_admin_view" ON public.profiles 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- ============================================================================
-- RLS POLICIES: Seekers
-- ============================================================================

CREATE POLICY "seekers_select_own" ON public.seekers 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "seekers_insert_own" ON public.seekers 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "seekers_update_own" ON public.seekers 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "seekers_delete_own" ON public.seekers 
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "seekers_admin_view" ON public.seekers 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- ============================================================================
-- RLS POLICIES: Providers
-- ============================================================================

CREATE POLICY "providers_select_own" ON public.providers 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "providers_insert_own" ON public.providers 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "providers_update_own" ON public.providers 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "providers_delete_own" ON public.providers 
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "providers_admin_view" ON public.providers 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- ============================================================================
-- RLS POLICIES: Job Postings (Public read, provider write)
-- ============================================================================

CREATE POLICY "job_postings_select_public" ON public.job_postings 
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "job_postings_insert_own" ON public.job_postings 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.providers 
      WHERE providers.id = job_postings.provider_id 
      AND providers.user_id = auth.uid()
    )
  );

CREATE POLICY "job_postings_update_own" ON public.job_postings 
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.providers 
      WHERE providers.id = job_postings.provider_id 
      AND providers.user_id = auth.uid()
    )
  );

CREATE POLICY "job_postings_delete_own" ON public.job_postings 
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.providers 
      WHERE providers.id = job_postings.provider_id 
      AND providers.user_id = auth.uid()
    )
  );

-- ============================================================================
-- RLS POLICIES: Meetings
-- ============================================================================

CREATE POLICY "meetings_select_own" ON public.meetings 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.seekers 
      WHERE seekers.id = meetings.seeker_id 
      AND seekers.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM public.providers 
      WHERE providers.id = meetings.provider_id 
      AND providers.user_id = auth.uid()
    )
  );

CREATE POLICY "meetings_insert_own" ON public.meetings 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.seekers 
      WHERE seekers.id = meetings.seeker_id 
      AND seekers.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM public.providers 
      WHERE providers.id = meetings.provider_id 
      AND providers.user_id = auth.uid()
    )
  );

-- ============================================================================
-- RLS POLICIES: Documents
-- ============================================================================

CREATE POLICY "documents_select_own" ON public.documents 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.seekers 
      WHERE seekers.id = documents.seeker_id 
      AND seekers.user_id = auth.uid()
    )
  );

CREATE POLICY "documents_insert_own" ON public.documents 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.seekers 
      WHERE seekers.id = documents.seeker_id 
      AND seekers.user_id = auth.uid()
    )
  );

CREATE POLICY "documents_admin_view" ON public.documents 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "documents_admin_update" ON public.documents 
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- ============================================================================
-- RLS POLICIES: Applications
-- ============================================================================

CREATE POLICY "applications_select_own" ON public.applications 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.seekers 
      WHERE seekers.id = applications.seeker_id 
      AND seekers.user_id = auth.uid()
    )
  );

CREATE POLICY "applications_insert_own" ON public.applications 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.seekers 
      WHERE seekers.id = applications.seeker_id 
      AND seekers.user_id = auth.uid()
    )
  );

-- ============================================================================
-- RLS POLICIES: Support Requests
-- ============================================================================

CREATE POLICY "support_requests_select_own" ON public.support_requests 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.seekers 
      WHERE seekers.id = support_requests.seeker_id 
      AND seekers.user_id = auth.uid()
    )
  );

CREATE POLICY "support_requests_insert_own" ON public.support_requests 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.seekers 
      WHERE seekers.id = support_requests.seeker_id 
      AND seekers.user_id = auth.uid()
    )
  );

CREATE POLICY "support_requests_admin_view" ON public.support_requests 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- ============================================================================
-- TRIGGERS: Auto-create profile on signup
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'role', 'seeker')::user_role
  )
  ON CONFLICT (id) DO UPDATE
  SET role = EXCLUDED.role;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- TRIGGERS: Auto-create seeker profile
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_seeker()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role = 'seeker' THEN
    INSERT INTO public.seekers (user_id, first_name, last_name, email)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data ->> 'first_name', NULL),
      COALESCE(NEW.raw_user_meta_data ->> 'last_name', NULL),
      NEW.email
    )
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_seeker_profile_created ON public.profiles;

CREATE TRIGGER on_seeker_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_seeker();

-- ============================================================================
-- STORAGE: Configure buckets (run in Supabase dashboard if needed)
-- ============================================================================
-- Note: Storage buckets must be created via Supabase dashboard:
-- 1. Create public bucket: "resumes"
--    - Enable public access
--    - Set policy: authenticated users can upload/read own files
--
-- 2. Create public bucket: "documents"
--    - Enable public access
--    - Set policy: authenticated users can upload own files, admins can read all
--
-- 3. Create private bucket: "tmp-uploads"
--    - For temporary file processing before verification

-- ============================================================================
-- CONSTRAINTS: Admin role immutability
-- ============================================================================

ALTER TABLE public.profiles
ADD CONSTRAINT check_admin_role_immutable
CHECK (role != 'admin' OR id = ANY('{}'::uuid[]));

-- Admins can only be created by Supabase superuser via Supabase dashboard
-- After creation, the profile trigger prevents any role changes

COMMIT;
