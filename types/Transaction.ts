export interface TransactionType {
    sender_id: string;
    receiver_id: string;
    amount: number;
}

export enum TransactionStatuts {
    CANCELED = "CANCELED",
    PENDING = "PENDING",
    COMPLETED = "COMPLETED"
}