import BalanceDisplay from '@/components/BalanceDisplay'
import TransferForm from '@/components/forms/TransferForm'
import Header from '@/components/Header'

export default async function Transactions() {

    return (
        <div className='bg-dark_gray-gradient text-white text-center min-h-screen pb-8'>
            <Header />
            <div className='md:flex md:items-center md:justify-center md:mt-20'>
                <BalanceDisplay />
                <div className='bg-register-card-gradient mx-8 rounded-md flex flex-col p-8 gap-8'>
                    <h1 className='font-bold text-xl'>Transfer Your Money</h1>
                    <TransferForm />
                </div>
            </div>
        </div>
    )
}