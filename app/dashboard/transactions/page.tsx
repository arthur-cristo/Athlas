'use client'

import BalanceDisplay from '@/components/BalanceDisplay'
import Header from '@/components/Header'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

const Transactions = async () => {

    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()

    const { data: profile } = await supabase
        .from('profiles')
        .select()
        .eq('id', user?.id)
        .single();

    const { balance } = profile

    const [balanceState, setBalanceState] = useState(balance)

    return (
        <div className='bg-dark_gray-gradient text-white text-center min-h-screen pb-8'>
            <Header />
            <BalanceDisplay balance={balance} />
            <Input ></Input>
        </div>
    )
}

export default Transactions