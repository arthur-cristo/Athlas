import { createClient } from "@/lib/supabase/server";
import { TransactionType } from "@/types/Transaction";

type TransactionValidation = {
    isValid: boolean;
    message?: string;
}

export async function isTransectionValid({ sender_id, receiver_id, amount }: TransactionType): Promise<TransactionValidation> {
    const supabase = createClient();
    const { data: sender } = await supabase.from('profiles').select().eq('id', sender_id).single();
    const { data: receiver } = await supabase.from('profiles').select().eq('id', receiver_id).single();
    if (!sender) return { isValid: false, message: 'Sender not found' };
    if (!receiver) return { isValid: false, message: 'Receiver not found' };
    if (sender.balance < amount) return { isValid: false, message: 'Insufficient balance' };
    return { isValid: true };
}

export async function saveTransaction(transaction: TransactionType) {
    const supabase = createClient();
    const { data: savedTransaction, error } = await supabase.from('transactions').insert([transaction]).select();
    if (error) throw error;
    return savedTransaction;
}