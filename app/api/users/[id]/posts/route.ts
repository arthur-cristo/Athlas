import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const supabase = createClient();

    const user_id = req.nextUrl.pathname.split("/")[3];

    if (!user_id) return NextResponse.json({ error: "Id parameter is missing" }, { status: 400 });

    const { data, error } = await supabase
        .from("posts")
        .select(`
            *,
            posts_pictures (image_url),
            posts_likes (user_id)
          `)
        .order("created_at", { ascending: false })
        .eq("user_id", user_id);

    if (!data || error) return NextResponse.json({ error: "Comment not found" }, { status: 404 });

    return NextResponse.json(data);
}