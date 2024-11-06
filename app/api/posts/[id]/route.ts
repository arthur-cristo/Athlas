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
        .single();

    if (!data || error) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

    return NextResponse.json(data);
}