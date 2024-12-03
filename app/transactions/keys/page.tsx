import Header from '@/components/Header'
import KeysList from '@/components/KeysList';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default async function Keys() {

    return (
        <div className='  text-center min-h-screen'>
            <Header />
            <div className='mx-8 mt-8 flex justify-center items-center flex-col md:mt-16'>
                <Link href='/transactions' className='flex w-full justify-start mb-8 md:w-[640px]'>
                    <ChevronLeft className='h-8 w-8' />
                </Link>
                <div className='flex flex-col gap-4 items-center mb-8'>
                    <h1 className="text-3xl font-bold w-[60vw]">Receivement Keys</h1>
                    <p className="text-muted-foreground text-md w-3/4">Share these keys with other users so they can send you money.</p>
                </div>
                <KeysList />
            </div>
        </div>
    )
}