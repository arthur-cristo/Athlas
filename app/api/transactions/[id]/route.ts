import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

    const supabase = createClient();

    try {
        // Validate request
        const user_id = req.url.split('/').pop();
        console.log(user_id);
        if (!user_id) return NextResponse.json({ error: 'User id is missing' }, { status: 400 });
        const { data: transactions, error } = await supabase
            .from('transactions')
            .select()
            .or(`receiver_id.eq.${user_id},sender_id.eq.${user_id}`)
            .order('created_at', { ascending: false });
        console.log(transactions);
        if (error) NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json(transactions);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}