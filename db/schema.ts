import { bigint, int, mysqlTable, timestamp, varchar, text, json } from "drizzle-orm/mysql-core";

// ─── Users ─────────────────────────────────────────

export const users = mysqlTable("users", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  unionId: varchar("union_id", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  avatar: varchar("avatar", { length: 1024 }),
  role: varchar("role", { length: 20 }).notNull().$default(() => "user"),
  createdAt: timestamp("created_at").$default(() => new Date()),
  updatedAt: timestamp("updated_at").$default(() => new Date()),
});

// ─── Comparison History ────────────────────────────

export const comparisons = mysqlTable("comparisons", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  userId: bigint("user_id", { mode: "number" }).notNull(),
  // userId references users.id
  title: varchar("title", { length: 255 }).notNull(),
  type: varchar("type", { length: 20 }).notNull(), // 'image' | 'video'
  originalUrl: varchar("original_url", { length: 2048 }).notNull(),
  // e.g. {"flashvsr": "https://...", "seedvr2": "https://..."}
  resultUrls: json("result_urls").notNull(),
  models: json("models").notNull(), // ["flashvsr", "seedvr2", "topaz"]
  metrics: json("metrics").$type<Record<string, number>>(), // per-model scores
  status: varchar("status", { length: 20 }).notNull().$default(() => "processing"), // processing | done | failed
  createdAt: timestamp("created_at").$default(() => new Date()),
});

// ─── Usage Quota ───────────────────────────────────

export const quotas = mysqlTable("quotas", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  userId: bigint("user_id", { mode: "number", unsigned: true })
    .notNull()
    .references(() => users.id)
    .unique(),
  plan: varchar("plan", { length: 20 }).notNull().$default(() => "free"), // free | pro | api
  monthlyLimit: int("monthly_limit").notNull().$default(() => 5),
  usedThisMonth: int("used_this_month").notNull().$default(() => 0),
  resetsAt: timestamp("resets_at").$default(() => new Date()),
  createdAt: timestamp("created_at").$default(() => new Date()),
  updatedAt: timestamp("updated_at").$default(() => new Date()),
});
