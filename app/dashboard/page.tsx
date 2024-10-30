import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Header from '@/components/Header'
import { PiggyBank } from "lucide-react"
import DashboardNewsWindow from '@/components/DashboardNewsWindow'
import DashboardOption from '@/components/DashboardOption'
import { Button } from '@/components/ui/button'
import { dashboardOptions } from '@/lib/constants'
import { dollarFormat } from '@/lib/utils'

export default async function DashboardPage() {

  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select()
    .eq('id', user.id)
    .single();

  const { balance } = profile

  return (
    <div className='bg-dark_gray-gradient text-white text-center min-h-screen pb-8'>
      <Header />
      <div className="md:flex md:justify-between md:items-center md:mt-10">
        <div className="md:w-4/5 md:flex md:flex-col md:items-center">
          <div className="md:bg-register-card-gradient md:p-8 md:w-[400px] md:mb-6 md:rounded-md flex flex-col gap-4 justify-center p-8 py-12">
            <h2 className="text-2xl text-gray-200">Your Balance</h2>
            <h1 className="font-bold text-4xl">
              <span className="text-green-500">A$ </span>
              {dollarFormat.format(balance).slice(1)}
            </h1>
            <h3 className="text-sm text-gray-300 underline cursor-pointer">View Bank Statement</h3>
          </div>
          <div className="flex justify-center ">
            <Button className="flex my-8 py-6 mx-8 md:w-[400px] w-full">
              <PiggyBank className="h-10 w-10 mr-2" />
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