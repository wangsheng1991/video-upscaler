import { authRouter } from "./auth-router";
import { comparisonRouter } from "./comparison-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  comparison: comparisonRouter,
});

export type AppRouter = typeof appRouter;
