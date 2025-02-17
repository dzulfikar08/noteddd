"use server"

import { db } from "@/lib/db"
import { notes, todos } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

// if (!db.$client || typeof db.$client.prepare !== 'function') {
//   throw new Error('Client is not properly initialized');
// }

export async function getNotes() {
  return await db.select().from(notes).orderBy(notes.createdAt)
}

export async function getTodos(noteId: number) {
  return await db.select().from(todos).where(eq(todos.noteId, noteId)).orderBy(todos.createdAt)
}

export async function addNote(title: string) {
  revalidatePath("/")
  return  await db.insert(notes).values({ title })
}

export async function deleteNote(id: number) {
  revalidatePath("/")
  return await db.delete(notes).where(eq(notes.id, id))
}
export async function editNote(id: number, title: string) {
  revalidatePath("/")
  return await db.update(notes).set({ title }).where(eq(notes.id, id)).returning()
}

export async function addTodo(noteId: number, content: string) {
  revalidatePath("/")
  return await db.insert(todos).values({
    content,
    noteId,
    completed: false,
  }).returning()
}

export async function updateTodo(id: number, data: { content?: string; completed?: boolean }) {
  revalidatePath("/")
  return await db.update(todos).set(data).where(eq(todos.id, id))
}

export async function deleteTodo(id: number) {
  revalidatePath("/")
  return await db.delete(todos).where(eq(todos.id, id))
}

