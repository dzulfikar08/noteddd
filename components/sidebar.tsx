"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash, MoreVertical, Pencil } from "lucide-react"
import type { notes } from "@/lib/db/schema"
import type { InferSelectModel } from "drizzle-orm"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Sidebar as SidebarComponent, SidebarHeader, SidebarContent } from "@/components/ui/sidebar"
import { useToast } from "@/components/ui/use-toast"

import { useRouter } from "next/navigation";

type Note = InferSelectModel<typeof notes>

export function Sidebar() {
  const [notes, setNotes] = useState<Note[]>([])
  const router = useRouter()
  const [editNoteTitle, setEditNoteTitle] = useState("")
  const [newNoteTitle, setNewNoteTitle] = useState(new Date().toISOString().split("T")[0])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const { toast } = useToast()

  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    try {
      const res = await fetch("/api/notes");
      if (!res.ok) throw new Error("Failed to fetch notes");
      const data = await res.json() as { id: number; title: string; createdAt: string }[];
      setNotes(data.sort((a, b) => b.id - a.id));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchNotes();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin h-5 w-5 border-b-2 border-primary rounded-full"></div>
      </div>
    );
  }

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNoteTitle.trim()) return
    try {
      await fetch("/api/notes", {
        method: "POST",
        body: JSON.stringify({ title: newNoteTitle }),
      })
      // addNote(newNoteTitle)
      setNewNoteTitle("")
      toast({
        title: "Note added",
        description: `"${newNoteTitle}" has been added to your notes.`,
      })
      setIsDialogOpen(false)
      fetchNotes()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add note. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditNote = async (note: Note) => {
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
      // editNote(editingNote.id, editNoteTitle)
      setEditNoteTitle("")
      setIsEditDialogOpen(false)
      toast({
        title: "Note updated",
        description: `"${editNoteTitle}" has been updated.`,
      })
      fetchNotes()

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update note. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteNote = async (note: Note) => {
    try {
      await fetch(`/api/notes/${note.id}`, {
        method: "DELETE",
      })
      // deleteNote(note.id)
      toast({
        title: "Note deleted",
        description: `"${note.title}" has been deleted.`,
      })
      fetchNotes()

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete note. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <SidebarComponent className="top-14">
      <SidebarHeader className="flex h-14 items-center justify-between border-b px-4">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild >
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
                  value={  editNoteTitle }
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
                  onClick={() => window.dispatchEvent(new CustomEvent("select-note", { detail: note }))}
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

