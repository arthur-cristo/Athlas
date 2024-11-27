import BalanceDisplay from '@/components/BalanceDisplay'
import BankStatement from '@/components/BankStatement'
import Header from '@/components/Header'
import TransferOptions from '@/components/TransferOptions';
import { createClient } from '@/lib/supabase/server';

export default async function Transactions() {

    const { data: { user }, } = await createClient().auth.getUser();

    return (
        <div className='text-center md:h-screen min-h-screen pb-8'>
            <Header />
            <div className='md:flex md:items-center md:justify-center md:mt-2 my-10'>
                <div>
                    <BalanceDisplay />
                    <TransferOptions />
                </div>
                <BankStatement user={user} />
            </div>
        </div>
    )
}