import Header from '@/components/Header'
import TransferForm from '@/components/forms/TransferForm';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default async function Transactions() {

    return (
        <div className='text-center h-screen'>
            <Header />
            <div className='mx-8 flex justify-center items-center flex-col md:mt-12 pt-40 md:pt-0 '>
                <Link href='/transactions' className='flex w-full justify-start mb-8 md:w-[788px]'>
                    <ChevronLeft className='h-8 w-8' />
                </Link>
                <TransferForm />
            </div>
        </div>
    )
}