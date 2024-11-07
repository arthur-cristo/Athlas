import BalanceDisplay from '@/components/BalanceDisplay'
import BankStatement from '@/components/BankStatement'
import TransferForm from '@/components/forms/TransferForm'
import Header from '@/components/Header'
import { createClient } from '@/lib/supabase/server';

export default async function Transactions() {

    const { data: { user }, } = await createClient().auth.getUser();

    return (
        <div className='bg-very_dark_gray text-white text-center md:h-screen min-h-screen pb-8'>
            <Header />
            <div className='md:flex md:items-center md:justify-center md:mt-0'>
                <div>
                    <BalanceDisplay />
                    <div className='bg-form-dark_gray mx-8 rounded-md flex flex-col md:p-4 p-8 gap-8 md:gap-4'>
                        <h1 className='font-bold text-xl'>Transfer Your Money</h1>
                        <TransferForm />
                    </div>
                </div>
                <BankStatement user={user} />
            </div>
        </div>
    )
}