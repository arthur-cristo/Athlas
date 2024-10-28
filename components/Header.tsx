import Link from "next/link";
import { Button } from "./ui/button";
import { Sparkles } from "lucide-react";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/actions/auth.actions";

const Header = async () => {

  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const { data: user, error } = await supabase.auth.getUser()

  const handleSignOut = async () => {
    const result = await signOut()
    if (result.error) {
      // Handle error (e.g., show toast notification)
    }
  }

  return (
    <header className="absolute top-0 left-0 right-0 z-50 header-gradient">
      <div className="container mx-auto px-8 md:px-3 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-green-500" />
          <span className="font-bold text-xl gradient-text">ATHLAS</span>
        </Link>

        {user ? (
          <Button
            variant="ghost"
            className="text-sm font-medium text-gray-300 hover:text-gray-200 hover:bg-transparent"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        ) : (
          <>
            <nav className="hidden md:flex items-center space-x-8">
              <Link className="nav-link" href="/about">About</Link>
              <Link className="nav-link" href="/solutions">Solutions</Link>
              <Link className="nav-link" href="/contact">Contact</Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Link href='/auth/login'>
                <Button variant="ghost" className="text-sm font-medium text-gray-300 hover:text-gray-200 hover:bg-transparent">
                  Sign In
                </Button>
              </Link>
              <Link href='/auth/register'>
                <Button className="text-sm font-medium bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-900/25">
                  Sign Up
                </Button>
              </Link>
            </div>
          </>
        )}
      </div >
    </header >
  );
};

export default Header;