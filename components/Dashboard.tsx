'use client'

import Header from "@/components/Header"
import { HandCoins, Wallet } from "lucide-react"
import DashboardOption from "./DashboardOption"

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

    return (
        <>
            <Header />
            <div className="flex flex-col gap-6  rounded-md justify-center p-4 mt-10">
                <h2 className="text-2xl text-gray-200">{`Hello, ${first_name} ${last_name}!`}</h2>
                <h1 className="font-bold text-5xl">
                    <span className="text-green-500">A$ </span>
                    {USDollar.format(balance).slice(1)}
                </h1>
            </div>
            <div className="flex gap-6 justify-center items-center flex-col px-8">
                <DashboardOption label="Transactions" link="/dashboard/transactions" Icon={HandCoins} />
                <DashboardOption label="Stocks" link="/dashboard/stocks" Icon={Wallet} />
                <DashboardOption label="Community" link="/dashboard/community" Icon={Wallet} />
            </div>
        </>
    )
}

export default DashboardClient