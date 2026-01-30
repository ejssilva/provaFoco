import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";
import { ENV } from "./env";

/**
 * Test authentication route for development
 * Allows quick access to admin panel without OAuth flow
 * 
 * Usage: GET /api/test/admin-login
 * 
 * SECURITY WARNING: This should only be enabled in development!
 * Remove this in production or add proper access controls.
 */
export function registerTestAuthRoutes(app: Express) {
  // Only enable in development
  if (ENV.isProduction) {
    return;
  }

  app.get("/api/test/admin-login", async (req: Request, res: Response) => {
    try {
      const ownerOpenId = ENV.ownerOpenId;

      if (!ownerOpenId) {
        res.status(400).json({
          error: "OWNER_OPEN_ID not configured",
          message: "Set OWNER_OPEN_ID environment variable to use test login",
        });
        return;
      }

      // Create or update user as admin
      await db.upsertUser({
        openId: ownerOpenId,
        name: "Admin User (Test)",
        email: "admin@test.local",
        loginMethod: "test",
        role: "admin",
        lastSignedIn: new Date(),
      });

      // Create session token
      const sessionToken = await sdk.createSessionToken(ownerOpenId, {
        name: "Admin User (Test)",
        expiresInMs: ONE_YEAR_MS,
      });

      // Set cookie
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, {
        ...cookieOptions,
        maxAge: ONE_YEAR_MS,
      });

      // Redirect to admin panel
      res.redirect(302, "/admin");
    } catch (error) {
      console.error("[Test Auth] Login failed", error);
      res.status(500).json({
        error: "Test login failed",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  app.get("/api/test/user-login", async (req: Request, res: Response) => {
    try {
      // Create a test user (non-admin)
      const testUserId = "test-user-" + Date.now();

      await db.upsertUser({
        openId: testUserId,
        name: "Test User",
        email: "user@test.local",
        loginMethod: "test",
        role: "user",
        lastSignedIn: new Date(),
      });

      // Create session token
      const sessionToken = await sdk.createSessionToken(testUserId, {
        name: "Test User",
        expiresInMs: ONE_YEAR_MS,
      });

      // Set cookie
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, {
        ...cookieOptions,
        maxAge: ONE_YEAR_MS,
      });

      // Redirect to home
      res.redirect(302, "/");
    } catch (error) {
      console.error("[Test Auth] User login failed", error);
      res.status(500).json({
        error: "Test user login failed",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  app.get("/api/test/logout", (req: Request, res: Response) => {
    const cookieOptions = getSessionCookieOptions(req);
    res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
    res.redirect(302, "/");
  });

  console.log("[Test Auth] Test authentication routes enabled (development only)");
  console.log("[Test Auth] Available routes:");
  console.log("  - GET /api/test/admin-login  (login as admin)");
  console.log("  - GET /api/test/user-login   (login as regular user)");
  console.log("  - GET /api/test/logout       (logout)");
}
