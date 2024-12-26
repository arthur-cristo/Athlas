import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {

    const supabase = createClient();

    const id = request.url.split('/').pop();

    if (!id) return NextResponse.json({ error: 'Id parameter is missing' }, { status: 400 });

    const { data, error } = await supabase
        .from('posts')
        .select(`
            *,
            profiles (*),
            posts_pictures (image_url),
            posts_likes (user_id)
          `)
        .eq('id', id)
        .single();

    if (!data || error) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

    return NextResponse.json(data);
}

export async function PATCH(request: NextRequest) {

    const supabase = createClient();

    const id = request.url.split('/').pop();

    if (!id) return NextResponse.json({ error: 'Id parameter is missing' }, { status: 400 });
    const formData = await request.formData();
    const body = Object.fromEntries(formData);
    const title = body.title as string;
    const content = body.content as string;

    if (!title && !content) return NextResponse.json({ error: 'Missing attributes: title or content' }, { status: 400 });

    const { data, error } = await supabase
        .from('posts')
        .update(
            {
                title,
                content,
                updated_at: new Date().toISOString()
            }
        )
        .eq('id', id)
        .select()
        .single();


    if (!data) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    if (error) return NextResponse.json({ error: error }, { status: 404 });

    return NextResponse.json(data);
}

export async function DELETE(request: NextRequest) {

    const supabase = createClient();

    const id = request.url.split('/').pop();
    if (!id) return NextResponse.json({ error: 'Id parameter is missing' }, { status: 400 });

    const { data, error } = await supabase
        .from('posts')
        .select('*, posts_pictures (image_url)')
        .eq('id', id)
        .single();

    if (error || !data) return NextResponse.json({ error: error?.message || 'Post not found' }, { status: 404 });

    const imageUrls = data?.posts_pictures.map((img: any) => {
        const url = new URL(img.image_url);
        return url.pathname.replace('/storage/v1/object/public/', '');
    });

    if (imageUrls.length > 0) {
        const { error: deletesPicturesError } = await supabase.storage.from('posts_pictures').remove(imageUrls);
        if (deletesPicturesError) return NextResponse.json({ error: 'Failed to delete associated images' }, { status: 500 });
    }

    const { error: deletePostError } = await supabase.from('posts').delete().eq('id', id);
    if (deletePostError) return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });

    return NextResponse.json({ message: "The post was deleted succesfuly" }, { status: 200 });
}