import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return ctx;
}

function createUserContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "regular-user",
    email: "user@example.com",
    name: "Regular User",
    loginMethod: "email",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return ctx;
}

describe("Questions Router", () => {
  describe("categories", () => {
    it("should list categories", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const categories = await caller.categories.list();

      expect(Array.isArray(categories)).toBe(true);
    });

    it("should create a category", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.categories.create({
        name: `Test Category ${Date.now()}`,
        description: "A test category",
        color: "#3b82f6",
        order: 1,
      });

      expect(result).toHaveProperty("id");
      expect(result.name).toContain("Test Category");
    });

    it("should prevent non-admin from creating categories", async () => {
      const ctx = createUserContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.categories.create({
          name: "Test Category",
          description: "A test category",
          color: "#3b82f6",
          order: 1,
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });
  });

  describe("banks", () => {
    it("should list banks", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const banks = await caller.banks.list();

      expect(Array.isArray(banks)).toBe(true);
    });

    it("should create a bank", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.banks.create({
        name: `Test Bank ${Date.now()}`,
        description: "A test bank",
      });

      expect(result).toHaveProperty("id");
      expect(result.name).toContain("Test Bank");
    });
  });

  describe("difficultyLevels", () => {
    it("should list difficulty levels", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const levels = await caller.difficultyLevels.list();

      expect(Array.isArray(levels)).toBe(true);
    });
  });

  describe("questions", () => {
    it("should list questions", async () => {
      const ctx = createUserContext();
      const caller = appRouter.createCaller(ctx);

      const questions = await caller.questions.list({ limit: 10 });

      expect(Array.isArray(questions)).toBe(true);
    });

    it("should create a question", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.questions.create({
        categoryId: 1,
        bankId: 1,
        difficultyId: 1,
        questionText: `What is 2 + 2? ${Date.now()}`,
        alternatives: {
          a: "3",
          b: "4",
          c: "5",
          d: "6",
        },
        correctAnswer: "b",
      });

      expect(result).toHaveProperty("id");
      expect(result.questionText).toContain("What is 2 + 2?");
      expect(result.correctAnswer).toBe("b");
    });

    it("should prevent non-admin from creating questions", async () => {
      const ctx = createUserContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.questions.create({
          categoryId: 1,
          bankId: 1,
          difficultyId: 1,
          questionText: "What is 2 + 2?",
          alternatives: {
            a: "3",
            b: "4",
            c: "5",
            d: "6",
          },
          correctAnswer: "b",
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });

    it("should filter questions by category", async () => {
      const ctx = createUserContext();
      const caller = appRouter.createCaller(ctx);

      const questions = await caller.questions.list({
        categoryId: 1,
        limit: 10,
      });

      expect(Array.isArray(questions)).toBe(true);
    });
  });

  describe("userAnswers", () => {
    it("should submit an answer", async () => {
      const ctx = createUserContext();
      const caller = appRouter.createCaller(ctx);

      // First, get a question
      const questions = await caller.questions.list({ limit: 1 });
      if (questions.length === 0) {
        console.log("No questions available for testing");
        return;
      }

      const question = questions[0];

      const result = await caller.userAnswers.submit({
        questionId: question.id,
        selectedAnswer: question.correctAnswer as any,
      });

      expect(result).toHaveProperty("isCorrect");
      expect(result.isCorrect).toBe(true);
      expect(result.correctAnswer).toBe(question.correctAnswer);
    });
  });

  describe("stats", () => {
    it("should get user stats", async () => {
      const ctx = createUserContext();
      const caller = appRouter.createCaller(ctx);

      const stats = await caller.stats.get();

      expect(stats).toHaveProperty("totalAnswered");
      expect(stats).toHaveProperty("totalCorrect");
      expect(stats).toHaveProperty("totalIncorrect");
      expect(stats).toHaveProperty("accuracy");
    });

    it("should get category stats", async () => {
      const ctx = createUserContext();
      const caller = appRouter.createCaller(ctx);

      const stats = await caller.stats.categoryStats();

      expect(Array.isArray(stats)).toBe(true);
    });
  });

  describe("ads", () => {
    it("should list ads", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const ads = await caller.ads.list();

      expect(Array.isArray(ads)).toBe(true);
    });

    it("should create an ad", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.ads.create({
        name: `Test Ad ${Date.now()}`,
        placement: "header_banner",
        adCode: "<div>Test Ad</div>",
        priority: 1,
      });

      expect(result).toHaveProperty("id");
      expect(result.name).toContain("Test Ad");
      expect(result.placement).toBe("header_banner");
    });

    it("should prevent non-admin from creating ads", async () => {
      const ctx = createUserContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.ads.create({
          name: "Test Ad",
          placement: "header_banner",
          adCode: "<div>Test Ad</div>",
          priority: 1,
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });
  });
});
