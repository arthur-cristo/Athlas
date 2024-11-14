import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    
    const supabase = createClient();

    const { data, error } = await supabase.from('profiles').select('*, profile_follows!profile_follows_following_fkey(follower)');

    if (!data || error) return NextResponse.json({ error: "The user wasn't found" }, { status: 404 });

    return NextResponse.json(data);
}