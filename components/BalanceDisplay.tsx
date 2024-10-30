import { dollarFormat } from '@/lib/utils'

const BalanceDisplay = ({balance} : {balance:number}) => {

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