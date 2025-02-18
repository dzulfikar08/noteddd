import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"

export const notes = sqliteTable("notes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
  createdBy: text("created_by").notNull().default("unknown"),

})

export const todos = sqliteTable("todos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  content: text("content").notNull(),
  completed: integer("completed", { mode: "boolean" }).notNull().default(false),
  noteId: integer("note_id").notNull(),
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
  createdBy: text("created_by").notNull().default("unknown"),
})


// Users Table
export const usersTable = sqliteTable('users', {
  id: text('id').primaryKey(), // Aligning with NextAuth's string-based IDs
  name: text('name'),
  email: text('email').unique(),
  emailVerified: text('emailVerified'),
  image: text('image'),
});

// Accounts Table (OAuth Providers)
export const accountsTable = sqliteTable('accounts', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().references(() => usersTable.id),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('providerAccountId').notNull(),
  refreshToken: text('refresh_token'),
  accessToken: text('access_token'),
  expiresAt: integer('expires_at'),
  tokenType: text('token_type'),
  scope: text('scope'),
  idToken: text('id_token'),
  sessionState: text('session_state'),
  oauthTokenSecret: text('oauth_token_secret'),
  oauthToken: text('oauth_token'),
});

// Sessions Table
export const sessionsTable = sqliteTable('sessions', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId').notNull().references(() => usersTable.id),
  expires: text('expires').notNull(),
});

// Verification Tokens Table
export const verificationTokensTable = sqliteTable('verification_tokens', {
  identifier: text('identifier').primaryKey(),
  token: text('token').notNull(),
  expires: text('expires').notNull(),
});
