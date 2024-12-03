'use client'

import Link from "next/link"
import { Button } from "./ui/button"
import { Sparkles } from "lucide-react"
import { useUser } from "@/app/UserContext"
import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

const Header = () => {

  const user = useUser();
  const { theme, setTheme } = useTheme()
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const { first_name, last_name } = user?.user_metadata || {}

  return (
    <header className="py-2 shadow-md flex flex-col">
      <div className="container mx-auto px-8 md:px-3 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">ATHLAS</span>
        </Link>
        {user ? (
          <div className="flex items-center space-x-1">
            <Button
              onClick={toggleTheme}
              variant="outline"
              size="icon"
              className="m-0 border-none shadow-none text-muted-foreground hover:text-primary hover:bg-transparent focus-visible:ring-0"
            >
              <Sun
                className={`h-[1.2rem] w-[1.2rem] transition-transform ${theme === "light" ? "rotate-0 scale-100" : "-rotate-90 scale-0"
                  }`}
              />
              <Moon
                className={`absolute h-[1.2rem] w-[1.2rem] transition-transform ${theme === "dark" ? "rotate-0 scale-100" : "rotate-90 scale-0"
                  }`}
              />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Link href='/auth/signout'>
              <Button
                variant="ghost"
                className="text-sm font-medium text-muted-foreground hover:text-primary hover:bg-transparent"
              >
                Sign Out
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button className="text-sm font-medium bg-primary hover:bg-primary/80  shadow-lg shadow-green-900/25">
                Dashboard
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <nav className="hidden md:flex items-center space-x-8 absolute right-1/2 translate-x-1/2">
              <Link className="text-muted-foreground hover:text-primary transition-colors" href="#about">
                About
              </Link>
              <Link className="text-muted-foreground hover:text-primary transition-colors" href="#solutions">
                Solutions
              </Link>
              <Link className="text-muted-foreground hover:text-primary transition-colors" href="#contact">
                Contact
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Button
                onClick={toggleTheme}
                variant="outline"
                size="icon"
                className="m-0 border-none shadow-none text-muted-foreground hover:text-primary hover:bg-transparent focus-visible:ring-0"
              >
                <Sun
                  className={`h-[1.2rem] w-[1.2rem] transition-transform ${theme === "light" ? "rotate-0 scale-100" : "-rotate-90 scale-0"
                    }`}
                />
                <Moon
                  className={`absolute h-[1.2rem] w-[1.2rem] transition-transform ${theme === "dark" ? "rotate-0 scale-100" : "rotate-90 scale-0"
                    }`}
                />
                <span className="sr-only">Toggle theme</span>
              </Button>
              <Link href="/auth/login">
                <Button variant="ghost" className="text-sm font-medium text-muted-foreground hover:text-primary hover:bg-transparent">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="text-sm font-medium bg-primary hover:bg-primary/80  shadow-lg shadow-green-900/25">
                  Sign Up
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
      {user && (
        <h2 className="md:hidden flex justify-center text-xl py-3 font-medium text-center">{`Hello, ${first_name} ${last_name}!`}</h2>
      )}
    </header>
  )
}
export default Header