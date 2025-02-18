import { signInGoogle } from '@/lib/db/signInGoogleService';

import { NextRequest, NextResponse } from 'next/server'

import { getToken } from "next-auth/jwt"


export const runtime ='edge'


/** POST: Add a new experience */
  export const POST = async (req: NextRequest) => {
    try {
      const userId = await getToken({ req, secret: process.env.AUTH_SECRET, secureCookie: true })

      console.log(userId)

      const body = await req.json() as {
        name: string;
        email: string;
        image: string;
        expires: Date;
      };
      const token = await signInGoogle(userId?.sub ?? '')
  
      if (!token) {
        return NextResponse.json({ success: false, message: 'You are not authorized', data: userId }, { status: 401 })
      }
      
      return NextResponse.json({success: true, message: 'Success Login', data: {name: body.name, token}}, { status: 201 })
    } catch (error: any) {
      console.error(error)
      return NextResponse.json({ error: 'Invalid request', message: error.message }, { status: 400 })
    }
  }
