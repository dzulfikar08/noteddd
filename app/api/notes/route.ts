import { addNote, getNotes } from '@/lib/actions'


import { NextRequest, NextResponse } from 'next/server'

export const runtime ='edge'


/** GET: Fetch all experiences */
export const GET = async () => {
    try {
      // middleware(NextRequest, NextResponse, () => {})
      const res = await getNotes()
      return NextResponse.json(res, { status: 200 })
    } catch (error: any) {
      return NextResponse.json({ error: 'Failed to fetch notes', message: error.message }, { status: 500 })
    }
  }

  export const POST = async(req: NextRequest) => {
    try {
      const requestBody: any = await req.json()
      const title: string = requestBody?.title
      const response = await addNote(title)
      return NextResponse.json({ success:true, data:response }, { status: 200 })
  
  
    } catch (error) {
      return NextResponse.json({ error: 'Failed to add habits' }, { status: 500 })
      
    }
  }


  
  