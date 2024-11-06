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

        const user = await supabase.from("profiles").select().eq("id", user_id).single();
        const user_name = user?.data?.first_name + " " + user?.data?.last_name;

        // Insert post data
        const { data: postData, error: postError } = await supabase
            .from("posts")
            .insert({ title, content, user_id, user_name })
            .select("id")
            .single();

        if (postError) return handleError(postError.message, 500);

        const post_id = postData.id;

        // Upload each file and insert its URL in the `posts_pictures` table
        for (let i = 0; i < files.length; i++) {
            const file = files[i] as File;
            const buffer = Buffer.from(await file.arrayBuffer());
            const fileExtension = file.name.split(".").pop() || "jpg";
            const fileName = `${Date.now()}-${randomUUID()}.${fileExtension}`;

            // Upload the file to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from("posts_pictures")
                .upload(fileName, buffer, {
                    cacheControl: "3600",
                    upsert: false,
                    contentType: file.type,
                });
            if (uploadError) return handleError(uploadError.message, 500);

            // Get the public URL of the uploaded file
            const { data: urlData } = supabase.storage
                .from("posts_pictures")
                .getPublicUrl(fileName);

            if (!urlData) return handleError("Failed to get file URL", 500);

            // Insert the file URL into the `posts_pictures` table
            const { error: urlInsertError } = await supabase
                .from("posts_pictures")
                .insert({
                    post_id: post_id,
                    image_url: urlData.publicUrl,
                });
            if (urlInsertError) return handleError(urlInsertError.message, 500);
        }

    } catch (error) {
        console.error("Unexpected error:", error);
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
                posts_pictures (image_url),
                posts_likes (user_id)
              `)
            .order('created_at', { ascending: false });

        if (error) return handleError(error.message, 500);
        console.log(posts);
        return NextResponse.json(posts, { status: 200 });
    } catch (error) {
        console.error("Unexpected error:", error);
        return handleError("An unexpected error occurred", 500);
    }
}

async function handleError(error: string, status: number) {
    return NextResponse.json({ error }, { status });
}
