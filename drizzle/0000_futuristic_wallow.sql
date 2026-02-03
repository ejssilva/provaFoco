CREATE TABLE `ads` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`placement` text NOT NULL,
	`adCode` text NOT NULL,
	`isActive` integer DEFAULT true,
	`priority` integer DEFAULT 0,
	`startDate` integer,
	`endDate` integer,
	`createdAt` integer DEFAULT '"2026-02-02T19:14:45.025Z"' NOT NULL,
	`updatedAt` integer DEFAULT '"2026-02-02T19:14:45.025Z"' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `banks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`logo` text,
	`isActive` integer DEFAULT true,
	`createdAt` integer DEFAULT '"2026-02-02T19:14:45.024Z"' NOT NULL,
	`updatedAt` integer DEFAULT '"2026-02-02T19:14:45.024Z"' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `banks_name_unique` ON `banks` (`name`);--> statement-breakpoint
CREATE TABLE `categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`icon` text,
	`color` text,
	`order` integer DEFAULT 0,
	`isActive` integer DEFAULT true,
	`createdAt` integer DEFAULT '"2026-02-02T19:14:45.023Z"' NOT NULL,
	`updatedAt` integer DEFAULT '"2026-02-02T19:14:45.024Z"' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_name_unique` ON `categories` (`name`);--> statement-breakpoint
CREATE TABLE `difficulty_levels` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`level` integer NOT NULL,
	`color` text,
	`description` text,
	`createdAt` integer DEFAULT '"2026-02-02T19:14:45.024Z"' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `difficulty_levels_name_unique` ON `difficulty_levels` (`name`);--> statement-breakpoint
CREATE TABLE `questions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`categoryId` integer,
	`bankId` integer,
	`difficultyId` integer,
	`category` text,
	`bank` text,
	`difficulty` text,
	`year` text,
	`questionText` text NOT NULL,
	`alternatives` text NOT NULL,
	`correctAnswer` text NOT NULL,
	`explanation` text,
	`source` text,
	`isActive` integer DEFAULT true,
	`generatedByLLM` integer DEFAULT false,
	`createdAt` integer DEFAULT '"2026-02-02T19:14:45.024Z"' NOT NULL,
	`updatedAt` integer DEFAULT '"2026-02-02T19:14:45.024Z"' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `seo_metadata` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`path` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`keywords` text,
	`ogImage` text,
	`ogTitle` text,
	`ogDescription` text,
	`canonicalUrl` text,
	`createdAt` integer DEFAULT '"2026-02-02T19:14:45.025Z"' NOT NULL,
	`updatedAt` integer DEFAULT '"2026-02-02T19:14:45.025Z"' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `seo_metadata_path_unique` ON `seo_metadata` (`path`);--> statement-breakpoint
CREATE TABLE `simulados` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer NOT NULL,
	`name` text NOT NULL,
	`categoryId` integer,
	`bankId` integer,
	`totalQuestions` integer NOT NULL,
	`totalCorrect` integer DEFAULT 0,
	`accuracy` integer DEFAULT 0,
	`timeLimit` integer,
	`timeSpent` integer,
	`status` text DEFAULT 'in_progress',
	`startedAt` integer DEFAULT '"2026-02-02T19:14:45.025Z"' NOT NULL,
	`completedAt` integer,
	`createdAt` integer DEFAULT '"2026-02-02T19:14:45.025Z"' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user_answers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer NOT NULL,
	`questionId` integer NOT NULL,
	`selectedAnswer` text NOT NULL,
	`isCorrect` integer NOT NULL,
	`timeSpent` integer,
	`attemptNumber` integer DEFAULT 1,
	`createdAt` integer DEFAULT '"2026-02-02T19:14:45.024Z"' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user_category_stats` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer NOT NULL,
	`categoryId` integer NOT NULL,
	`totalAnswered` integer DEFAULT 0,
	`totalCorrect` integer DEFAULT 0,
	`accuracy` integer DEFAULT 0,
	`lastAnsweredAt` integer,
	`createdAt` integer DEFAULT '"2026-02-02T19:14:45.025Z"' NOT NULL,
	`updatedAt` integer DEFAULT '"2026-02-02T19:14:45.025Z"' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_category_stats_unique` ON `user_category_stats` (`userId`,`categoryId`);--> statement-breakpoint
CREATE TABLE `user_stats` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer NOT NULL,
	`totalAnswered` integer DEFAULT 0,
	`totalCorrect` integer DEFAULT 0,
	`totalIncorrect` integer DEFAULT 0,
	`accuracy` integer DEFAULT 0,
	`currentStreak` integer DEFAULT 0,
	`bestStreak` integer DEFAULT 0,
	`totalTimeSpent` integer DEFAULT 0,
	`lastActivityAt` integer,
	`createdAt` integer DEFAULT '"2026-02-02T19:14:45.025Z"' NOT NULL,
	`updatedAt` integer DEFAULT '"2026-02-02T19:14:45.025Z"' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_stats_userId_unique` ON `user_stats` (`userId`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`openId` text NOT NULL,
	`name` text,
	`email` text,
	`loginMethod` text,
	`role` text DEFAULT 'user' NOT NULL,
	`createdAt` integer DEFAULT '"2026-02-02T19:14:45.023Z"' NOT NULL,
	`updatedAt` integer DEFAULT '"2026-02-02T19:14:45.023Z"' NOT NULL,
	`lastSignedIn` integer DEFAULT '"2026-02-02T19:14:45.023Z"' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_openId_unique` ON `users` (`openId`);