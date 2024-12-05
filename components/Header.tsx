'use client'

import Link from "next/link"
import { Button } from "./ui/button"
import { Sparkles, X } from "lucide-react"
import { useUser } from "@/app/UserContext"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink } from "./ui/navigation-menu"
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog"

const ChangeThemeButton = () => {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "light" ? "dark" : "light");
  };

  if (!mounted) return;

  return (
    <Button
      onClick={toggleTheme}
      variant="outline"
      size="icon"
      className="m-0 border-none shadow-none text-muted-foreground hover:text-primary hover:bg-transparent focus-visible:ring-0"
    >
      {resolvedTheme === "light" ? (
        <Moon className="h-8 w-8 transition-transform" />
      ) : (
        <Sun className="h-8 w-8 transition-transform" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

const Header = () => {

  const user = useUser();
  const router = useRouter();
  const [confirmSignout, setConfirmSignout] = useState(false);
  const [isSigningOut, setSigningOut] = useState(false);

  const { first_name, last_name } = user?.user_metadata || {}

  return (
    <header className="py-2 shadow-md flex flex-col fixed left-0 right-0 top-0 bg-background md:relative z-20">
      <div className="container mx-auto px-8 md:px-3 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">ATHLAS</span>
        </Link>
        {user ? (
          <>
            <div className="md:flex hidden items-center space-x-1">
              <ChangeThemeButton />
              <Button
                onClick={() => setConfirmSignout(true)}
                variant="ghost"
                className="text-sm font-medium text-muted-foreground hover:text-primary hover:bg-transparent"
              >
                Sign Out
              </Button>
              <Link href="/dashboard">
                <Button className="text-sm font-medium bg-primary hover:bg-primary/80  shadow-lg shadow-green-900/25">
                  Dashboard
                </Button>
              </Link>
            </div>
            <div className="flex md:hidden gap-2 items-center">
              <ChangeThemeButton />
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-muted-foreground p-0 hover:text-primary" />
                    <NavigationMenuContent>
                      <Button
                        onClick={() => setConfirmSignout(true)}
                        variant="ghost"
                        className="text-sm font-medium text-muted-foreground hover:text-primary hover:bg-transparent"
                      >
                        Sign Out
                      </Button>
                      <Link href="/dashboard">
                        <NavigationMenuLink>
                          <Button className="text-sm font-medium bg-primary hover:bg-primary/80  shadow-lg shadow-green-900/25">
                            Dashboard
                          </Button>
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </>
        ) : (
          <>
            <div className="hidden md:flex md:items-center">
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
                <ChangeThemeButton />
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
            </div>
            <div className="flex md:hidden gap-2 items-center">
              <ChangeThemeButton />
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-muted-foreground p-0 hover:text-primary" />
                    <NavigationMenuContent className="flex flex-col justify-center items-center">
                      <Link className="text-muted-foreground hover:text-primary transition-colors text-sm p-2" href="#about">
                        About
                      </Link>
                      <Link className="text-muted-foreground hover:text-primary transition-colors text-sm p-2" href="#solutions">
                        Solutions
                      </Link>
                      <Link className="text-muted-foreground hover:text-primary transition-colors text-sm p-2" href="#contact">
                        Contact
                      </Link>
                      <Link href="/auth/login">
                        <Button variant="ghost" className="text-sm font-medium text-muted-foreground hover:text-primary hover:bg-transparent">
                          Sign In
                        </Button>
                      </Link>
                      <Link href="/auth/register">
                        <Button className="text-sm font-medium bg-primary hover:bg-primary/80 shadow-lg shadow-green-900/25">
                          Sign Up
                        </Button>
                      </Link>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </>
        )}
      </div>
      {user && (
        <h2 className="md:hidden flex justify-center text-xl py-3 font-medium text-center">{`Hello, ${first_name} ${last_name}!`}</h2>
      )}
      <AlertDialog open={confirmSignout} onOpenChange={setConfirmSignout}>
        <AlertDialogContent className=" border-none rounded-md  w-fit">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Sign Out</AlertDialogTitle>
            <X size={20} className='absolute top-3 right-4 cursor-pointer m-0' onClick={() => {
              setConfirmSignout(false);
            }} />
            <AlertDialogDescription>
              <p className="text-sm text-muted-foreground-400">Are you sure you want to sign out?</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className='flex gap-4 mt-4'>
            <Button
              onClick={() => setConfirmSignout(false)}
              className="bg-muted border-muted-foreground/20 border-2 py-6 px-16 hover:bg-muted-foreground/20"
              variant={'secondary'}
            >
              Cancel
            </Button>
            <Button
              disabled={isSigningOut}
              onClick={async () => {
                setSigningOut(true);
                await createClient().auth.signOut();
                router.push('/auth/login');
                router.push('/');
                setSigningOut(false);
                setConfirmSignout(false);
              }}
              className="px-16 w-40 py-6 bg-destructive hover:bg-destructive/80 border-destructive border-2"
            >
              {isSigningOut ? 'Signin Out...' : 'Sign Out'}
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  )
}
export default Header