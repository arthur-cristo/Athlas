import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {

    const { data: news, error } = await createClient()
        .from('news')
        .select('title, content')
        .order('created_at', { ascending: false })
        .limit(10);

    if (error) {
        return NextResponse.json({
            body: error.message,
        }, { status: 500 });
    }

    return NextResponse.json({
        news,
    }, { status: 200 });

}