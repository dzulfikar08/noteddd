"use client"

import { useRouter } from "next/navigation"
import { getSession } from "next-auth/react"
import toast from "react-hot-toast"


export default async function Callback()  {

    const router = useRouter()
    const updatedSession = await getSession() // Ensure session is updated
    console.log({updatedSession})

    if (updatedSession && updatedSession.user) {
        console.log({newupdatedSession: updatedSession})

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
            
            toast.success("You have successfully logged in")

            localStorage.setItem("username", data.data.name) // Keeping only username in localStorage for now

            router.push("/app")
        } else {
            let errorMessage = "Something went wrong"
            try {
                const error: { message: string } = await response.json()
                errorMessage = error.message
            } catch {
                errorMessage = "Unexpected error occurred"
            }

            toast.error(errorMessage)
            router.push("/")
        }
    }
}