"use client"; // 👈 Ensure it's a client component

import { signIn } from "next-auth/react"; // ✅ Correct import
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

export default function Home() {


    const handleSignIn = async () => {
      try {
  
          await signIn("google", { callbackUrl: "/app" })
        
          return toast.success("Redirecting ...")
          
      } catch (error: any) {
          // toast({
          //     title: "Error",
          //     description: `Error while trying to login, ${String(error.message)}`,
          //     variant: "destructive",
          // })
          toast.error(`Error while trying to login, ${String(error.message)}`)
      }
  }
  
  return (
    <div className="flex flex-col items-center gap-2">
      <Card>
        <CardHeader>
          <Label style={{ fontSize: "32px" }}>Welcome!</Label>
        </CardHeader>
        <CardContent>
          <Button onClick={() => handleSignIn()}>
            Go to the App
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
