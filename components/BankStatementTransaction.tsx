'use client'

import { dollarFormat } from '@/lib/utils';
import { TransactionType } from '@/types/Transaction'
import { Banknote } from "lucide-react";
import { useEffect, useState } from 'react';

interface BankStatementTransactionProps {
    transaction: TransactionType;
    user_id: string;
}

const BankStatementTransaction: React.FC<BankStatementTransactionProps> = ({ transaction, user_id }) => {

    const [fullName, setFullName] = useState('')

    useEffect(() => {
        const fetchProfile = async () => {
            const searchFor = transaction.sender_id === user_id ? transaction.receiver_id : transaction.sender_id;
            const response = await fetch(`/api/users/id/${searchFor}`);
            const data = await response.json();
            setFullName(data.first_name + ' ' + data.last_name);
        }
        try {
            fetchProfile();
        } catch (error) {
            console.error('Failed to fetch profile: ', error);
        }
    }, [user_id])

    //Enviou
    if (transaction.sender_id === user_id) {
        return (
            <div className='flex my-2 bg-dark-gray p-6 w-full rounded-md'>
                <div className='h-20 w-20 bg-light-gray flex items-center justify-center rounded-full mr-6'>
                    <Banknote className="h-10 w-10" />
                </div>
                <div className='flex flex-col text-left'>
                    <h3 className='font-bold mb-1'>Sent Transfer</h3>
                    <p>{fullName}</p>
                    <p>${dollarFormat.format(transaction.amount).slice(1)}</p>
                </div>
            </div>
        )
    } else {
        return (
            <div className='flex my-2 bg-dark-gray p-6 w-full rounded-md'>
                <div className='h-20 w-20 bg-green-950 flex items-center justify-center rounded-full mr-6'>
                    <Banknote className="h-10 w-10 text-green-700" />
                </div>
                <div className='flex flex-col text-left'>
                    <h3 className='font-bold mb-1'>Received Transfer</h3>
                    <p>{fullName}</p>
                    <p>${dollarFormat.format(transaction.amount).slice(1)}</p>
                </div>
            </div>
        )
    }
}

export default BankStatementTransaction