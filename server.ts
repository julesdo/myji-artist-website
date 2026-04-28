import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { ConvexHttpClient } from "convex/browser";
import { api } from "./convex/_generated/api.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Simple in-memory cache for "ISR"
let cache: {
  data: any;
  timestamp: number;
} | null = null;

const CACHE_TTL = 1000 * 60 * 5; // 5 minutes default

async function fetchInitialData() {
  const convexUrl = process.env.VITE_CONVEX_URL;
  if (!convexUrl) {
    console.error("VITE_CONVEX_URL not found in environment");
    return null;
  }

  const client = new ConvexHttpClient(convexUrl);
  
  try {
    const [settings, series, artworks, posts] = await Promise.all([
      client.query(api.settings.get),
      client.query(api.series.get),
      client.query(api.artworks.get),
      client.query(api.posts.get)
    ]);
    
    return { settings, series, artworks, posts };
  } catch (error) {
    console.error("Error fetching initial data from Convex:", error);
    return null;
  }
}

async function getCachedData() {
  const now = Date.now();
  if (cache && (now - cache.timestamp < CACHE_TTL)) {
    return cache.data;
  }
  
  const data = await fetchInitialData();
  if (data) {
    cache = { data, timestamp: now };
  }
  return data;
}

async function startServer() {
  let vite: any;
  
  if (process.env.NODE_ENV !== "production") {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
  }

  // API route to invalidate cache (the "refresh par tag" logic)
  app.post("/api/revalidate", (req, res) => {
    cache = null;
    res.json({ revalidated: true, now: Date.now() });
  });

  app.get("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      let template: string;
      if (process.env.NODE_ENV !== "production") {
        template = fs.readFileSync(path.resolve(process.cwd(), "index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
      } else {
        template = fs.readFileSync(path.resolve(process.cwd(), "dist/index.html"), "utf-8");
      }

      const initialData = await getCachedData();
      
      const scriptTag = `<script id="initial-data">window.__INITIAL_DATA__ = ${JSON.stringify(initialData)};</script>`;
      
      const html = template.replace(
        "<!-- SSR_DATA_INJECTION -->",
        scriptTag
      );

      // If replacement failed (placeholder not in HTML), just inject before </head>
      if (html === template) {
        res.send(template.replace("</head>", `${scriptTag}</head>`));
      } else {
        res.send(html);
      }
    } catch (e) {
      if (process.env.NODE_ENV !== "production") {
        vite.ssrFixStacktrace(e);
      }
      next(e);
    }
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
