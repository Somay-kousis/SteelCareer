import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get all active job postings with provider info
    // Only select public-safe provider fields
    const { data: jobs, error } = await supabase
      .from('job_postings')
      .select(
        `
        id,
        title,
        description,
        requirements,
        salary_range,
        location,
        job_type,
        created_at,
        provider:providers(
          id,
          company_name,
          description,
          company_size
        )
        `
      )
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error('[v0] API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get provider for this user
    const { data: provider, error: providerError } = await supabase
      .from('providers')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (providerError || !provider) {
      return NextResponse.json(
        { error: 'Provider profile not found' },
        { status: 404 }
      );
    }

    const body = await request.json();

    const { error: insertError, data: job } = await supabase
      .from('job_postings')
      .insert([
        {
          ...body,
          provider_id: provider.id,
        },
      ])
      .select()
      .single();

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ job });
  } catch (error) {
    console.error('[v0] API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
