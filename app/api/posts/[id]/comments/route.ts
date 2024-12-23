import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const supabase = createClient();

    try {
        const formData = await req.formData();
        const body = Object.fromEntries(formData);
        const user_id = body.user_id as string;
        const post_id = req.nextUrl.pathname.split("/")[3];
        const comment_id = body.comment_id as string;
        const content = body.content as string;

        const user = await supabase.from("profiles").select().eq("id", user_id).single();
        const user_name = user?.data?.first_name + " " + user?.data?.last_name;

        const { data: postData, error: postError } = await supabase.from("posts").select("comments").eq("id", post_id).single();
        if (!postData) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }
        if (postError) {
            return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
        }

        const { data: commentData, error: commentError } = await supabase
            .from("comments")
            .insert({
                user_id,
                post_id,
                comment_id,
                content,
                user_name,
            })
            .select("id")
            .single();

        if (commentError) {
            return NextResponse.json({ error: "Failed to insert comment" }, { status: 500 });
        }

        const { error: updatedPostError } = await supabase
            .from("posts")
            .update({ comments: postData.comments + 1 })
            .eq("id", post_id);

        if (updatedPostError) {
            return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
        }

        return NextResponse.json({ commentData }, { status: 200 });

    } catch (error) {
        console.error("Unexpected error:", error);
        return NextResponse.json({ error }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const supabase = createClient();

    const post_id = req.nextUrl.pathname.split("/")[3];

    if (!post_id) return NextResponse.json({ error: "Id parameter is missing" }, { status: 400 });

    const { data, error } = await supabase
        .from("comments")
        .select()
        .order("likes", { ascending: false })
        .order("created_at", { ascending: false })
        .eq("post_id", post_id);

    if (!data || error) return NextResponse.json({ error: "Comment not found" }, { status: 404 });

    return NextResponse.json(data);
}