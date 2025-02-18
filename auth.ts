import { D1Adapter } from "@auth/d1-adapter"
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
 
export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [ 
    Google({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    allowDangerousEmailAccountLinking: true
  }) 
  ],
  secret:process.env.AUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  experimental: {
  enableWebAuthn: true
  },
  pages: {
    signIn: '/login',
    error: '/login',
    verifyRequest: '/login'
  },
  adapter: D1Adapter(process.env.DB! as unknown as D1Database),
  
})