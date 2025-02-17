import { addTodo, deleteTodo, getTodos, updateTodo } from '@/lib/actions'


import { NextRequest, NextResponse } from 'next/server'

export const runtime ='edge'


/** GET: Fetch all experiences */
export const GET = async (req: NextRequest, { params }: { params: Promise<{ id:number }> }) => {
    try {
      const id = (await params).id
      const res = await getTodos(id)
      return NextResponse.json(res, { status: 200 })
    } catch (error) {
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
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