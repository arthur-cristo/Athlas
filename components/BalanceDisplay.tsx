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
                /* TODO */
            }
        };

        fetchBalance();
        const intervalId = setInterval(fetchBalance, 10000);

        return () => clearInterval(intervalId);
    }, [user]);

    return (
        <div className="md:p-8 md:w-[400px] justify-center p-8 py-16">
            <h2 className="text-xl font-medium text-muted-foreground">Seu Saldo</h2>
            {balance && (
                <h1 className="font-bold text-4xl">
                <span className="text-primary">A$</span>
                {dollarFormat.format(balance).slice(1)}
            </h1>
            )}
            {pathName !== '/transactions' && (
                <Link href='/transactions'>
                    <h3 className="text-sm text-muted-foreground underline decoration-foreground cursor-pointer mt-4">Ver Extrato Bancário</h3>
                </Link>
            )}

        </div>
    )
}

export default BalanceDisplay