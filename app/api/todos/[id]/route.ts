import { addTodo, deleteTodo, getTodos, updateTodo } from '@/lib/actions'
import { getToken } from 'next-auth/jwt';


import { NextRequest, NextResponse } from 'next/server'

export const runtime ='edge'


/** GET: Fetch all experiences */
export const GET = async (req: NextRequest, { params }: { params: Promise<{ id:number }> }) => {
    try {
      const session = await getToken({ req , secret: process.env.AUTH_SECRET, secureCookie: true});
            if (!session) 
              return NextResponse.json({message: "You must be logged in."}, {status: 401});
            const userId = session.sub ?? ''
      const id = (await params).id
      const res = await getTodos(id, userId)
      return NextResponse.json(res, { status: 200 })
    } catch (error: any) {
      return NextResponse.json({ error: 'Failed to fetch todos', message: error.message }, { status: 500 })
    }
  }

  export const POST = async (req: NextRequest, { params }: { params: Promise<{ id:number }> }) => {
      try {
        
        const body = await req.json() as { content: string }
        const id = (await params).id
        const content = body?.content
  
    
        if (!id) {
          return NextResponse.json({ error: 'ID is required' }, { status: 400 })
        }
    
        const updatedHabit = await addTodo(id, content)
    
    
        return NextResponse.json(updatedHabit, { status: 200 })
      } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
      }
    }

    export const PUT = async (req: NextRequest, { params }: { params: Promise<{ id:number }> }) => {
        try {
          
          const body = await req.json() as { content: string, completed: boolean }
          const id = (await params).id
    
      
          if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 })
          }
      
          const updatedHabit = await updateTodo(id, body)
      
      
          return NextResponse.json(updatedHabit, { status: 200 })
        } catch (error) {
          return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
        }
      }
      export const DELETE = async (req: NextRequest, { params }: { params: Promise<{ id:number }> }) => {
        try {
          const id = (await params).id
    
      
          if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 })
          }
      
          const deletedExperience = await deleteTodo(id)
      
          return NextResponse.json({ message: 'Experience deleted successfully' }, { status: 200 })
        } catch (error) {
          return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
        }
      }