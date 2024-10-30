import { HandCoins, Wallet, MessageCircleMore, PiggyBank, ShoppingBag } from "lucide-react"
import DashboardOption from "./DashboardOption"
import { Button } from "./ui/button"
import DashboardNewsWindow from "./DashboardNewsWindow"

interface Profile {
    first_name: string
    last_name: string
    balance: number
}

interface DashboardClientProps {
    profile: Profile
}

const DashboardClient = ({ profile }: DashboardClientProps) => {

    const { balance } = profile

    const USDollar = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    })

    const options = [
        { label: 'Transactions', link: '/', Icon: HandCoins },
        { label: 'Stocks', link: '/', Icon: Wallet },
        { label: 'Store', link: '/', Icon: ShoppingBag },
        { label: 'Community', link: '/', Icon: MessageCircleMore },
    ]

    return (
        <div className="md:flex md:justify-between md:items-center md:mt-10">
            <div className="md:w-2/3 md:flex md:flex-col md:items-center">
                <div className="md:bg-register-card-gradient md:p-6 md:w-[400px] md:mb-6 md:rounded-md flex flex-col gap-4 justify-center p-8 py-12">
                    <h2 className="text-2xl text-gray-200">Your Balance</h2>
                    <h1 className="font-bold text-4xl">
                        <span className="text-green-500">A$ </span>
                        {USDollar.format(balance).slice(1)}
                    </h1>
                    <h3 className="text-sm text-gray-300 underline cursor-pointer">View Bank Statement</h3>
                </div>
                <div className="flex justify-center ">
                    <Button className="flex my-8 py-6 mx-8 md:w-[400px] w-full">
                        <PiggyBank className="h-10 w-10 mr-2" />
                        My Savings
                    </Button>
                </div>
                <div className="md:bg-transparent px-3 flex gap-6 items-center my-8 py-5 bg-dark-gray md:w-fit w-screen overflow-x-auto">
                    {options.map((option, index) => (
                        <DashboardOption key={index} {...option} />
                    ))}
                </div>
            </div>
            <DashboardNewsWindow />
        </div>
    )
}

export default DashboardClient