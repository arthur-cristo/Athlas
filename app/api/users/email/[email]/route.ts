import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {

    const supabase = createClient();

    const email = request.url.split('/').pop();

    if (!email) return NextResponse.json({ error: 'Email parameter is missing' }, { status: 400 });

    const { data, error } = await supabase
        .from('profiles')
        .select()
        .eq('email', email)
        .single();

    if (!data || error) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    return NextResponse.json(data);
}