PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_ads` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`placement` text NOT NULL,
	`adCode` text NOT NULL,
	`isActive` integer DEFAULT true,
	`priority` integer DEFAULT 0,
	`startDate` integer,
	`endDate` integer,
	`createdAt` integer DEFAULT '"2026-02-03T16:52:13.371Z"' NOT NULL,
	`updatedAt` integer DEFAULT '"2026-02-03T16:52:13.371Z"' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_ads`("id", "name", "placement", "adCode", "isActive", "priority", "startDate", "endDate", "createdAt", "updatedAt") SELECT "id", "name", "placement", "adCode", "isActive", "priority", "startDate", "endDate", "createdAt", "updatedAt" FROM `ads`;--> statement-breakpoint
DROP TABLE `ads`;--> statement-breakpoint
ALTER TABLE `__new_ads` RENAME TO `ads`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_banks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`logo` text,
	`isActive` integer DEFAULT true,
	`createdAt` integer DEFAULT '"2026-02-03T16:52:13.370Z"' NOT NULL,
	`updatedAt` integer DEFAULT '"2026-02-03T16:52:13.370Z"' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_banks`("id", "name", "description", "logo", "isActive", "createdAt", "updatedAt") SELECT "id", "name", "description", "logo", "isActive", "createdAt", "updatedAt" FROM `banks`;--> statement-breakpoint
DROP TABLE `banks`;--> statement-breakpoint
ALTER TABLE `__new_banks` RENAME TO `banks`;--> statement-breakpoint
CREATE UNIQUE INDEX `banks_name_unique` ON `banks` (`name`);--> statement-breakpoint
CREATE TABLE `__new_categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`icon` text,
	`color` text,
	`order` integer DEFAULT 0,
	`isActive` integer DEFAULT true,
	`createdAt` integer DEFAULT '"2026-02-03T16:52:13.369Z"' NOT NULL,
	`updatedAt` integer DEFAULT '"2026-02-03T16:52:13.369Z"' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_categories`("id", "name", "description", "icon", "color", "order", "isActive", "createdAt", "updatedAt") SELECT "id", "name", "description", "icon", "color", "order", "isActive", "createdAt", "updatedAt" FROM `categories`;--> statement-breakpoint
DROP TABLE `categories`;--> statement-breakpoint
ALTER TABLE `__new_categories` RENAME TO `categories`;--> statement-breakpoint
CREATE UNIQUE INDEX `categories_name_unique` ON `categories` (`name`);--> statement-breakpoint
CREATE TABLE `__new_difficulty_levels` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`level` integer NOT NULL,
	`color` text,
	`description` text,
	`createdAt` integer DEFAULT '"2026-02-03T16:52:13.370Z"' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_difficulty_levels`("id", "name", "level", "color", "description", "createdAt") SELECT "id", "name", "level", "color", "description", "createdAt" FROM `difficulty_levels`;--> statement-breakpoint
