import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const supabase = createClient();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const id = searchParams.get('id');
    let query;

    if (email) {
        query = supabase.from('profiles').select().eq('email', email).single()
    } else if (id) {
        query = supabase.from('profiles').select().eq('email', email).single()
    } else {
        query = supabase.from('profiles').select().eq('email', email)
    }

    const { data, error } = await query;

    if (!data || error) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    return NextResponse.json(data);
}