'use client'

import { createClient } from '@/lib/supabase/client'
import { dollarFormat } from '@/lib/utils'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useUser } from '@/app/UserContext'
import { usePathname } from 'next/navigation'

const BalanceDisplay = () => {

    const [balance, setBalance] = useState<number | null>(null);
    const user = useUser();
    const supabase = createClient();
    const pathName = usePathname();

    useEffect(() => {

        const fetchBalance = async () => {
            try {
                if (!user) return;
                const { data, error } = await supabase
                    .from('profiles')
                    .select('balance')
                    .eq('id', user.id)
                    .single();

                if (error) throw error;

                setBalance(data.balance ?? 0);
            } catch (error) {
                console.error('Failed to fetch balance:', error);
            }
        };

        fetchBalance();
        const intervalId = setInterval(fetchBalance, 10000);

        return () => clearInterval(intervalId);
    }, [user]);

    return (
        <div className="bg-balance_display-gradient md:bg-transparent md:p-8 md:w-[400px] md:mb-6 md:rounded-md flex flex-col justify-center p-8 py-16">
            <h2 className="text-xl font-medium text-gray-200">Your Balance</h2>
            {balance && (
                <h1 className="font-bold text-4xl">
                <span className="text-green-500">$</span>
                {dollarFormat.format(balance).slice(1)}
            </h1>
            )}
            {pathName !== '/transactions' && (
                <Link href='/transactions'>
                    <h3 className="text-sm text-gray-300 underline cursor-pointer mt-4">View Bank Statement</h3>
                </Link>
            )}

        </div>
    )
}

export default BalanceDisplay