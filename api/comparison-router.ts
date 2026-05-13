import { z } from "zod";
import { createRouter, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { comparisons, quotas } from "../db/schema";
import { eq, and, gte, desc } from "drizzle-orm";

export const comparisonRouter = createRouter({
  // Get user's comparison history
  list: authedQuery
    .input(z.object({ limit: z.number().min(1).max(50).default(20) }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const rows = await db
        .select()
        .from(comparisons)
        .where(eq(comparisons.userId, ctx.user.id))
        .orderBy(desc(comparisons.createdAt))
        .limit(input.limit);
      return rows;
    }),

  // Create a new comparison record
  create: authedQuery
    .input(
      z.object({
        title: z.string().min(1).max(255),
        type: z.enum(["image", "video"]),
        originalUrl: z.string().url(),
        models: z.array(z.string()).min(2).max(4),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      // Check quota
      const [quota] = await db
        .select()
        .from(quotas)
        .where(eq(quotas.userId, ctx.user.id));

      if (quota && quota.usedThisMonth >= quota.monthlyLimit) {
        throw new Error("Monthly quota exceeded. Upgrade to Pro for more.");
      }

      // Create comparison
      const [record] = await db
        .insert(comparisons)
        .values({
          userId: ctx.user.id,
          title: input.title,
          type: input.type,
          originalUrl: input.originalUrl,
          models: input.models,
          resultUrls: {},
          status: "processing",
        })
        .$returningId();

      // Increment usage
      if (quota) {
        await db
          .update(quotas)
          .set({
            usedThisMonth: quota.usedThisMonth + 1,
            updatedAt: new Date(),
          })
          .where(eq(quotas.userId, ctx.user.id));
      }

      return { id: record.id, status: "processing" };
    }),

  // Update comparison results (called after processing)
  update: authedQuery
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["processing", "done", "failed"]),
        resultUrls: z.record(z.string().url()).optional(),
        metrics: z.record(z.number()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db
        .update(comparisons)
        .set({
          status: input.status,
          resultUrls: input.resultUrls ?? {},
          metrics: input.metrics ?? {},
        })
        .where(
          and(
            eq(comparisons.id, input.id),
            eq(comparisons.userId, ctx.user.id),
          ),
        );
      return { success: true };
    }),

  // Get user quota
  quota: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const [quota] = await db
      .select()
      .from(quotas)
      .where(eq(quotas.userId, ctx.user.id));

    if (!quota) {
      // Create default free quota
      const [newQuota] = await db
        .insert(quotas)
        .values({
          userId: ctx.user.id,
          plan: "free",
          monthlyLimit: 5,
          usedThisMonth: 0,
        })
        .$returningId();
      return { ...newQuota, remaining: 5 };
    }

    return {
      ...quota,
      remaining: Math.max(0, quota.monthlyLimit - quota.usedThisMonth),
    };
  }),

  // Get single comparison by ID
  byId: authedQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const [row] = await db
        .select()
        .from(comparisons)
        .where(
          and(
            eq(comparisons.id, input.id),
            eq(comparisons.userId, ctx.user.id),
          ),
        )
        .limit(1);
      return row ?? null;
    }),
});
