'use client'

import Header from "@/components/Header"

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
        <div className="bg-gradient-to-b from-black to-gray-900 text-white min-h-screen p-10 mt-16 flex justify-center flex-col text-center">
            <Header />
            <h2 className="text-2xl text-gray-200">{`Hello ${first_name} ${last_name} 👋`}</h2>
            <h1 className="font-bold text-5xl mt-4">
                <span className="text-green-500">A$</span>
                {USDollar.format(balance).slice(1)}
            </h1>
        </div>
    )
}

export default DashboardClient