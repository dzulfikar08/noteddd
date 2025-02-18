"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { MoonIcon, SunIcon, User } from "lucide-react"
import { useTheme } from "next-themes"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast, useToast } from "@/components/ui/use-toast"
import { signIn, signOut, useSession } from "next-auth/react"

export function TopBar() {
  const { setTheme, theme } = useTheme()
  const { toast } = useToast()
  const session = useSession()
  console.log(session)
  const [isLoggedIn, setIsLoggedIn] = useState(session.status === "authenticated")




  const handleLogin = () => {
    signIn("google", { callbackUrl: "/api/auth/signin/callback" })

    if (session) {
      setIsLoggedIn(true)
      toast({
        title: "Logged in successfully",
        description: `Welcome, ${session.data?.user?.name}!`,
      })

    }
  }

  

  const handleLogout = () => {
    signOut({ callbackUrl: "/app" })
    setIsLoggedIn(false)
    toast({
      title: "Logged out successfully",
      description: "You have been logged out.",
    })
  }

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b bg-background px-4">
      <div className="flex items-center">
        <SidebarTrigger />
        <h1 className="ml-2 text-lg font-semibold">Noteddd 🙏🏻</h1>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            {session?.data?.user?.image ? (
              <img
                src={session.data.user.image}
                alt={'profile'}
                className="h-5 w-5 rounded-full"
              />
            ) : <User className="h-5 w-5" />}
            
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-36 flex flex-col">
          {session?.data?.user ? (
            <>
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </>
          ) : (
              <Button onClick={() => handleLogin()}>Google Sign In</Button>
          )}
          <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? (
              <>
                <SunIcon className="mr-2 h-4 w-4" />
                <span>Light mode</span>
              </>
            ) : (
              <>
                <MoonIcon className="mr-2 h-4 w-4" />
                <span>Dark mode</span>
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}

