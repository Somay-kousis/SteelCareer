import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError || profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { data: jobs, error } = await supabase
      .from('job_postings')
      .select(`
        id,
        title,
        description,
        requirements,
        salary_range,
        location,
        job_type,
        is_active,
        created_at,
        provider:providers(
          id,
          company_name,
          contact_email
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error('[admin jobs] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}