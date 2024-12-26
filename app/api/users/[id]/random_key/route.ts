import { createClient } from "@/lib/supabase/server";
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {

    const supabase = createClient();

    const user_id = req.nextUrl.pathname.split("/")[3];

    try {
        const newRandomKey = randomUUID();
        const { data, error } = await supabase.from("profiles").update({ random_key: newRandomKey }).eq("id", user_id).select().single();
        if (error) return NextResponse.json({ error: "Failed to generate a new random key", description: error }, { status: 500 });
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to generate a new random key", description: error }, { status: 500 });
    }
}