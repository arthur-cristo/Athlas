import Header from '@/components/Header'
import { PiggyBank } from "lucide-react"
import DashboardNewsWindow from '@/components/DashboardNewsWindow'
import DashboardOption from '@/components/DashboardOption'
import { Button } from '@/components/ui/button'
import { dashboardOptions } from '@/lib/constants'

import BalanceDisplay from '@/components/BalanceDisplay'

export default async function DashboardPage() {

  return (
    <div className='bg-very_dark_gray text-white text-center md:h-screen min-h-screen md:pb-2 pb-8'>
      <Header />
      <div className="flex flex-col justify-center items-center md:mt-10">
        <div className="flex flex-col justify-center md:h-fit h-[80vh]">
          <BalanceDisplay />
          <div className="flex md:mt-0 mt-14 justify-center">
            <Button className="flex my-8 py-6 mt-0 md:w-[400px] px-20 text-xl">
              <PiggyBank className="h-full w-full mr-2" />
              My Savings
            </Button>
          </div>
          <div className="md:bg-transparent px-3 flex gap-6 items-center md:my-0 my-8 py-5 bg-dark_gray md:w-fit w-screen justify-center">
            {dashboardOptions.map((option, index) => (
              <DashboardOption key={index} {...option} />
            ))}
          </div>
        </div>
        <DashboardNewsWindow />
      </div>
    </div>
  )
}