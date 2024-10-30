import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardClient from '@/components/Dashboard'
import Header from '@/components/Header'

export default async function DashboardPage() {

  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select()
    .eq('id', user.id)
    .single();

  return (
    <div className='bg-dark_gray-gradient text-white text-center min-h-screen'>
      <Header />
      <DashboardClient profile={profile} />
    </div>
  )
}