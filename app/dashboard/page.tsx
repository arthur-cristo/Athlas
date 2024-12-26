
import { PiggyBank } from "lucide-react"
import DashboardNewsWindow from '@/components/DashboardNewsWindow'
import DashboardOption from '@/components/DashboardOption'
import { Button } from '@/components/ui/button'
import { dashboardOptions } from '@/lib/constants'

import BalanceDisplay from '@/components/BalanceDisplay'

export default async function DashboardPage() {

  return (
    <main className="flex flex-col justify-center items-center md:pt-0 pt-32 mt-8 text-center overflow-hidden">
      <div className="mt-4 flex flex-col items-center justify-center">
        <BalanceDisplay />
        <Button className="flex my-4 mx-8 py-6 mt-0 md:w-[400px] px-20 text-xl">
          <PiggyBank className="h-[32px] w-[32px] mr-2" />
          Meu Porquinho
        </Button>
        <div className="ml-4 md:ml-0 md:w-[400px] md:flex-wrap md:overflow-x-auto overflow-x-scroll justify-start px-3 flex gap-6 items-center md:my-0 my-8 py-5 bg-muted dark:bg-muted/50 dark:md:bg-transparent md:bg-background w-screen md:justify-center text-foreground">
          {dashboardOptions.map((option, index) => (
            <DashboardOption key={index} {...option} />
          ))}
        </div>
      </div>
      <DashboardNewsWindow />
    </main>
  )
}