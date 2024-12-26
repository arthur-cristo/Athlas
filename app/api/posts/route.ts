import { createClient } from "@/lib/supabase/server";
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const supabase = createClient();

    try {
        const formData = await req.formData();
        const body = Object.fromEntries(formData);
        const user_id = body.user_id as string;
        const title = body.title as string;
        const content = body.content as string;
        const files = formData.getAll("image");

        const { data: postData, error: postError } = await supabase
            .from("posts")
            .insert({ title, content, user_id })
            .select("id")
            .single();

        if (postError) return handleError(postError.message, 500);

        for (let i = 0; i < files.length; i++) {
            const file = files[i] as File;
            const buffer = Buffer.from(await file.arrayBuffer());
            const fileExtension = file.name.split(".").pop() || "jpg";
            const fileName = `${Date.now()}-${randomUUID()}.${fileExtension}`;

            const { error: uploadError } = await supabase.storage
                .from("posts_pictures")
                .upload(fileName, buffer, {
                    cacheControl: "3600",
                    upsert: false,
                    contentType: file.type,
                });
            if (uploadError) return handleError(uploadError.message, 500);

            const { data: urlData } = supabase.storage
                .from("posts_pictures")
                .getPublicUrl(fileName);

            if (!urlData) return handleError("Failed to get file URL", 500);

            const { error: urlInsertError } = await supabase
                .from("posts_pictures")
                .insert({
                    post_id: postData.id,
                    image_url: urlData.publicUrl,
                });
            if (urlInsertError) return handleError(urlInsertError.message, 500);
        }

    } catch (error) {
        return handleError("An unexpected error occurred", 500);
    }

    return NextResponse.json({ message: "Files uploaded successfully" }, { status: 200 });
}

export async function GET(req: NextRequest) {
    const supabase = createClient();
    try {
        const { data: posts, error } = await supabase
            .from("posts")
            .select(`
                *,
                profiles (*),
                posts_pictures (image_url),
                posts_likes (user_id)
              `)
            .order('created_at', { ascending: false });
        if (error) return handleError(error.message, 500);
        return NextResponse.json(posts, { status: 200 });
    } catch (error: any) {
        return handleError(error.message, 500);
    }
}

async function handleError(error: string, status: number) {
    return NextResponse.json({ error }, { status });
}
