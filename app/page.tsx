import Header from "@/components/Header";
import Hero from "@/components/Hero";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {

  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const { data: user, error } = await supabase.auth.getUser()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="bg-dark_gray-gradient">
      <Header />
      <Hero />
    </div>
  );
}
