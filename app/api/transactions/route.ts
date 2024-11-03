import { createClient } from "@/lib/supabase/server";
import { TransactionType } from "@/types/Transaction";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {

    const supabase = createClient();

    try {

        const data = await req.json();
        const { sender_id, receiver_id, amount } = data;

        const errors = [];
        if (!sender_id) errors.push('sender_id is required');
        if (!receiver_id) errors.push('receiver_id is required');
        if (typeof amount !== "number" || amount <= 0) errors.push("valid amount is required");

        if (errors.length) {
            return NextResponse.json({ error: 'Missing attributes: ' + errors.join(', ') }, { status: 400 });
        }

        // Get sender and receiver profiles
        const { data: profiles, error: profileError } = await supabase
            .from("profiles")
            .select("id, balance")
            .in("id", [sender_id, receiver_id]);

        if (profileError) return handleError("Profiles not found or error retrieving profiles", 500);
        if (profiles?.length !== 2) return handleError("You can't transfer to yourself.", 500);

        const senderProfile = profiles.find(profile => profile.id === sender_id);
        const receiverProfile = profiles.find(profile => profile.id === receiver_id);

        if (!senderProfile) return handleError("Sender not found.", 400);
        if (senderProfile.balance < amount) return handleError("Insufficient balance.", 400);
        if (!receiverProfile) return handleError("Receiver not found.", 400);

        const { error: updateError } = await supabase.rpc("transfer_balance", {
            sender_id,
            receiver_id,
            amount
        });

        if (updateError) return handleError(updateError.message, 500);

        return NextResponse.json({ message: 'Transaction successful' }, { status: 200 });
    } catch (error) {
        console.error("Unexpected error:", error);
        return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
    }
}

async function handleError(error: string, status: number) {

    return NextResponse.json({ error }, { status });
}