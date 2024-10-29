'use client'

import Header from "@/components/Header"
import { Label } from "@radix-ui/react-label"
import { HandCoins, Wallet } from "lucide-react"

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
            <div className="flex flex-col gap-6 bg-register-card-gradient rounded-md justify-center items-center p-12">
                <h2 className="text-2xl text-gray-200">{`Hello, ${first_name} ${last_name}`}</h2>
                <h1 className="font-bold text-5xl">
                    <span className="text-green-500">A$</span>
                    {USDollar.format(balance).slice(1)}
                </h1>
            </div>
            <div className="flex gap-6 justify-center items-center">
                <div className="flex flex-col justify-center items-center bg-green-500 w-32 h-32 rounded-md p-2 gap-2">
                    <Label className="font-medium text-xl">Transactions</Label>
                    <HandCoins className="w-16 h-16" />
                </div>
                <div className="flex flex-col justify-center items-center bg-green-500 w-32 h-32 rounded-md p-2 gap-2">
                    <Label className="font-medium text-xl">Stocks</Label>
                    <Wallet className="w-16 h-16" />
                </div>
            </div>
        </>
    )
}

export default DashboardClient