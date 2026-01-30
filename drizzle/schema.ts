import {
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

/**
 * Core user table backing auth flow.
 */
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  openId: text("openId").notNull().unique(),
  name: text("name"),
  email: text("email"),
  loginMethod: text("loginMethod"),
  role: text("role", { enum: ["user", "admin"] }).default("user").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().default(new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull().default(new Date()),
  lastSignedIn: integer("lastSignedIn", { mode: "timestamp" }).notNull().default(new Date()),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Categories (subjects/disciplines)
 */
export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  description: text("description"),
  icon: text("icon"),
  color: text("color"),
  order: integer("order").default(0),
  isActive: integer("isActive", { mode: "boolean" }).default(true),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().default(new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull().default(new Date()),
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

/**
 * Banks (examining boards)
 */
export const banks = sqliteTable("banks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  description: text("description"),
  logo: text("logo"),
  isActive: integer("isActive", { mode: "boolean" }).default(true),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().default(new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull().default(new Date()),
});

export type Bank = typeof banks.$inferSelect;
export type InsertBank = typeof banks.$inferInsert;

/**
 * Difficulty levels
 */
export const difficultyLevels = sqliteTable("difficulty_levels", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  level: integer("level").notNull(),
  color: text("color"),
  description: text("description"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().default(new Date()),
});

export type DifficultyLevel = typeof difficultyLevels.$inferSelect;
export type InsertDifficultyLevel = typeof difficultyLevels.$inferInsert;

/**
 * Questions
 */
export const questions = sqliteTable("questions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  categoryId: integer("categoryId"), // Made optional
  bankId: integer("bankId"), // Made optional
  difficultyId: integer("difficultyId"), // Made optional
  
  // New text fields for flexible input
  category: text("category"),
  bank: text("bank"),
  difficulty: text("difficulty"),
  
  year: text("year"), // Changed to text for flexibility
  questionText: text("questionText").notNull(),
  alternatives: text("alternatives", { mode: "json" }).$type<{
    a: string;
    b: string;
    c: string;
    d: string;
    e?: string;
  }>().notNull(),
  correctAnswer: text("correctAnswer").notNull(),
  explanation: text("explanation"),
  source: text("source"),
  isActive: integer("isActive", { mode: "boolean" }).default(true),
  generatedByLLM: integer("generatedByLLM", { mode: "boolean" }).default(false),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().default(new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull().default(new Date()),
});

export type Question = typeof questions.$inferSelect;
export type InsertQuestion = typeof questions.$inferInsert;

/**
 * User answers and performance tracking
 */
export const userAnswers = sqliteTable("user_answers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull(),
  questionId: integer("questionId").notNull(),
  selectedAnswer: text("selectedAnswer").notNull(),
  isCorrect: integer("isCorrect", { mode: "boolean" }).notNull(),
  timeSpent: integer("timeSpent"), // in seconds
  attemptNumber: integer("attemptNumber").default(1),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().default(new Date()),
});

export type UserAnswer = typeof userAnswers.$inferSelect;
export type InsertUserAnswer = typeof userAnswers.$inferInsert;

/**
 * User statistics and performance summary
 */
export const userStats = sqliteTable("user_stats", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull().unique(),
  totalAnswered: integer("totalAnswered").default(0),
  totalCorrect: integer("totalCorrect").default(0),
  totalIncorrect: integer("totalIncorrect").default(0),
  accuracy: integer("accuracy").default(0), // Store as integer scaled (e.g. * 100) or just handle as float in app, SQLite stores numbers as REAL or INTEGER. Drizzle integer maps to number.
  currentStreak: integer("currentStreak").default(0),
  bestStreak: integer("bestStreak").default(0),
  totalTimeSpent: integer("totalTimeSpent").default(0), // in seconds
  lastActivityAt: integer("lastActivityAt", { mode: "timestamp" }),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().default(new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull().default(new Date()),
});

export type UserStat = typeof userStats.$inferSelect;
export type InsertUserStat = typeof userStats.$inferInsert;

/**
 * Category-specific statistics for users
 */
export const userCategoryStats = sqliteTable("user_category_stats", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull(),
  categoryId: integer("categoryId").notNull(),
  totalAnswered: integer("totalAnswered").default(0),
  totalCorrect: integer("totalCorrect").default(0),
  accuracy: integer("accuracy").default(0),
  lastAnsweredAt: integer("lastAnsweredAt", { mode: "timestamp" }),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().default(new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull().default(new Date()),
}, (table) => ({
  userCategoryUnique: uniqueIndex("user_category_stats_unique").on(table.userId, table.categoryId),
}));

export type UserCategoryStat = typeof userCategoryStats.$inferSelect;
export type InsertUserCategoryStat = typeof userCategoryStats.$inferInsert;

/**
 * Simulated exams (timed tests)
 */
export const simulados = sqliteTable("simulados", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull(),
  name: text("name").notNull(),
  categoryId: integer("categoryId"),
  bankId: integer("bankId"),
  totalQuestions: integer("totalQuestions").notNull(),
  totalCorrect: integer("totalCorrect").default(0),
  accuracy: integer("accuracy").default(0),
  timeLimit: integer("timeLimit"), // in seconds
  timeSpent: integer("timeSpent"), // in seconds
  status: text("status", { enum: ["in_progress", "completed"] }).default("in_progress"),
  startedAt: integer("startedAt", { mode: "timestamp" }).notNull().default(new Date()),
  completedAt: integer("completedAt", { mode: "timestamp" }),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().default(new Date()),
});

export type Simulado = typeof simulados.$inferSelect;
export type InsertSimulado = typeof simulados.$inferInsert;

/**
 * Ads configuration for monetization
 */
export const ads = sqliteTable("ads", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  placement: text("placement", { enum: [
    "header_banner",
    "sidebar_top",
    "sidebar_middle",
    "sidebar_bottom",
    "between_questions",
    "footer",
  ]}).notNull(),
  adCode: text("adCode").notNull(),
  isActive: integer("isActive", { mode: "boolean" }).default(true),
  priority: integer("priority").default(0),
  startDate: integer("startDate", { mode: "timestamp" }),
  endDate: integer("endDate", { mode: "timestamp" }),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().default(new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull().default(new Date()),
});

export type Ad = typeof ads.$inferSelect;
export type InsertAd = typeof ads.$inferInsert;

/**
 * SEO metadata for pages
 */
export const seoMetadata = sqliteTable("seo_metadata", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  path: text("path").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  keywords: text("keywords"),
  ogImage: text("ogImage"),
  ogTitle: text("ogTitle"),
  ogDescription: text("ogDescription"),
  canonicalUrl: text("canonicalUrl"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().default(new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull().default(new Date()),
});

export type SeoMetadata = typeof seoMetadata.$inferSelect;
export type InsertSeoMetadata = typeof seoMetadata.$inferInsert;
