import BalanceDisplay from '@/components/BalanceDisplay'
import BankStatement from '@/components/BankStatement'
import TransferOptions from '@/components/TransferOptions';
import { createClient } from '@/lib/supabase/server';

export default async function Transactions() {

    const { data: { user }, } = await createClient().auth.getUser();

    return (
        <div className='text-center pb-8'>
            <div className='md:flex md:items-center md:justify-center md:mt-16 my-10 pt-32 md:pt-0'>
                <div>
                    <BalanceDisplay />
                    <TransferOptions />
                </div>
                <BankStatement user={user} />
            </div>
        </div>
    )
}