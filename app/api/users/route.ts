import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const supabase = createClient();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const id = searchParams.get('id');
    let query;

    if (email) {
        query = supabase.from('profiles').select('*, profile_follows!profile_follows_following_fkey(follower)').eq('email', email).single();
    } else if (id) {
        query = supabase.from('profiles').select('*, profile_follows!profile_follows_following_fkey(follower)').eq('id', id).single();
    } else {
        query = supabase.from('profiles').select('*, profile_follows!profile_follows_following_fkey(follower)');
    }

    const { data, error } = await query;
    console.log(data);
    console.error(error);
    if (!data || error) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    return NextResponse.json(data);
}