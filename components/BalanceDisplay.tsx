'use client'

import { createClient } from '@/lib/supabase/client'
import { dollarFormat } from '@/lib/utils'
import { use, useEffect, useState } from 'react'

const BalanceDisplay = () => {

    const [balance, setBalance] = useState(0);

    useEffect(() => {
        const supabase = createClient();

        const fetchBalance = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                
                if (!user) {
                    console.error('No authenticated user found');
                    return;
                }

                const { data, error } = await supabase
                    .from('profiles')
                    .select('balance')
                    .eq('id', user.id)
                    .single();

                if (error) {
                    console.error('Error fetching balance:', error.message);
                    return;
                }

                setBalance(data.balance ?? 0);
            } catch (error) {
                console.error('Failed to fetch balance:', error);
            }
        };

        fetchBalance();
        const intervalId = setInterval(fetchBalance, 6000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="md:bg-register-card-gradient md:p-8 md:w-[400px] md:mb-6 md:rounded-md flex flex-col gap-4 justify-center p-8 py-12">
            <h2 className="text-2xl text-gray-200">Your Balance</h2>
            <h1 className="font-bold text-4xl">
                <span className="text-green-500">A$ </span>
                {dollarFormat.format(balance).slice(1)}
            </h1>
            <h3 className="text-sm text-gray-300 underline cursor-pointer">View Bank Statement</h3>
        </div>
    )
}

export default BalanceDisplay