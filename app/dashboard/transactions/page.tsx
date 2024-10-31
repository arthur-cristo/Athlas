import BalanceDisplay from '@/components/BalanceDisplay'
import Header from '@/components/Header'
import { createClient } from '@/lib/supabase/server'

export default async function Transactions() {

    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    const { data: profile } = await supabase
        .from('profiles')
        .select()
        .eq('id', user?.id)
        .single();
    const { balance } = profile

    return (
        <div className='bg-dark_gray-gradient text-white text-center min-h-screen pb-8'>
            <Header />
            <BalanceDisplay balance={balance} />
        </div>
    )
}