import Header from '@/components/Header'
import { PiggyBank } from "lucide-react"
import DashboardNewsWindow from '@/components/DashboardNewsWindow'
import DashboardOption from '@/components/DashboardOption'
import { Button } from '@/components/ui/button'
import { dashboardOptions } from '@/lib/constants'

import BalanceDisplay from '@/components/BalanceDisplay'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {

  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select()
    .eq('id', user?.id)
    .single();

  const { balance } = profile

  return (
    <div className='bg-dark_gray-gradient text-white text-center min-h-screen pb-8'>
      <Header />
      <div className="md:flex md:justify-between md:items-center md:mt-10">
        <div className="md:w-4/5 md:flex md:flex-col md:items-center">
          <BalanceDisplay balance={balance} />
          <div className="flex justify-center ">
            <Button className="flex my-8 py-6 mx-8 md:w-[400px] w-full text-xl">
              <PiggyBank className="h-full w-full mr-2" />
              My Savings
            </Button>
          </div>
          <div className="md:bg-transparent px-3 flex gap-6 items-center md:my-0 my-8 py-5 bg-dark-gray md:w-fit w-screen overflow-x-auto">
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