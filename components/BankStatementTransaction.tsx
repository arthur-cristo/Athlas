import { dollarFormat } from '@/lib/utils';
import { TransactionType } from '@/types/Transaction'
import { Banknote } from "lucide-react";

interface BankStatementTransactionProps {
    transaction: TransactionType;
    user_id: string;
}

const BankStatementTransaction: React.FC<BankStatementTransactionProps> = ({ transaction, user_id }) => {

    return (
        <div className='flex my-4 w-80 mx-8 py-6 border-b-2 border-opacity-40 border-black items-center'>
            {transaction.sender_id === user_id ? (
                <>
                    <div className='h-fit bg-light_gray flex items-center justify-center rounded-full p-2'>
                        <Banknote className="h-10 w-10 text-gray-300" />
                    </div>
                    <div className='flex flex-col text-left w-full ml-6'>
                        <div className='flex justify-between mb-2'>
                            <h3 className='font-bold'>Sent Transfer</h3>
                            <p className="text-gray-300">{new Date(transaction.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                        </div>
                        <p>{transaction.receiver_name}</p>
                        <p>${dollarFormat.format(transaction.amount).slice(1)}</p>
                    </div>
                </>
            ) : (
                <>
                    <div className='h-fit bg-green-950 flex items-center justify-center rounded-full p-2'>
                        <Banknote className="h-10 w-10 text-green-600" />
                    </div>
                    <div className='flex flex-col text-left w-full ml-6'>
                        <div className='flex justify-between mb-2'>
                            <h3 className='font-bold'>Received Transfer</h3>
                            <p className="text-gray-300">{new Date(transaction.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                        </div>
                        <p>{transaction.sender_name}</p>
                        <p>${dollarFormat.format(transaction.amount).slice(1)}</p>
                    </div>
                </>

            )}
        </div>
    )
}

export default BankStatementTransaction