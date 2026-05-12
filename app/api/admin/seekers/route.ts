import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
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

    // Verify user is admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || profile?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    // Get all seekers (admin view)
    const { data: seekers, error: seekersError } = await supabase
      .from('seekers')
      .select(`
        id,
        user_id,
        status,
        first_name,
        last_name,
        email,
        current_title,
        years_experience,
        onboarding_completed_at,
        created_at,
        updated_at
      `)
      .order('created_at', { ascending: false });

    if (seekersError) {
      return NextResponse.json(
        { error: seekersError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ seekers });
  } catch (error) {
    console.error('[v0] Admin API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
