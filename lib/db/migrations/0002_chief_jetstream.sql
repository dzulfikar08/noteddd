PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_notes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`created_at` text DEFAULT '2025-02-18T15:49:21.974Z' NOT NULL,
	`created_by` text DEFAULT 'unknown' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_notes`("id", "title", "created_at", "created_by") SELECT "id", "title", "created_at", "created_by" FROM `notes`;--> statement-breakpoint
DROP TABLE `notes`;--> statement-breakpoint
ALTER TABLE `__new_notes` RENAME TO `notes`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_todos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`content` text NOT NULL,
	`completed` integer DEFAULT false NOT NULL,
	`note_id` integer NOT NULL,
	`created_at` text DEFAULT '2025-02-18T15:49:21.975Z' NOT NULL,
	`created_by` text DEFAULT 'unknown' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_todos`("id", "content", "completed", "note_id", "created_at", "created_by") SELECT "id", "content", "completed", "note_id", "created_at", "created_by" FROM `todos`;--> statement-breakpoint
DROP TABLE `todos`;--> statement-breakpoint
ALTER TABLE `__new_todos` RENAME TO `todos`;