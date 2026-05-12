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

    // Get all providers (admin view)
    const { data: providers, error: providersError } = await supabase
      .from('providers')
      .select(`
        id,
        user_id,
        provider_type,
        company_name,
        contact_person_name,
        contact_email,
        verified,
        created_at,
        updated_at
      `)
      .order('created_at', { ascending: false });

    if (providersError) {
      return NextResponse.json(
        { error: providersError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ providers });
  } catch (error) {
    console.error('[v0] Admin API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
