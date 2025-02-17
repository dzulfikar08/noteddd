import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"

export const notes = sqliteTable("notes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
})

export const todos = sqliteTable("todos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  content: text("content").notNull(),
  completed: integer("completed", { mode: "boolean" }).notNull().default(false),
  noteId: integer("note_id").notNull(),
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
})

