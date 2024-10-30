import BalanceDisplay from '@/components/BalanceDisplay'
import Header from '@/components/Header'

const Transactions = () => {
    return (
        <div className='bg-dark_gray-gradient text-white text-center min-h-screen pb-8'>
            <Header />
            <BalanceDisplay />
        </div>
    )
}

export default Transactions