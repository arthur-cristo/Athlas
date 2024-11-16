import BalanceDisplay from '@/components/BalanceDisplay'
import BankStatement from '@/components/BankStatement'
import Header from '@/components/Header'
import TransferOptions from '@/components/TransferOptions';
import { createClient } from '@/lib/supabase/server';
import { HandCoins, KeyRound } from 'lucide-react';

export const options = [
    { label: 'Transfer', link: '/transactions/transfer', Icon: HandCoins },
    { label: 'My Keys', link: '/transactions/keys', Icon: KeyRound },
]

export default async function Transactions() {

    const { data: { user }, } = await createClient().auth.getUser();

    return (
        <div className='bg-very_dark_gray text-white text-center md:h-screen min-h-screen pb-8'>
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