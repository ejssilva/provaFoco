import { Router } from "express";
import { getDb } from "./db";
import { questions } from "../drizzle/schema";
import { desc } from "drizzle-orm";

const sitemapRouter = Router();

sitemapRouter.get("/sitemap.xml", async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(500).send("Database not available");
    }

    // Get all questions (limit to most recent 5000 to avoid huge sitemaps initially)
    const allQuestions = await db
      .select({ id: questions.id, updatedAt: questions.updatedAt })
      .from(questions)
      .orderBy(desc(questions.createdAt))
      .limit(5000);

    console.log(`[Sitemap] Found ${allQuestions.length} questions`);

    const baseUrl = process.env.VITE_APP_URL || "https://provafoco.com.br"; // Fallback URL

    let xml = '<?xml version="1.0" encoding="UTF-8"?>';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

    // Static routes
    const staticRoutes = [
      { url: "/", changefreq: "daily", priority: 1.0 },
      { url: "/questions", changefreq: "daily", priority: 0.9 },
      { url: "/stats", changefreq: "weekly", priority: 0.7 },
    ];

    staticRoutes.forEach((route) => {
      xml += "<url>";
      xml += `<loc>${baseUrl}${route.url}</loc>`;
      xml += `<changefreq>${route.changefreq}</changefreq>`;
      xml += `<priority>${route.priority}</priority>`;
      xml += "</url>";
    });

    // Dynamic Question routes
    allQuestions.forEach((q) => {
      xml += "<url>";
      xml += `<loc>${baseUrl}/question/${q.id}</loc>`;
      xml += `<lastmod>${new Date(q.updatedAt || Date.now()).toISOString()}</lastmod>`;
      xml += "<changefreq>monthly</changefreq>";
      xml += "<priority>0.8</priority>";
      xml += "</url>";
    });

    xml += "</urlset>";

    res.header("Content-Type", "application/xml");
    res.send(xml);
  } catch (error) {
    console.error("Error generating sitemap:", error);
    res.status(500).send("Error generating sitemap");
  }
});

export { sitemapRouter };
