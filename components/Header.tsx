import Link from "next/link"
import { Button } from "./ui/button"
import { Sparkles } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

const Header = async () => {

  const {
    data: { user },
  } = await createClient().auth.getUser();

  const { first_name, last_name } = user?.user_metadata || {}

  return (
    <header className="header-gradient py-2 flex flex-col">
      <div className="container mx-auto px-8 md:px-3 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-green-500" />
          <span className="font-bold text-xl text-white">ATHLAS</span>
        </Link>

        {user ? (
          <div className="flex items-center space-x-4">
            <Link href='/auth/signout'>
              <Button
                variant="ghost"
                className="text-sm font-medium text-gray-300 hover:text-gray-200 hover:bg-transparent"
              >
                Sign Out
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button className="text-sm font-medium bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-900/25">
                Dashboard
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <nav className="hidden md:flex items-center space-x-8">
              <Link className="text-gray-300 hover:text-white transition-colors" href="/about">
                About
              </Link>
              <Link className="text-gray-300 hover:text-white transition-colors" href="/solutions">
                Solutions
              </Link>
              <Link className="text-gray-300 hover:text-white transition-colors" href="/contact">
                Contact
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="ghost" className="text-sm font-medium text-gray-300 hover:text-gray-200 hover:bg-transparent">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="text-sm font-medium bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-900/25">
                  Sign Up
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
      {user && (
        <h2 className="md:hidden flex justify-center text-xl py-3 font-medium text-gray-100 text-center">{`Hello, ${first_name} ${last_name}!`}</h2>
      )}
    </header>
  )
}
export default Header