import { integer, jsonb, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "../models/auth.models.js";
import { roadmapSchema } from "../../goals/goal.schema.js";
import z from "zod";

const statusEnum = pgEnum("status", ["Active", "Pending", "Completed"]);

export const goal = pgTable("goal", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  timeframe: text("timeframe").notNull(),
  status: statusEnum("status").notNull().default("Active"),
  progress: integer("progress").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull().defaultNow().$onUpdate(() => new Date())
});

export const roadmap = pgTable("roadmap", {
  id: uuid("id").primaryKey().defaultRandom(),
  goalId: uuid("goal_id").notNull().references(() => goal.id, { onDelete: "cascade" }),
  roadmapJson: jsonb("roadmapJson").$type<z.infer<typeof roadmapSchema>>().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const phase = pgTable("phase", {
  id: uuid("id").primaryKey().defaultRandom(),
  goalId: uuid("goal_id").notNull().references(() => goal.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  status: statusEnum("status").notNull().default("Pending"),
  orderIndex: integer("order_index").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const starredResource = pgTable("starred_resource", {
  id: uuid("id").primaryKey().defaultRandom(),
  goalId: uuid("goal_id").notNull().references(() => goal.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  url: text("url").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull().defaultNow().$onUpdate(() => new Date())
})
