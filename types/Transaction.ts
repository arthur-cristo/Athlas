export interface TransactionType {
    id?: string;
    sender_id: string;
    receiver_id: string;
    amount: number;
    created_at: Date;
    sender_name: string;
    receiver_name: string;
}