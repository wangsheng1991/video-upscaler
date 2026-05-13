import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import type { HttpBindings } from "@hono/node-server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";
import { env } from "./lib/env";
import { createOAuthCallbackHandler } from "./kimi/auth";
import { Paths } from "@contracts/constants";

const app = new Hono<{ Bindings: HttpBindings }>();

app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));
app.get(Paths.oauthCallback, createOAuthCallbackHandler());
app.use("/api/trpc/*", async (c) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext,
  });
});
app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));

// Dynamic sitemap generation
app.get("/sitemap.xml", (c) => {
  const baseUrl = c.env?.isProduction ? "https://your-domain.com" : "http://localhost:3000";

  const staticPages = [
    { loc: "/", priority: "1.0", changefreq: "weekly" },
    { loc: "/blog", priority: "0.9", changefreq: "weekly" },
    { loc: "/tools/vram-calculator", priority: "0.8", changefreq: "monthly" },
  ];

  const models = ["flashvsr", "seedvr2", "realesrgan", "swinir", "hat", "star", "realisvsr", "venhancer", "upscaleav", "invsr", "hypir", "topaz-video", "topaz-gp"];
  const modelPages = models.map((model) => ({
    loc: `/model/${model}`,
    priority: "0.8",
    changefreq: "monthly",
  }));

  const blogs = ["flashvsr-vs-seedvr2", "topaz-alternative-2026", "video-flickering-fix", "ai-generated-video-upscale", "480p-to-4k-guide", "ecommerce-product-upscaling"];
  const blogPages = blogs.map((slug) => ({
    loc: `/blog/${slug}`,
    priority: "0.7",
    changefreq: "monthly",
  }));

  const allPages = [...staticPages, ...modelPages, ...blogPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${baseUrl}${page.loc}</loc>
    <priority>${page.priority}</priority>
    <changefreq>${page.changefreq}</changefreq>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return c.html(sitemap, 200, {
    "Content-Type": "application/xml",
  });
});

export default app;

if (env.isProduction) {
  const { serve } = await import("@hono/node-server");
  const { serveStaticFiles } = await import("./lib/vite");
  serveStaticFiles(app);

  const port = parseInt(process.env.PORT || "3000");
  serve({ fetch: app.fetch, port }, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}
