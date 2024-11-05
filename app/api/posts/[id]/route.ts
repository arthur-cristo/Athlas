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