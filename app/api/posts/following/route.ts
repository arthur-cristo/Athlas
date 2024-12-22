import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return handleError("User not found", 404);
    try {
        const { data: following, error: followingError } = await supabase
            .from('profile_follows')
            .select('following')
            .eq('follower', user.id);
        if (followingError) return handleError(followingError.message, 500);
        const { data: posts, error } = await supabase
            .from("posts")
            .select(`
                *,
                posts_pictures (image_url),
                posts_likes (user_id)
              `)
            .in('user_id', following.map((follow: any) => follow.following))
            .order('created_at', { ascending: false });

        if (error) return handleError(error.message, 500);
        return NextResponse.json(posts, { status: 200 });
    } catch (error: any) {
        return handleError(error.message, 500);
    }
}

async function handleError(error: string, status: number) {
    console.log(error);
    return NextResponse.json({ error }, { status });
}
