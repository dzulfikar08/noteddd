import { addNote, deleteNote, editNote, getNotes } from '@/lib/actions'
import { NextRequest, NextResponse } from 'next/server'
export const runtime ='edge'

export const PUT = async (req: NextRequest, { params }: { params: Promise<{ id:number }> }) => {
    try {
      
      const body = await req.json() as { title: string }
      const id = (await params).id
      const title = body?.title

  
      if (!id) {
        return NextResponse.json({ error: 'ID is required' }, { status: 400 })
      }
  
      const updatedHabit = await editNote(id, title)
  
  
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
  
      const deletedExperience = await deleteNote(id)
  
      return NextResponse.json({ message: 'Experience deleted successfully' }, { status: 200 })
    } catch (error) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }
  }