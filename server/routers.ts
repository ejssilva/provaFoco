import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";
import { sdk } from "./_core/sdk";

// Helper to check if user is admin
const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.user?.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    
    adminLogin: publicProcedure
      .input(z.object({ password: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Cl050223*";
        
        if (input.password !== ADMIN_PASSWORD) {
          throw new TRPCError({ 
            code: "UNAUTHORIZED", 
            message: "Senha incorreta" 
          });
        }

        const adminUser = {
          openId: "admin-user",
          name: "Administrador",
          email: "ejsdnsilva@gmail.com",
          role: "admin" as const,
          loginMethod: "local",
        };

        // Ensure admin user exists in DB
        await db.upsertUser(adminUser);

        const sessionToken = await sdk.createSessionToken(adminUser.openId, {
          name: adminUser.name,
          expiresInMs: ONE_YEAR_MS,
        });

        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

        return { success: true };
      }),

    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Categories
  categories: router({
    list: publicProcedure.query(async () => {
      return db.getCategories();
    }),
    getById: publicProcedure.input(z.number()).query(async ({ input }) => {
      return db.getCategoryById(input);
    }),
    create: adminProcedure
      .input(
        z.object({
          name: z.string().min(1),
          description: z.string().optional(),
          icon: z.string().optional(),
          color: z.string().optional(),
          order: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return db.createCategory(input);
      }),
    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          description: z.string().optional(),
          icon: z.string().optional(),
          color: z.string().optional(),
          order: z.number().optional(),
          isActive: z.boolean().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return db.updateCategory(id, data);
      }),
    delete: adminProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return db.deleteCategory(input);
      }),
  }),

  // Banks
  banks: router({
    list: publicProcedure.query(async () => {
      return db.getBanks();
    }),
    getById: publicProcedure.input(z.number()).query(async ({ input }) => {
      return db.getBankById(input);
    }),
    create: adminProcedure
      .input(
        z.object({
          name: z.string().min(1),
          description: z.string().optional(),
          logo: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return db.createBank(input);
      }),
    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          description: z.string().optional(),
          logo: z.string().optional(),
          isActive: z.boolean().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return db.updateBank(id, data);
      }),
    delete: adminProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return db.deleteBank(input);
      }),
  }),

  // Difficulty Levels
  difficultyLevels: router({
    list: publicProcedure.query(async () => {
      return db.getDifficultyLevels();
    }),
    create: adminProcedure
      .input(
        z.object({
          name: z.string().min(1),
          level: z.number(),
          color: z.string().optional(),
          description: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return db.createDifficultyLevel(input);
      }),
  }),

  // Questions
  questions: router({
    getFilters: publicProcedure.query(async () => {
      const [categories, banks, difficulties] = await Promise.all([
        db.getDistinctCategories(),
        db.getDistinctBanks(),
        db.getDistinctDifficulties(),
      ]);
      return { categories, banks, difficulties };
    }),

    list: publicProcedure
      .input(
        z.object({
          categoryId: z.number().optional(),
          bankId: z.number().optional(),
          difficultyId: z.number().optional(),
          category: z.string().optional(),
          bank: z.string().optional(),
          difficulty: z.string().optional(),
          year: z.number().optional(),
          search: z.string().optional(),
          limit: z.number().default(20),
          offset: z.number().default(0),
        })
      )
      .query(async ({ input }) => {
        return db.getQuestions(input);
      }),

    count: publicProcedure
      .input(
        z.object({
          categoryId: z.number().optional(),
          bankId: z.number().optional(),
          difficultyId: z.number().optional(),
          category: z.string().optional(),
          bank: z.string().optional(),
          difficulty: z.string().optional(),
        })
      )
      .query(async ({ input }) => {
        return db.countQuestions(input);
      }),

    getById: publicProcedure.input(z.number()).query(async ({ input }) => {
      return db.getQuestionById(input);
    }),

    random: publicProcedure
      .input(
        z.object({
          count: z.number().default(10),
          categoryId: z.number().optional(),
          bankId: z.number().optional(),
          difficultyId: z.number().optional(),
          category: z.string().optional(),
          bank: z.string().optional(),
          difficulty: z.string().optional(),
        })
      )
      .query(async ({ input }) => {
        return db.getRandomQuestions(input.count, {
          categoryId: input.categoryId,
          bankId: input.bankId,
          difficultyId: input.difficultyId,
          category: input.category,
          bank: input.bank,
          difficulty: input.difficulty,
        });
      }),

    create: adminProcedure
      .input(
        z.object({
          categoryId: z.number().optional(),
          bankId: z.number().optional(),
          difficultyId: z.number().optional(),
          category: z.string().optional(),
          bank: z.string().optional(),
          difficulty: z.string().optional(),
          year: z.string().optional(),
          questionText: z.string().min(1),
          alternatives: z.object({
            a: z.string(),
            b: z.string(),
            c: z.string(),
            d: z.string(),
            e: z.string().optional(),
          }),
          correctAnswer: z.enum(["a", "b", "c", "d", "e"]),
          explanation: z.string().optional(),
          source: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return db.createQuestion(input);
      }),

    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          categoryId: z.number().optional(),
          bankId: z.number().optional(),
          difficultyId: z.number().optional(),
          category: z.string().optional(),
          bank: z.string().optional(),
          difficulty: z.string().optional(),
          year: z.string().optional(),
          questionText: z.string().optional(),
          alternatives: z.object({
            a: z.string(),
            b: z.string(),
            c: z.string(),
            d: z.string(),
            e: z.string().optional(),
          }).optional(),
          correctAnswer: z.enum(["a", "b", "c", "d", "e"]).optional(),
          explanation: z.string().optional(),
          source: z.string().optional(),
          isActive: z.boolean().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return db.updateQuestion(id, data);
      }),

    delete: adminProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return db.deleteQuestion(input);
      }),
  }),

  // User Answers & Performance
  userAnswers: router({
    submit: publicProcedure
      .input(
        z.object({
          questionId: z.number(),
          selectedAnswer: z.enum(["a", "b", "c", "d", "e"]),
          timeSpent: z.number().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const question = await db.getQuestionById(input.questionId);
        if (!question) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Question not found" });
        }

        const isCorrect = question.correctAnswer === input.selectedAnswer;

        // If user is logged in, record the answer and stats
        if (ctx.user) {
          const userId = ctx.user.id;
          
          await db.recordUserAnswer(
            userId,
            input.questionId,
            input.selectedAnswer,
            isCorrect,
            input.timeSpent
          );

          await db.updateUserStats(userId);
          await db.updateUserCategoryStats(userId, question.categoryId);
        }

        return {
          isCorrect,
          correctAnswer: question.correctAnswer,
          explanation: question.explanation || undefined,
        };
      }),

    history: protectedProcedure
      .input(z.object({ limit: z.number().default(50) }))
      .query(async ({ input, ctx }) => {
        return db.getUserAnswerHistory(ctx.user!.id, input.limit);
      }),
  }),

  // User Stats
  stats: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      const userId = ctx.user!.id;
      const stats = await db.getUserStats(userId);

      if (!stats) {
        await db.initializeUserStats(userId);
        return db.getUserStats(userId);
      }

      return stats;
    }),

    categoryStats: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserCategoryStats(ctx.user!.id);
    }),
  }),

  // Ads
  ads: router({
    getByPlacement: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return db.getActiveAds(input);
      }),
    
    list: adminProcedure.query(async () => {
      return db.getAllAds();
    }),

    create: adminProcedure
      .input(
        z.object({
          name: z.string().min(1),
          placement: z.enum([
            "header_banner",
            "sidebar_top",
            "sidebar_middle",
            "sidebar_bottom",
            "between_questions",
            "footer",
          ]),
          adCode: z.string().min(1),
          priority: z.number().optional(),
          startDate: z.date().optional(),
          endDate: z.date().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return db.createAd(input);
      }),

    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          adCode: z.string().optional(),
          isActive: z.boolean().optional(),
          priority: z.number().optional(),
          startDate: z.date().optional(),
          endDate: z.date().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return db.updateAd(id, data);
      }),

    delete: adminProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return db.deleteAd(input);
      }),
  }),
});

export type AppRouter = typeof appRouter;
