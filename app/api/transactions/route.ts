import { createClient } from "@/lib/supabase/server";
import { TransactionType, TransactionStatuts } from "@/types/Transaction";
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

        const transaction: TransactionType = {
            sender_id,
            receiver_id,
            amount
        };

        // Save transaction
        const { data: pendingTransaction, error: pendingTransactionError } = await supabase
            .from('transactions')
            .insert([transaction])
            .select()
            .single();
        if (pendingTransactionError || !pendingTransaction) return NextResponse.json({ error: pendingTransactionError?.message || "Failed to create transaction" }, { status: 500 });

        const transaction_id = pendingTransaction.id;

        // Get sender and receiver profiles
        const { data: profiles, error: profileError } = await supabase
            .from("profiles")
            .select("id, balance")
            .in("id", [sender_id, receiver_id]);

        if (profileError || profiles?.length !== 2) return handleError(transaction_id, "Profiles not found or error retrieving profiles", 500);

        const senderProfile = profiles.find(profile => profile.id === sender_id);
        const receiverProfile = profiles.find(profile => profile.id === receiver_id);

        if (!senderProfile || senderProfile.balance < amount) return handleError(transaction_id, "Sender not found.", 400);
        if (senderProfile.balance < amount) return handleError(transaction_id, "Insufficient balance.", 400);
        if (!receiverProfile) return handleError(transaction_id, "Receiver not found.", 400);
        //
        const { error: updateError } = await supabase.rpc("transfer_balance", {
            sender_id,
            receiver_id,
            amount,
            transaction_id
        });

        if (updateError) return handleError(transaction_id, updateError.message, 500);

        await supabase
            .from('transactions')
            .update({ status: TransactionStatuts.COMPLETED })
            .eq('id', transaction_id)

        return NextResponse.json({ message: 'Transaction successful'}, { status: 200 });
    } catch (error) {
        console.error("Unexpected error:", error);
        return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
    }
}

async function handleError(transactionId: string | null, error: string, status: number) {
    const supabase = createClient();

    if (transactionId) {
        await supabase.from("transactions").update({ status: TransactionStatuts.CANCELED }).eq("id", transactionId);
    }

    return NextResponse.json({ error }, { status });
}