import { eq, and, like, desc, asc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const Database = require("better-sqlite3");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import {
  InsertUser,
  users,
  categories,
  banks,
  difficultyLevels,
  questions,
  userAnswers,
  userStats,
  userCategoryStats,
  simulados,
  ads,
  seoMetadata,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db) {
    try {
      let dbPath = process.env.DATABASE_URL || path.join(__dirname, "..", "sqlite.db");
      
      // Handle "file:" prefix which might be injected by some environments
      if (dbPath.startsWith("file:")) {
        dbPath = dbPath.replace(/^file:/, "");
      }
      
      // Ensure absolute path if it looks like a filename
      if (!path.isAbsolute(dbPath)) {
        dbPath = path.resolve(process.cwd(), dbPath);
      }

      console.log("[Database] Connecting to:", dbPath);
      const sqlite = new Database(dbPath);
      const tables = sqlite.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
      console.log("[Database] Tables found:", tables.map(t => t.name));
      _db = drizzle(sqlite);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onConflictDoUpdate({
      target: users.openId,
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Categories
export async function getCategories() {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(categories)
    .where(eq(categories.isActive, true))
    .orderBy(asc(categories.order));
}

export async function getCategoryById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(categories)
    .where(eq(categories.id, id))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createCategory(data: {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  order?: number;
}) {
  const db = await getDb();
  if (!db) return undefined;

  await db.insert(categories).values(data);
  // Get the last inserted ID and return the category
  const result = await db
    .select()
    .from(categories)
    .orderBy(desc(categories.id))
    .limit(1);
  return result[0];
}

export async function updateCategory(
  id: number,
  data: Partial<{
    name: string;
    description: string;
    icon: string;
    color: string;
    order: number;
    isActive: boolean;
  }>
) {
  const db = await getDb();
  if (!db) return undefined;

  return db.update(categories).set(data).where(eq(categories.id, id));
}

export async function deleteCategory(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  return db.update(categories).set({ isActive: false }).where(eq(categories.id, id));
}

// Banks
export async function getBanks() {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(banks)
    .where(eq(banks.isActive, true))
    .orderBy(asc(banks.name));
}

export async function getBankById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(banks)
    .where(eq(banks.id, id))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createBank(data: {
  name: string;
  description?: string;
  logo?: string;
}) {
  const db = await getDb();
  if (!db) return undefined;

  await db.insert(banks).values(data);
  // Get the last inserted ID and return the bank
  const result = await db
    .select()
    .from(banks)
    .orderBy(desc(banks.id))
    .limit(1);
  return result[0];
}

export async function updateBank(
  id: number,
  data: Partial<{
    name: string;
    description: string;
    logo: string;
    isActive: boolean;
  }>
) {
  const db = await getDb();
  if (!db) return undefined;

  return db.update(banks).set(data).where(eq(banks.id, id));
}

export async function deleteBank(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  return db.update(banks).set({ isActive: false }).where(eq(banks.id, id));
}

// Difficulty Levels
export async function getDifficultyLevels() {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(difficultyLevels).orderBy(asc(difficultyLevels.level));
}

export async function createDifficultyLevel(data: {
  name: string;
  level: number;
  color?: string;
  description?: string;
}) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.insert(difficultyLevels).values(data);
  return result;
}

// Questions
export async function getQuestions(filters: {
  categoryId?: number;
  bankId?: number;
  difficultyId?: number;
  category?: string;
  bank?: string;
  difficulty?: string;
  year?: number;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [eq(questions.isActive, true)];

  if (filters.categoryId) {
    conditions.push(eq(questions.categoryId, filters.categoryId));
  }
  if (filters.bankId) {
    conditions.push(eq(questions.bankId, filters.bankId));
  }
  if (filters.difficultyId) {
    conditions.push(eq(questions.difficultyId, filters.difficultyId));
  }
  if (filters.category) {
    conditions.push(eq(questions.category, filters.category));
  }
  if (filters.bank) {
    conditions.push(eq(questions.bank, filters.bank));
  }
  if (filters.difficulty) {
    conditions.push(eq(questions.difficulty, filters.difficulty));
  }
  if (filters.year) {
    conditions.push(eq(questions.year, filters.year));
  }
  if (filters.search) {
    conditions.push(like(questions.questionText, `%${filters.search}%`));
  }

  const limit = filters.limit || 20;
  const offset = filters.offset || 0;

  return db
    .select()
    .from(questions)
    .where(and(...conditions))
    .orderBy(sql`RANDOM()`)
    .limit(limit)
    .offset(offset);
}

export async function getQuestionById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(questions)
    .where(eq(questions.id, id))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getRandomQuestions(count: number, filters?: {
  categoryId?: number;
  bankId?: number;
  difficultyId?: number;
  category?: string;
  bank?: string;
  difficulty?: string;
}) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [eq(questions.isActive, true)];

  if (filters?.categoryId) {
    conditions.push(eq(questions.categoryId, filters.categoryId));
  }
  if (filters?.bankId) {
    conditions.push(eq(questions.bankId, filters.bankId));
  }
  if (filters?.difficultyId) {
    conditions.push(eq(questions.difficultyId, filters.difficultyId));
  }
  if (filters?.category) {
    conditions.push(eq(questions.category, filters.category));
  }
  if (filters?.bank) {
    conditions.push(eq(questions.bank, filters.bank));
  }
  if (filters?.difficulty) {
    conditions.push(eq(questions.difficulty, filters.difficulty));
  }
  if (filters?.category) {
    conditions.push(eq(questions.category, filters.category));
  }
  if (filters?.bank) {
    conditions.push(eq(questions.bank, filters.bank));
  }
  if (filters?.difficulty) {
    conditions.push(eq(questions.difficulty, filters.difficulty));
  }

  return db
    .select()
    .from(questions)
    .where(and(...conditions))
    .orderBy(sql`RANDOM()`)
    .limit(count);
}

export async function countQuestions(filters?: {
  categoryId?: number;
  bankId?: number;
  difficultyId?: number;
  category?: string;
  bank?: string;
  difficulty?: string;
}) {
  const db = await getDb();
  if (!db) return 0;

  const conditions = [eq(questions.isActive, true)];

  if (filters?.categoryId) {
    conditions.push(eq(questions.categoryId, filters.categoryId));
  }
  if (filters?.bankId) {
    conditions.push(eq(questions.bankId, filters.bankId));
  }
  if (filters?.difficultyId) {
    conditions.push(eq(questions.difficultyId, filters.difficultyId));
  }

  const result = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(questions)
    .where(and(...conditions));

  return result[0]?.count || 0;
}

export async function createQuestion(data: {
  categoryId?: number;
  bankId?: number;
  difficultyId?: number;
  category?: string;
  bank?: string;
  difficulty?: string;
  year?: string;
  questionText: string;
  alternatives: {
    a: string;
    b: string;
    c: string;
    d: string;
    e?: string;
  };
  correctAnswer: string;
  explanation?: string;
  source?: string;
}) {
  const db = await getDb();
  if (!db) return undefined;

  // Provide defaults for legacy not-null columns if they are missing
  const dbData = {
    ...data,
    categoryId: data.categoryId ?? 0,
    bankId: data.bankId ?? 0,
    difficultyId: data.difficultyId ?? 0,
  };

  await db.insert(questions).values(dbData);
  // Get the last inserted ID and return the question
  const result = await db
    .select()
    .from(questions)
    .orderBy(desc(questions.id))
    .limit(1);
  return result[0];
}

export async function updateQuestion(
  id: number,
  data: Partial<{
    categoryId: number;
    bankId: number;
    difficultyId: number;
    category: string;
    bank: string;
    difficulty: string;
    year: string;
    questionText: string;
    alternatives: any;
    correctAnswer: string;
    explanation: string;
    source: string;
    isActive: boolean;
  }>
) {
  const db = await getDb();
  if (!db) return undefined;

  return db.update(questions).set(data).where(eq(questions.id, id));
}

export async function deleteQuestion(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  return db.update(questions).set({ isActive: false }).where(eq(questions.id, id));
}

export async function getDistinctCategories() {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .selectDistinct({ category: questions.category })
    .from(questions)
    .where(eq(questions.isActive, true))
    .orderBy(asc(questions.category));
  
  return result.map(r => r.category).filter(Boolean);
}

export async function getDistinctBanks() {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .selectDistinct({ bank: questions.bank })
    .from(questions)
    .where(eq(questions.isActive, true))
    .orderBy(asc(questions.bank));
  
  return result.map(r => r.bank).filter(Boolean);
}

export async function getDistinctDifficulties() {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .selectDistinct({ difficulty: questions.difficulty })
    .from(questions)
    .where(eq(questions.isActive, true))
    .orderBy(asc(questions.difficulty));
  
  return result.map(r => r.difficulty).filter(Boolean);
}

// User Answers
export async function recordUserAnswer(
  userId: number,
  questionId: number,
  selectedAnswer: string,
  isCorrect: boolean,
  timeSpent?: number
) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.insert(userAnswers).values({
    userId,
    questionId,
    selectedAnswer,
    isCorrect,
    timeSpent,
  });

  return result;
}

export async function getUserAnswerHistory(userId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(userAnswers)
    .where(eq(userAnswers.userId, userId))
    .orderBy(desc(userAnswers.createdAt))
    .limit(limit);
}

// User Stats
export async function getUserStats(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(userStats)
    .where(eq(userStats.userId, userId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function initializeUserStats(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const existing = await getUserStats(userId);
  if (existing) return existing;

  const result = await db.insert(userStats).values({
    userId,
  });

  return result;
}

export async function updateUserStats(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const answers = await db
    .select({
      total: sql<number>`COUNT(*)`,
      correct: sql<number>`SUM(CASE WHEN isCorrect = true THEN 1 ELSE 0 END)`,
    })
    .from(userAnswers)
    .where(eq(userAnswers.userId, userId));

  const totalAnswered = answers[0]?.total || 0;
  const totalCorrect = answers[0]?.correct || 0;
  const totalIncorrect = totalAnswered - totalCorrect;
  const accuracy =
    totalAnswered > 0 ? ((totalCorrect / totalAnswered) * 100).toFixed(2) : "0.00";
  const accuracyDecimal = parseFloat(accuracy as string) as any;

  await db
    .insert(userStats)
    .values({
      userId,
      totalAnswered,
      totalCorrect,
      totalIncorrect,
      accuracy: accuracyDecimal,
      lastActivityAt: new Date(),
    })
    .onConflictDoUpdate({
      target: userStats.userId,
      set: {
        totalAnswered,
        totalCorrect,
        totalIncorrect,
        accuracy: accuracyDecimal,
        lastActivityAt: new Date(),
      },
    });

  return getUserStats(userId);
}

// User Category Stats
export async function updateUserCategoryStats(userId: number, categoryId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const answers = await db
    .select({
      total: sql<number>`COUNT(*)`,
      correct: sql<number>`SUM(CASE WHEN isCorrect = true THEN 1 ELSE 0 END)`,
    })
    .from(userAnswers)
    .innerJoin(questions, eq(userAnswers.questionId, questions.id))
    .where(
      and(
        eq(userAnswers.userId, userId),
        eq(questions.categoryId, categoryId)
      )
    );

  const totalAnswered = answers[0]?.total || 0;
  const totalCorrect = answers[0]?.correct || 0;
  const accuracy =
    totalAnswered > 0 ? ((totalCorrect / totalAnswered) * 100).toFixed(2) : "0.00";

  const accuracyDecimal = parseFloat(accuracy as string) as any;

  await db
    .insert(userCategoryStats)
    .values({
      categoryId,
      userId,
      totalAnswered,
      totalCorrect,
      accuracy: accuracyDecimal,
      lastAnsweredAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [userCategoryStats.userId, userCategoryStats.categoryId],
      set: {
        totalAnswered,
        totalCorrect,
        accuracy: accuracyDecimal,
        lastAnsweredAt: new Date(),
      },
    });

  return db
    .select()
    .from(userCategoryStats)
    .where(
      and(
        eq(userCategoryStats.userId, userId),
        eq(userCategoryStats.categoryId, categoryId)
      )
    )
    .limit(1);
}

export async function getUserCategoryStats(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(userCategoryStats)
    .where(eq(userCategoryStats.userId, userId))
    .orderBy(desc(userCategoryStats.accuracy));
}

// Ads
export async function getActiveAds(placement: string) {
  const db = await getDb();
  if (!db) return [];

  const now = new Date();

  return db
    .select()
    .from(ads)
    .where(
      and(
        eq(ads.placement, placement as any),
        eq(ads.isActive, true),
        sql`(startDate IS NULL OR startDate <= ${now})`,
        sql`(endDate IS NULL OR endDate >= ${now})`
      )
    )
    .orderBy(desc(ads.priority));
}

export async function getAllAds() {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(ads).orderBy(desc(ads.priority));
}

export async function createAd(data: {
  name: string;
  placement: "header_banner" | "sidebar_top" | "sidebar_middle" | "sidebar_bottom" | "between_questions" | "footer";
  adCode: string;
  priority?: number;
  startDate?: Date;
  endDate?: Date;
}) {
  const db = await getDb();
  if (!db) return undefined;

  await db.insert(ads).values(data);
  // Get the last inserted ID and return the ad
  const result = await db
    .select()
    .from(ads)
    .orderBy(desc(ads.id))
    .limit(1);
  return result[0];
}

export async function updateAd(
  id: number,
  data: Partial<{
    name: string;
    adCode: string;
    isActive: boolean;
    priority: number;
    startDate: Date;
    endDate: Date;
  }>
) {
  const db = await getDb();
  if (!db) return undefined;

  return db.update(ads).set(data).where(eq(ads.id, id));
}

export async function deleteAd(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  return db.update(ads).set({ isActive: false }).where(eq(ads.id, id));
}

// SEO Metadata
export async function getSeoMetadata(path: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(seoMetadata)
    .where(eq(seoMetadata.path, path))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createSeoMetadata(data: {
  path: string;
  title: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  canonicalUrl?: string;
}) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.insert(seoMetadata).values(data);
  return result;
}

export async function updateSeoMetadata(
  path: string,
  data: Partial<{
    title: string;
    description: string;
    keywords: string;
    ogImage: string;
    ogTitle: string;
    ogDescription: string;
    canonicalUrl: string;
  }>
) {
  const db = await getDb();
  if (!db) return undefined;

  return db.update(seoMetadata).set(data).where(eq(seoMetadata.path, path));
}
