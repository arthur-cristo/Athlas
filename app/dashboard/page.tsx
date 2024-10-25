import { supabase } from "@/lib/supabase/client"

const Dashboard = async () => {

  const session = await supabase.auth.getSession();
  const userMetaData: any = session.data.session?.user.user_metadata

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome {userMetaData?.full_name}</p>
    </div>
  )
}

export default Dashboard