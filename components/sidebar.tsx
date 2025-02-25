"use client"

import type React from "react"

import { useEffect, useState, useCallback } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash, MoreVertical, Pencil } from "lucide-react"
import type { notes } from "@/lib/db/schema"
import type { InferSelectModel } from "drizzle-orm"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Sidebar as SidebarComponent, SidebarHeader, SidebarContent, useSidebar } from "@/components/ui/sidebar"

import useSWR from "swr"

import { useRouter } from "next/navigation"
import { signIn } from "@/auth"
import toast from "react-hot-toast"
import { Checkbox } from "./ui/checkbox"

type Note = InferSelectModel<typeof notes>

export function Sidebar() {
  const router = useRouter()

  const fetcher = useCallback(async (url: string) => {
    const res = await fetch(url)
    if (res.status === 401) {
      throw new Error("Unauthorized")

    }
    if (!res.ok) {
      throw new Error("Failed to fetch todos")
    }
    return await res.json() as Note[]
  }, [])

  const { data: notesA, error, mutate } = useSWR("/api/notes", fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    onError: (error) => {
      if (error.message === 'Unauthorized') {
        router.push("/")
        toast.error("Unauthorized")
    }
    }
  } 
)

  const notes = notesA ? [...notesA].sort((a, b) => b.id - a.id) : []

  const [editNoteTitle, setEditNoteTitle] = useState("")
  const [newNoteTitle, setNewNoteTitle] = useState(new Date().toISOString().split("T")[0])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [isSync, setIsSync] = useState(false)
  const [initialized, setInitialized] = useState(false); // Track first load





  if (!notes) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin h-5 w-5 border-b-2 border-primary rounded-full"></div>
      </div>
    )
  }


  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNoteTitle.trim()) return
    try {
      await fetch("/api/notes", {
        method: "POST",
        body: JSON.stringify({ title: newNoteTitle, sync: isSync  }),
      })
      setNewNoteTitle("")
      toast( "Note added")
      setIsDialogOpen(false)
      mutate()
      window.dispatchEvent(new CustomEvent("select-note", { detail: notes[0] }));
    } catch (error) {
      toast("Failed to add note. Please try again.")
    }
  }

  const handleEditNote = (note: Note) => {
    setIsEditDialogOpen(true)
    setEditingNote(note)
    setEditNoteTitle(note.title)
  }

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingNote) return
    try {
      await fetch(`/api/notes/${editingNote.id}`, {
        method: "PUT",
        body: JSON.stringify({ title: editNoteTitle }),
      })
      setEditNoteTitle("")
      setIsEditDialogOpen(false)
      toast.success("Note updated")
      mutate()
      window.dispatchEvent(new CustomEvent("select-note", { detail: editingNote }));
    } catch (error) {
      toast.error("Failed to update note. Please try again.")
    }
  }

  const handleDeleteNote = async (note: Note) => {
    try {
      await fetch(`/api/notes/${note.id}`, {
        method: "DELETE",
      })
      toast.success("Note deleted",)
      mutate()
      window.dispatchEvent(new CustomEvent("select-note", { detail: notes[0] }));
    } catch (error) {
      toast.error( "Failed to delete note. Please try again.")
    }
  }

  const {setOpenMobile, isMobile} =useSidebar()

  function handleClick(note: object) {
    if (note) {
      window.dispatchEvent(new CustomEvent("select-note", { detail: note }));
      if (isMobile) setOpenMobile(false);
    }
  }
  
  useEffect(() => {
    if (!initialized && notes && notes.length > 0) {
      window.dispatchEvent(new CustomEvent("select-note", { detail: notes[0] }));
      setInitialized(true); // Mark as initialized to prevent re-running
    }
  }, [notes, initialized]);

  return (
    <SidebarComponent className="top-14">
      <SidebarHeader className="flex h-14 items-center justify-between border-b px-4">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Plus className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New List</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddNote}>
              <div className="grid gap-4 py-4">
                <Input
                  placeholder="List title..."
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                />
              <div className="flex items-center space-x-2">
              <Checkbox
                id="sync"
                checked={Boolean(isSync)}
                onCheckedChange={(checked) => setIsSync(checked === 'indeterminate' ? false : checked)}
              />
                <label htmlFor="sync" className="text-sm text-muted-foreground">
                  Sync with previous uncompleted note?
                </label>
              </div>
              </div>
              <DialogFooter>
                <Button type="submit">Create</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit List</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveEdit}>
              <div className="grid gap-4 py-4">
                <Input
                  placeholder="List title..."
                  value={editNoteTitle}
                  onChange={(e) => setEditNoteTitle(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="h-[calc(100vh-7rem)]">
          <div className="p-2">
            {notes.map((note) => (
              <div key={note.id} className="flex items-center mb-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {handleClick(note)}}
                >
                  {note.title}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="ml-auto">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteNote(note)}>
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text" onClick={() => handleEditNote(note)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </ScrollArea>
      </SidebarContent>
    </SidebarComponent>
  )
}

