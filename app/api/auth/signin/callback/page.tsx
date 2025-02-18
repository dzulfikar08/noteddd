"use client"
import { useAuth } from "@/app/contexts/AuthContext"
import { useRouter } from "next/navigation"

import { useToast } from "@/hooks/use-toast"
import { getSession } from "next-auth/react"
import toast from "react-hot-toast"


export default async function Callback()  {
      const { login } = useAuth()

      const router = useRouter()
    const updatedSession = await getSession() // Ensure session is updated

    if (updatedSession && updatedSession.user) {
        const response = await fetch("/api/auth/signin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: updatedSession.user.email,
                name: updatedSession.user.name,
                image: updatedSession.user.image,
                expires: updatedSession.expires,
            }),
        })

        if (response.ok) {
            const data: { data: { name: string; token: string } } = await response.json()
            
            // // Store token securely instead of localStorage (preferably use cookies)
            // document.cookie = `token=${data.data.token}; path=/; secure; HttpOnly;`
            
            // toast({
            //     title: "Login Successful",
            //     description: "You have successfully logged in",
            //     variant: "default"
            // })
            toast.success("You have successfully logged in")

            localStorage.setItem("username", data.data.name) // Keeping only username in localStorage for now
            login(data.data.token)
            router.push("/")
        } else {
            let errorMessage = "Something went wrong"
            try {
                const error: { message: string } = await response.json()
                errorMessage = error.message
            } catch {
                errorMessage = "Unexpected error occurred"
            }

            // toast({
            //     title: "Login Failed",
            //     description: errorMessage,
            //     variant: "destructive"
            // })
            toast.error(errorMessage)
            router.push("/login")
        }
    }
}