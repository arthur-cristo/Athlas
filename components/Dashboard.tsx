import { HandCoins, Wallet, MessageCircleMore, PiggyBank, ShoppingBag } from "lucide-react"
import DashboardOption from "./DashboardOption"
import DashboardNews from "./DashboardNews"
import { Button } from "./ui/button"

interface Profile {
    first_name: string
    last_name: string
    balance: number
}

interface DashboardClientProps {
    profile: Profile
}

const DashboardClient = ({ profile }: DashboardClientProps) => {

    const { first_name, last_name, balance } = profile

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

    const news = [
        { title: 'Building the app', content: 'We are working hard to bring you the best experience' },
        { title: 'New feature', content: 'We have added a new feature to the app' },
        { title: 'New feature', content: 'We have added a new feature to the app' },
        { title: 'New feature', content: 'We have added a new feature to the app' },
        { title: 'New feature', content: 'We have added a new feature to the app' },
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
                <div className="md:bg-transparent px-3 flex gap-6 items-center py-5 bg-dark-gray md:w-fit w-screen overflow-x-auto">
                    {options.map((option, index) => (
                        <DashboardOption key={index} {...option} />
                    ))}
                </div>
                <div className="flex justify-center ">
                    <Button className="flex my-8 py-6 mx-8 md:w-[400px] w-full">
                        <PiggyBank className="h-6 w-6 mr-2" />
                        My Savings
                    </Button>
                </div>
            </div>
            <aside>
                <h2 className="mx-8 my-2 font-bold text-3xl text-left">Latest News</h2>
                <div className="mx-8 mt-2 flex flex-col gap-6 md:max-h-[400px] max-h-[500px] overflow-y-auto">
                    {news.map((n, index) => (
                        <DashboardNews key={index} {...n} />
                    ))}
                </div>
            </aside>
        </div>
    )
}

export default DashboardClient