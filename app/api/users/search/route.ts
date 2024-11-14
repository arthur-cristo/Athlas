import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const supabase = createClient();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const id = searchParams.get('id');
    const phone_number = searchParams.get('phone_number');
    const random_key = searchParams.get('random_key');

    const input = email || id || phone_number || random_key;

    if (!input) return NextResponse.json({ error: "No search input provided" }, { status: 400 });

    const { data, error } = await supabase.from('profiles').select('*, profile_follows!profile_follows_following_fkey(follower)').eq(`${input}`, input).single();

    if (!data || error) return NextResponse.json({ error: "The user wasn't found" }, { status: 404 });

    return NextResponse.json(data);
}