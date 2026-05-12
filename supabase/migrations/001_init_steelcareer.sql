DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;

GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO anon;
GRANT ALL ON SCHEMA public TO authenticated;
GRANT ALL ON SCHEMA public TO service_role;

CREATE TYPE public.user_role AS ENUM ('seeker', 'provider', 'admin');
CREATE TYPE public.provider_type AS ENUM ('recruiter', 'company');
CREATE TYPE public.seeker_status AS ENUM ('onboarding', 'active', 'archived', 'completed');
CREATE TYPE public.meeting_status AS ENUM ('scheduled', 'completed', 'cancelled');
CREATE TYPE public.document_status AS ENUM ('pending', 'verified', 'rejected');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role public.user_role NOT NULL,
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.seekers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  status public.seeker_status DEFAULT 'onboarding',
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  country TEXT,
  current_title TEXT,
  years_experience INTEGER,
  background_summary TEXT,
  target_roles TEXT[],
  preferred_regions TEXT[],
  visa_sponsorship_needed BOOLEAN,
  goals_summary TEXT,
  portfolio_links JSONB,
  linkedin_profile TEXT,
  github_profile TEXT,
  website_url TEXT,
  resume_url TEXT,
  cover_letter_url TEXT,
  support_areas TEXT[],
  additional_notes TEXT,
  onboarding_completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_type public.provider_type NOT NULL,
  company_name TEXT,
  company_website TEXT,
  hiring_regions TEXT[],
  description TEXT,
  company_size TEXT,
  contact_person_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  linkedin_url TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.job_postings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT NOT NULL,
  salary_range TEXT,
  location TEXT,
  job_type TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seeker_id UUID NOT NULL REFERENCES public.seekers(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  scheduled_at TIMESTAMPTZ,
  status public.meeting_status DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seeker_id UUID NOT NULL REFERENCES public.seekers(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  document_type TEXT NOT NULL,
  status public.document_status DEFAULT 'pending',
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  verified_at TIMESTAMPTZ
);

CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seeker_id UUID NOT NULL REFERENCES public.seekers(id) ON DELETE CASCADE,
  job_posting_id UUID NOT NULL REFERENCES public.job_postings(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'applied',
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(seeker_id, job_posting_id)
);

CREATE TABLE public.support_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seeker_id UUID NOT NULL REFERENCES public.seekers(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seekers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY profiles_select_own ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY profiles_insert_own ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY profiles_update_own ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND role = (SELECT p.role FROM public.profiles p WHERE p.id = auth.uid())
  );

CREATE POLICY profiles_admin_view ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'admin'
    )
  );

CREATE POLICY seekers_select_own ON public.seekers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY seekers_insert_own ON public.seekers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY seekers_update_own ON public.seekers
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY seekers_admin_view ON public.seekers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'admin'
    )
  );

CREATE POLICY providers_select_own ON public.providers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY providers_insert_own ON public.providers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY providers_update_own ON public.providers
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY providers_admin_view ON public.providers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'admin'
    )
  );

CREATE POLICY job_postings_select_public ON public.job_postings
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY job_postings_insert_own_provider ON public.job_postings
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.providers pr
      WHERE pr.id = provider_id
      AND pr.user_id = auth.uid()
    )
  );

CREATE POLICY job_postings_update_own_provider ON public.job_postings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.providers pr
      WHERE pr.id = provider_id
      AND pr.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.providers pr
      WHERE pr.id = provider_id
      AND pr.user_id = auth.uid()
    )
  );

CREATE POLICY meetings_select_related ON public.meetings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.seekers s
      WHERE s.id = seeker_id
      AND s.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.providers pr
      WHERE pr.id = provider_id
      AND pr.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'admin'
    )
  );

CREATE POLICY meetings_insert_related_or_admin ON public.meetings
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.providers pr
      WHERE pr.id = provider_id
      AND pr.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'admin'
    )
  );

CREATE POLICY documents_select_own_or_admin ON public.documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.seekers s
      WHERE s.id = seeker_id
      AND s.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'admin'
    )
  );

CREATE POLICY documents_insert_own ON public.documents
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.seekers s
      WHERE s.id = seeker_id
      AND s.user_id = auth.uid()
    )
  );

CREATE POLICY documents_update_admin ON public.documents
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'admin'
    )
  );

CREATE POLICY applications_select_own_or_provider_or_admin ON public.applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.seekers s
      WHERE s.id = seeker_id
      AND s.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1
      FROM public.job_postings jp
      JOIN public.providers pr ON pr.id = jp.provider_id
      WHERE jp.id = job_posting_id
      AND pr.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'admin'
    )
  );

CREATE POLICY applications_insert_own ON public.applications
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.seekers s
      WHERE s.id = seeker_id
      AND s.user_id = auth.uid()
    )
  );

CREATE POLICY support_requests_select_own_or_admin ON public.support_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.seekers s
      WHERE s.id = seeker_id
      AND s.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'admin'
    )
  );

CREATE POLICY support_requests_insert_own ON public.support_requests
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.seekers s
      WHERE s.id = seeker_id
      AND s.user_id = auth.uid()
    )
  );

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  incoming_role public.user_role;
BEGIN
  incoming_role :=
    CASE
      WHEN NEW.raw_user_meta_data ->> 'role' IN ('seeker', 'provider')
        THEN (NEW.raw_user_meta_data ->> 'role')::public.user_role
      ELSE 'seeker'::public.user_role
    END;

  INSERT INTO public.profiles (
    id,
    email,
    role,
    first_name,
    last_name
  )
  VALUES (
    NEW.id,
    NEW.email,
    incoming_role,
    COALESCE(
      NEW.raw_user_meta_data ->> 'first_name',
      split_part(COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''), ' ', 1)
    ),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', '')
  );

  IF incoming_role = 'seeker' THEN
    INSERT INTO public.seekers (
      user_id,
      first_name,
      last_name,
      email
    )
    VALUES (
      NEW.id,
      COALESCE(
        NEW.raw_user_meta_data ->> 'first_name',
        split_part(COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''), ' ', 1)
      ),
      COALESCE(NEW.raw_user_meta_data ->> 'last_name', ''),
      NEW.email
    );
  END IF;

  IF incoming_role = 'provider' THEN
    INSERT INTO public.providers (
      user_id,
      provider_type,
      contact_email
    )
    VALUES (
      NEW.id,
      'company',
      NEW.email
    );
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();