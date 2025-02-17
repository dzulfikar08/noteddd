import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { TopBar } from "@/components/top-bar"

const inter = Inter({ subsets: ["latin"] })
export const metadata = {
  title: "Noteddd 🙏🏻",
  description: "Actually note what your boss said to you",
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
    other: "/android-chrome-192x192.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

