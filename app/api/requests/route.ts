import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: requests, error } = await supabase
    .from('requests')
    .select('*')
    .eq('requester_user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ requests });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

    const { data: existingPending } = await supabase
  .from('requests')
  .select('id')
  .eq('requester_user_id', user.id)
  .eq('status', 'pending')
  .maybeSingle();

if (existingPending) {
  return NextResponse.json(
    {
      error: 'You already have a pending request.',
    },
    { status: 400 }
  );
}

  const { data: createdRequest, error } = await supabase
    .from('requests')
    .insert({
      requester_user_id: user.id,
      requester_role: profile?.role || 'seeker',
      request_type: body.request_type || 'schedule_call',
      message: body.message || null,
      status: 'pending',
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ request: createdRequest });
}