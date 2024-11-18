import { createClient } from "@/lib/supabase/server";
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
    const supabase = createClient();

    const user_id = req.nextUrl.pathname.split("/")[3];
    const formData = await req.formData();
    const bio = formData.get("bio") as string;
    const file = formData.get("image");

    let fileUrl = null;
    if (file && file instanceof File) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const fileExtension = file.name.split(".").pop() || "jpg";
        const fileName = `${Date.now()}-${randomUUID()}.${fileExtension}`;


        const { error: uploadError } = await supabase.storage
            .from("profile_pictures")
            .upload(fileName, buffer, {
                cacheControl: "3600",
                upsert: false,
                contentType: file.type,
            });

        if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });
        
        const { data: urlData } = supabase.storage
            .from("profile_pictures")
            .getPublicUrl(fileName);

        if (!urlData) {
            return NextResponse.json({ error: "Failed to get file URL" }, { status: 404 });
        }
        fileUrl = urlData.publicUrl;
    }

    const { data, error: updateError } = await supabase
        .from("profiles")
        .update({
            bio,
            ...(fileUrl ? { profile_picture: fileUrl } : {}),
        })
        .eq("id", user_id)
        .select()
        .single();

    if (updateError || !data) return NextResponse.json({ error: updateError?.message || 'User Not Found' }, { status: 500 });

    return NextResponse.json({ success: true, message: "Profile successfully updated" }, { status: 200 });
}
