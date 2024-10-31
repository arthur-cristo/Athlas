import { createClient } from "@/lib/supabase/server";
import { isTransectionValid } from "@/services/TransactionService";
import { TransactionType, TransactionStatuts } from "@/types/Transaction";
import { NextRequest, NextResponse } from "next/server";

// TransactionType {
//     sender_id: string;
//     receiver_id: string;
//     amount: number;}

export async function POST(req: NextRequest) {

    const supabase = createClient();

    try {

        // Validate request
        const data = await req.json();
        const { sender_id, receiver_id, amount } = data;
        const errors = [];
        if (!sender_id) errors.push('sender_id is required');
        if (!receiver_id) errors.push('receiver_id is required');
        if (!amount) errors.push('amount is required');
        if (errors.length) {
            return NextResponse.json({ error: 'Missing attributes: ' + errors.join(', ') }, { status: 400 });
        }

        // Validate transaction
        const transaction: TransactionType = {
            sender_id: sender_id,
            receiver_id: receiver_id,
            amount: amount
        };
        const isValid = await isTransectionValid(transaction);
        if (!isValid.isValid) {
            return NextResponse.json({ error: isValid.message }, { status: 400 });
        }

        // Save transaction
        const { data: pendingTransaction, error: pendingTransactionError } = await supabase.from('transactions').insert([transaction]).select().single();
        if (pendingTransactionError) return NextResponse.json({ error: pendingTransactionError.message }, { status: 500 });

        const transactionId = pendingTransaction.id;

        // Get sender and receiver profiles
        const { data: senderProfile, error: senderError } = await supabase.from('profiles').select('balance').eq('id', sender_id).single();
        if (senderError) return handleError(transactionId, senderError.message, 500);
        const { data: receiverProfile, error: receiverError } = await supabase.from('profiles').select('balance').eq('id', receiver_id).single();
        if (receiverError) return handleError(transactionId, receiverError.message, 500);

        // Update sender balance
        const { data: updatedSender, error: updatedSenderError } = await supabase.from('profiles').update({ balance: senderProfile.balance - amount }).eq('id', sender_id).select().single();
        if (updatedSenderError) return handleError(transactionId, updatedSenderError.message, 500);

        // Update receiver balance
        const { data: updatedReceiver, error: updatedReceiverError } = await supabase.from('profiles').update({ balance: receiverProfile.balance + amount }).eq('id', receiver_id).select().single();
        if (updatedReceiverError) return handleError(transactionId, updatedReceiverError.message, 500);

        // Complete transaction
        const { data: completedTransaction, error: completedTransactionError } = await supabase.from('transactions').update({ status: TransactionStatuts.COMPLETED }).eq('id', pendingTransaction.id).select().single();
        if (completedTransactionError) return handleError(transactionId, completedTransactionError.message, 500);

        return NextResponse.json({ message: 'Transaction successful', sender: updatedSender, receiver: updatedReceiver, transaction: completedTransaction }, { status: 200 });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}

async function handleError(transactionId: string, error: string, status: number) {
    const supabase = createClient();
    await supabase.from('transactions').update({ status: TransactionStatuts.CANCELED }).eq('id', transactionId).select().single();
    return NextResponse.json({ error: error }, { status: status });
}