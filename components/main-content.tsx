"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Pencil, Trash, X, Check, RefreshCw } from "lucide-react"
import type { notes, todos } from "@/lib/db/schema"
import type { InferSelectModel } from "drizzle-orm"
import { SidebarInset } from "@/components/ui/sidebar"
import useSWR from "swr"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Dialog, DialogClose, DialogTrigger } from "./ui/dialog"
import { DialogContent, DialogDescription, DialogTitle } from "@radix-ui/react-dialog"

type Note = InferSelectModel<typeof notes>
type Todo = InferSelectModel<typeof todos>



export function MainContent({ defaultNote }: { defaultNote?: Note }) {
  const router = useRouter()
  const [currentNote, setCurrentNote] = useState<Note | undefined>(defaultNote)



  useEffect(() => {
    const handleSelectNote = (e: CustomEvent<Note>) => {
      setCurrentNote(e.detail)
    }
    window.addEventListener("select-note", handleSelectNote as EventListener)
    return () => window.removeEventListener("select-note", handleSelectNote as EventListener)
  }, [])

  const fetcher = async (url: string) => {
    const res = await fetch(url);
    if(res.status === 401) {
      throw new Error("Unauthorized")
    }
    if (!res.ok) throw new Error("Failed to fetch todos");
    return await res.json() as Todo[];
  };
  const { data: todos, error, mutate } = useSWR<Todo[]>(currentNote ? `/api/todos/${currentNote.id}` : null, fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    onError: (error) => {
      if (error.message === 'Unauthorized') {
        router.push("/")
      }
    }
  });


  useEffect(() => {
    if (currentNote) {
      mutate();
    }
  }, [currentNote, mutate]);

  // const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState("")
  const [editingTodo, setEditingTodo] = useState<{ id: number; content: string } | null>(null)
  const [loading, setLoading] = useState(true);





  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodo.trim() || !currentNote) return
    await fetch(`/api/todos/${currentNote.id}`, {
      method: "POST",
      body: JSON.stringify({ content: newTodo }),
    })
    // addTodo(currentNote.id, newTodo)
    setNewTodo("")
    // setTodos(await getTodos(currentNote.id))
    mutate()

  }

  const handleUpdateTodo = async (id: number, data: { content?: string; completed?: boolean }) => {
    await fetch(`/api/todos/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
    // await updateTodo(id, data)
    if (currentNote) {
      mutate()
    }
    setEditingTodo(null)
  }

  const handleDeleteTodo = async (id: number) => {
    await fetch(`/api/todos/${id}`, {
      method: "DELETE",
    })
    // await deleteTodo(id)
    if (currentNote) {
      mutate()

      // setTodos(await getTodos(currentNote.id))
    }
  }

  // const handleSync = async () => {
  //   await fetch('/api/todos/sync', {
  //     method: "POST",
  //   })
  //   mutate()
  // }

  if (!currentNote) {
    return (
      <div></div>
      // <SidebarInset>
      //         <div className="flex items-center h-14 border-b bg-background px-4">
      //   <h1 className="text-lg p-0 font-semibold">Select a list</h1>
      // </div>
      // </SidebarInset>
    )
  }

  return (
    <SidebarInset>
      <div className="flex items-center h-14 border-b bg-background px-4">
        <h1 className="text-lg p-0 font-semibold">{currentNote.title}</h1>
      </div>
      <div className="p-4">
        <form onSubmit={handleAddTodo} className="mb-4 flex gap-2">
          <Input
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add new task..."
            className="max-w-sm"
          />
          <Button type="submit" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
          {/* <Dialog>
            <DialogTrigger asChild>
              <Button>
                <RefreshCw className="h-4 w-4" /> Sync
              </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle className="text-lg font-semibold">
                  Sync todos?
                </DialogTitle>
                <DialogDescription className="mt-2 text-sm text-muted-foreground">
                  Are you sure you want to sync uncompleted todos from previous note?
                </DialogDescription>
                <div className="mt-4 flex justify-end gap-2">
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button onClick={() => handleSync()}>Sync</Button>
                </div>
              </DialogContent>
          </Dialog> */}
        </form>
        <div className="space-y-2">
          {Array.isArray(todos) && todos.map((todo) => (
            <div key={todo.id} className="flex items-center justify-center h-12 gap-2 group border-b-2">
              <Checkbox className="h-8 w-8" 
                checked={todo.completed}
                onCheckedChange={(checked) => {
                  handleUpdateTodo(todo.id, { completed: checked as boolean })
                }}
              />
              {editingTodo?.id === todo.id ? (
                <div className="flex flex-1 items-center gap-2">
                  <Input
                    value={editingTodo.content}
                    onChange={(e) => setEditingTodo({ ...editingTodo, content: e.target.value })}
                    className="h-12"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleUpdateTodo(todo.id, { content: editingTodo.content })}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => setEditingTodo(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <span className={todo.completed ? "flex-1 text-muted-foreground line-through" : "flex-1"}
                  onClick={() => handleUpdateTodo(todo.id, { completed: !todo.completed })}>
                    {todo.content}
                  </span>
                  <div className="hidden group-hover:flex p items-center gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setEditingTodo({ id: todo.id, content: todo.content })}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDeleteTodo(todo.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </SidebarInset>
  )
}

