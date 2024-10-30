import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardClient from '@/components/Dashboard'

export default async function DashboardPage() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select()
    .eq('id', user.id)
    .single()

  if (profileError) {
    return <div>Error loading profile</div>
  }

  return (
    <div className='h-screen w-screen bg-dark_gray-gradient text-white flex items-center justify-center flex-col text-center gap-12'>
      <div className='bg-register-gradient flex flex-col h-screen w-screen justify-center md:flex-row p-8 gap-8'>
        <DashboardClient profile={profile} />
      </div>
    </div>
  )
}