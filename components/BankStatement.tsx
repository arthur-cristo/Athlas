'use client'

import { TransactionType } from "@/types/Transaction";
import { useEffect, useState } from "react";
import BankStatementTransaction from "./BankStatementTransaction";
import { User } from "@supabase/supabase-js";

interface BankStatementProps {
    user: User | null;
}

const BankStatement: React.FC<BankStatementProps> = ({ user }) => {

    const [bankStatement, setBankStatement] = useState<TransactionType[] | null>(null);

    useEffect(() => {
        if (!user) return;

        const fetchBankStatement = async () => {
            try {
                const response = await fetch(`/api/transactions/${user.id}`);
                const data = await response.json();
                setBankStatement(data);
            } catch (error) {
                console.error("Failed to fetch bank statement:", error);
            }
        };

        fetchBankStatement();
        const intervalId = setInterval(fetchBankStatement, 10000);

        return () => clearInterval(intervalId);
    }, [user]);

    return (
        <div className="m-8 flex flex-col items-center justify-center md:fixed md:right-10">
            <h1 className="font-bold text-2xl mt-10 text-left">History</h1>
            <div className="md:max-h-[350px] md:overflow-y-auto">
                {!bankStatement ? (
                    <p>Loading your transactions...</p>
                ) : bankStatement.length ? (
                    bankStatement.map((transaction: TransactionType) => (
                        <BankStatementTransaction
                            key={transaction.id}
                            transaction={transaction}
                            user_id={user?.id ?? ""}
                        />
                    ))
                ) : (
                    <p>No transactions found.</p>
                )}
            </div>
        </div>
    );
};

export default BankStatement