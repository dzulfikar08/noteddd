import { addNote, getNotes } from '@/lib/actions'
import { getToken } from 'next-auth/jwt';


import { NextRequest, NextResponse } from 'next/server'

export const runtime ='edge'


/** GET: Fetch all experiences */
export const GET = async (req: NextRequest) => {
    try {
      // middleware(NextRequest, NextResponse, () => {})
      const session = await getToken({ req , secret: process.env.AUTH_SECRET, secureCookie: true});
      if (!session) 
        return NextResponse.json({message: "You must be logged in.", data:session}, {status: 401});
      const userId = session.sub ?? ''

      const res = await getNotes(userId)
      return NextResponse.json(res, { status: 200 })
    } catch (error: any) {
      return NextResponse.json({ error: 'Failed to fetch notes', message: error.message }, { status: 500 })
    }
  }

  export const POST = async(req: NextRequest) => {
    try {
      const session = await getToken({ req , secret: process.env.AUTH_SECRET, secureCookie: true});
      if (!session) 
        return NextResponse.json({message: "You must be logged in.", data:session}, {status: 401});
      const userId = session.sub ?? ''
      const requestBody: any = await req.json()
      const title: string = requestBody?.title
      const sync: boolean = requestBody?.sync
      const response = await addNote(title, userId, sync)
      return NextResponse.json({ success:true, data:response }, { status: 200 })
  
  
    } catch (error: any) {
      return NextResponse.json({ error: 'Failed to add habits', message: error.message }, { status: 500 })
      
    }
  }


  
  