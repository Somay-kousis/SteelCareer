import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

async function assertAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { supabase, user: null, error: 'Unauthorized', status: 401 };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (profile?.role !== 'admin') {
    return { supabase, user, error: 'Forbidden', status: 403 };
  }

  return { supabase, user, error: null, status: 200 };
}

export async function GET() {
  const { supabase, error, status } = await assertAdmin();

  if (error) {
    return NextResponse.json({ error }, { status });
  }

  const { data: requests, error: requestError } = await supabase
    .from('requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (requestError) {
    return NextResponse.json({ error: requestError.message }, { status: 400 });
  }

  return NextResponse.json({ requests });
}

export async function PATCH(request: NextRequest) {
  const { supabase, error, status } = await assertAdmin();

  if (error) {
    return NextResponse.json({ error }, { status });
  }

  const body = await request.json();

  const { id, request_status, meeting_link } = body;

  if (!id) {
    return NextResponse.json({ error: 'Request ID is required' }, { status: 400 });
  }

  const { data: updatedRequest, error: updateError } = await supabase
    .from('requests')
    .update({
      status: request_status,
      meeting_link: meeting_link || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 400 });
  }

  return NextResponse.json({ request: updatedRequest });
}