export interface TransactionType {
    id?: string;
    sender_id: string;
    receiver_id: string;
    amount: number;
}