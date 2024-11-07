import { dollarFormat } from '@/lib/utils';
import { TransactionType } from '@/types/Transaction'
import { Banknote } from "lucide-react";

interface BankStatementTransactionProps {
    transaction: TransactionType;
    user_id: string;
}

const BankStatementTransaction: React.FC<BankStatementTransactionProps> = ({ transaction, user_id }) => {

    //Enviou
    if (transaction.sender_id === user_id) {
        return (
            <div className='flex my-4 bg-dark_gray p-6 w-full rounded-md'>
                <div className='h-20 w-20 bg-light_gray flex items-center justify-center rounded-full mr-6'>
                    <Banknote className="h-10 w-10" />
                </div>
                <div className='flex flex-col text-left'>
                    <h3 className='font-bold mb-1'>Sent Transfer</h3>
                    <p>{transaction.receiver_name}</p>
                    <p>${dollarFormat.format(transaction.amount).slice(1)}</p>
                </div>
            </div>
        )
    } else {
        return (
            <div className='flex my-4 bg-dark_gray p-6 w-full rounded-md'>
                <div className='h-20 w-20 bg-green-950 flex items-center justify-center rounded-full mr-6'>
                    <Banknote className="h-10 w-10 text-green-600" />
                </div>
                <div className='flex flex-col text-left'>
                    <h3 className='font-bold mb-1'>Received Transfer</h3>
                    <p>{transaction.sender_name}</p>
                    <p>${dollarFormat.format(transaction.amount).slice(1)}</p>
                </div>
            </div>
        )
    }
}

export default BankStatementTransaction