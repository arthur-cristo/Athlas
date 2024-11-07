import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const supabase = createClient();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const id = searchParams.get('id');

    if (!email && !id) return NextResponse.json({ error: 'Either email or id parameter is required' }, { status: 400 });

    const query = email ?
        supabase.from('profiles').select().eq('email', email) :
        supabase.from('profiles').select().eq('id', id);

    const { data, error } = await query;

    if (!data || error) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    return NextResponse.json(data);
}