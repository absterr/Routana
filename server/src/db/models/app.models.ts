import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid
} from "drizzle-orm/pg-core";
import z from "zod";
import { roadmapSchema } from "../../app/roadmap.schema.js";
import { user } from "./auth.models.js";

const phaseStatusEnum = pgEnum("phase_status", ["Active", "Pending", "Completed", "Skipped"]);
const goalStatusEnum = pgEnum("goal_status", ["Active", "Pending", "Completed"]);

const resourceType = pgEnum("resource_type", ["Video", "Article", "Course", "Documentation", "Interactive"]);
const resourceCategory = pgEnum("resource_category", ["Free", "Paid"]);

export const goal = pgTable("goal", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  timeframe: text("timeframe").notNull(),
  status: goalStatusEnum("status").notNull().default("Active"),
  progress: integer("progress").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull().defaultNow().$onUpdate(() => new Date())
});

export const roadmap = pgTable("roadmap", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  goalId: uuid("goal_id").notNull().references(() => goal.id, { onDelete: "cascade" }),
  roadmapJson: jsonb("roadmapJson").$type<z.infer<typeof roadmapSchema>>().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const phase = pgTable("phase", {
  id: text("id").notNull(),
  goalId: uuid("goal_id").notNull().references(() => goal.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  status: phaseStatusEnum("status").notNull().default("Pending"),
  orderIndex: integer("order_index").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  primaryKey({ columns: [table.id, table.goalId] })
]);

export const starredResource = pgTable("starred_resource", {
  id: uuid("id").primaryKey().defaultRandom(),
  goalId: uuid("goal_id").notNull().references(() => goal.id, { onDelete: "cascade" }),
  type: resourceType("type").notNull(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  category: resourceCategory("category").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull().defaultNow().$onUpdate(() => new Date())
});