DROP TABLE `difficulty_levels`;--> statement-breakpoint
ALTER TABLE `__new_difficulty_levels` RENAME TO `difficulty_levels`;--> statement-breakpoint
CREATE UNIQUE INDEX `difficulty_levels_name_unique` ON `difficulty_levels` (`name`);--> statement-breakpoint
CREATE TABLE `__new_questions` (
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
	`createdAt` integer DEFAULT '"2026-02-03T16:52:13.370Z"' NOT NULL,
	`updatedAt` integer DEFAULT '"2026-02-03T16:52:13.370Z"' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_questions`("id", "categoryId", "bankId", "difficultyId", "category", "bank", "difficulty", "year", "questionText", "alternatives", "correctAnswer", "explanation", "source", "isActive", "generatedByLLM", "createdAt", "updatedAt") SELECT "id", "categoryId", "bankId", "difficultyId", "category", "bank", "difficulty", "year", "questionText", "alternatives", "correctAnswer", "explanation", "source", "isActive", "generatedByLLM", "createdAt", "updatedAt" FROM `questions`;--> statement-breakpoint
DROP TABLE `questions`;--> statement-breakpoint
ALTER TABLE `__new_questions` RENAME TO `questions`;--> statement-breakpoint
CREATE TABLE `__new_seo_metadata` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`path` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`keywords` text,
	`ogImage` text,
	`ogTitle` text,
	`ogDescription` text,
	`canonicalUrl` text,
	`createdAt` integer DEFAULT '"2026-02-03T16:52:13.371Z"' NOT NULL,
	`updatedAt` integer DEFAULT '"2026-02-03T16:52:13.371Z"' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_seo_metadata`("id", "path", "title", "description", "keywords", "ogImage", "ogTitle", "ogDescription", "canonicalUrl", "createdAt", "updatedAt") SELECT "id", "path", "title", "description", "keywords", "ogImage", "ogTitle", "ogDescription", "canonicalUrl", "createdAt", "updatedAt" FROM `seo_metadata`;--> statement-breakpoint
DROP TABLE `seo_metadata`;--> statement-breakpoint
ALTER TABLE `__new_seo_metadata` RENAME TO `seo_metadata`;--> statement-breakpoint
CREATE UNIQUE INDEX `seo_metadata_path_unique` ON `seo_metadata` (`path`);--> statement-breakpoint
CREATE TABLE `__new_simulados` (
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
	`startedAt` integer DEFAULT '"2026-02-03T16:52:13.371Z"' NOT NULL,
	`completedAt` integer,
	`createdAt` integer DEFAULT '"2026-02-03T16:52:13.371Z"' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_simulados`("id", "userId", "name", "categoryId", "bankId", "totalQuestions", "totalCorrect", "accuracy", "timeLimit", "timeSpent", "status", "startedAt", "completedAt", "createdAt") SELECT "id", "userId", "name", "categoryId", "bankId", "totalQuestions", "totalCorrect", "accuracy", "timeLimit", "timeSpent", "status", "startedAt", "completedAt", "createdAt" FROM `simulados`;--> statement-breakpoint
DROP TABLE `simulados`;--> statement-breakpoint
ALTER TABLE `__new_simulados` RENAME TO `simulados`;--> statement-breakpoint
CREATE TABLE `__new_user_answers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer NOT NULL,
	`questionId` integer NOT NULL,
	`selectedAnswer` text NOT NULL,
	`isCorrect` integer NOT NULL,
	`timeSpent` integer,
	`attemptNumber` integer DEFAULT 1,
	`createdAt` integer DEFAULT '"2026-02-03T16:52:13.370Z"' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_user_answers`("id", "userId", "questionId", "selectedAnswer", "isCorrect", "timeSpent", "attemptNumber", "createdAt") SELECT "id", "userId", "questionId", "selectedAnswer", "isCorrect", "timeSpent", "attemptNumber", "createdAt" FROM `user_answers`;--> statement-breakpoint
DROP TABLE `user_answers`;--> statement-breakpoint
ALTER TABLE `__new_user_answers` RENAME TO `user_answers`;--> statement-breakpoint
CREATE TABLE `__new_user_category_stats` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer NOT NULL,
	`categoryId` integer NOT NULL,
	`totalAnswered` integer DEFAULT 0,
	`totalCorrect` integer DEFAULT 0,
	`accuracy` integer DEFAULT 0,
	`lastAnsweredAt` integer,
	`createdAt` integer DEFAULT '"2026-02-03T16:52:13.371Z"' NOT NULL,
	`updatedAt` integer DEFAULT '"2026-02-03T16:52:13.371Z"' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_user_category_stats`("id", "userId", "categoryId", "totalAnswered", "totalCorrect", "accuracy", "lastAnsweredAt", "createdAt", "updatedAt") SELECT "id", "userId", "categoryId", "totalAnswered", "totalCorrect", "accuracy", "lastAnsweredAt", "createdAt", "updatedAt" FROM `user_category_stats`;--> statement-breakpoint
DROP TABLE `user_category_stats`;--> statement-breakpoint
ALTER TABLE `__new_user_category_stats` RENAME TO `user_category_stats`;--> statement-breakpoint
CREATE UNIQUE INDEX `user_category_stats_unique` ON `user_category_stats` (`userId`,`categoryId`);--> statement-breakpoint
CREATE TABLE `__new_user_stats` (
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
	`createdAt` integer DEFAULT '"2026-02-03T16:52:13.370Z"' NOT NULL,
	`updatedAt` integer DEFAULT '"2026-02-03T16:52:13.370Z"' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_user_stats`("id", "userId", "totalAnswered", "totalCorrect", "totalIncorrect", "accuracy", "currentStreak", "bestStreak", "totalTimeSpent", "lastActivityAt", "createdAt", "updatedAt") SELECT "id", "userId", "totalAnswered", "totalCorrect", "totalIncorrect", "accuracy", "currentStreak", "bestStreak", "totalTimeSpent", "lastActivityAt", "createdAt", "updatedAt" FROM `user_stats`;--> statement-breakpoint
DROP TABLE `user_stats`;--> statement-breakpoint
ALTER TABLE `__new_user_stats` RENAME TO `user_stats`;--> statement-breakpoint
CREATE UNIQUE INDEX `user_stats_userId_unique` ON `user_stats` (`userId`);--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`openId` text NOT NULL,
	`name` text,
	`email` text,
	`loginMethod` text,
	`role` text DEFAULT 'user' NOT NULL,
	`createdAt` integer DEFAULT '"2026-02-03T16:52:13.367Z"' NOT NULL,
	`updatedAt` integer DEFAULT '"2026-02-03T16:52:13.367Z"' NOT NULL,
	`lastSignedIn` integer DEFAULT '"2026-02-03T16:52:13.367Z"' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "openId", "name", "email", "loginMethod", "role", "createdAt", "updatedAt", "lastSignedIn") SELECT "id", "openId", "name", "email", "loginMethod", "role", "createdAt", "updatedAt", "lastSignedIn" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
CREATE UNIQUE INDEX `users_openId_unique` ON `users` (`openId`);