import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {

    const supabase = createClient();

    const id = request.url.split('/').pop();

    if (!id) return NextResponse.json({ error: 'Id parameter is missing' }, { status: 400 });

    const { data, error } = await supabase
        .from('profiles')
        .select()
        .eq('id', id)
        .single();

    if (!data || error) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    return NextResponse.json(data);
}