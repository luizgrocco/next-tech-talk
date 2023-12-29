CREATE TABLE `todos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`done` integer DEFAULT false NOT NULL,
	`text` text DEFAULT 'medium' NOT NULL,
	`createdAt` text DEFAULT CURRENT_TIMESTAMP
);
