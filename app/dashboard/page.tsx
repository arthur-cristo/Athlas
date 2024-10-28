import Header from "@/components/Header"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

const Dashboard = async () => {

  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const { data: user, error } = await supabase.auth.getUser()
  const { data: profile, error: profileError } = await supabase.from('profiles').select().eq('id', user?.user?.id).single()
  const { first_name, last_name, balance } = profile
  const USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return (
    <div className="bg-dark_gray-gradient text-white md:h-screen p-10 mt-16 flex justify-center flex-col text-center ">
      <Header />
      <h2 className="text-2xl">{`Hello ${first_name} ${last_name} 👋`}</h2>
      <h1 className="font-bold text-5xl"><span className="gradient-text">A$</span>{USDollar.format(balance).slice(1)}</h1>
    </div>
  )
}

export default Dashboard