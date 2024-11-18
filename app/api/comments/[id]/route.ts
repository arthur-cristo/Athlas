import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {

    const supabase = createClient();

    const id = request.url.split('/').pop();
    if (!id) return NextResponse.json({ error: 'Id parameter is missing' }, { status: 400 });

    const { data: comment, error } = await supabase
        .from('comments')
        .delete()
        .eq('id', id)
        .select('post_id').single();

    if (error) return NextResponse.json({ error: error?.message || 'Comment not found' }, { status: 404 });

    const { data: postData, error: postError } = await supabase.from("posts").select("comments").eq("id", comment.post_id).single();

    if (!postData) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    if (postError) return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });

    const { error: updatedPostError } = await supabase
        .from("posts")
        .update({ comments: postData.comments - 1 })
        .eq("id", comment.post_id);

    if (updatedPostError) return NextResponse.json({ error: "Failed to update post" }, { status: 500 });

    return NextResponse.json({ message: "The comment was deleted succesfuly" }, { status: 200 });
}

export async function PATCH(request: NextRequest) {

    const supabase = createClient();

    const id = request.url.split('/').pop();

    if (!id) return NextResponse.json({ error: 'Id parameter is missing' }, { status: 400 });
    const formData = await request.formData();
    const body = Object.fromEntries(formData);
    const content = body.content as string;

    if (!content) return NextResponse.json({ error: 'Missing attributes: content' }, { status: 400 });

    const { data, error } = await supabase
        .from('comments')
        .update(
            {
                content,
                updated_at: new Date().toISOString()
            }
        )
        .eq('id', id)
        .select()
        .single();


    if (!data) return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    if (error) return NextResponse.json({ error: error }, { status: 404 });

    return NextResponse.json(data);
}