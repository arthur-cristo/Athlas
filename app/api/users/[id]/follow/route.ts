import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

    const supabase = createClient();

    const following_id = req.nextUrl.pathname.split("/")[3];
    const formData = await req.formData();
    const follower_id = Object.fromEntries(formData).follower_id as string;

    const { error } = await supabase.rpc('follow_profile', ({ following_id, follower_id }));

    if (error) {
        return NextResponse.json({ error: "Failed to follow profile" }, { status: 500 });
    }

    return NextResponse.json({ message: 'Profile followed' }, { status: 200 });

}

export async function DELETE(req: NextRequest) {

    const supabase = createClient();

    const following_id = req.nextUrl.pathname.split("/")[3];
    const formData = await req.formData();
    const follower_id = Object.fromEntries(formData).follower_id as string;

    const { error } = await supabase.rpc('unfollow_profile', ({ following_id, follower_id }));

    if (error) {
        return NextResponse.json({ error: "Failed to unfollow profile" }, { status: 500 });
    }

    return NextResponse.json({ message: 'Profile followed' }, { status: 200 });

}