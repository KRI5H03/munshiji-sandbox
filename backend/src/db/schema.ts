import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  numeric,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 50 }).notNull(),
  email: varchar("email").notNull().unique(),
  password: varchar("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const expenses = pgTable("expenses", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 75 }).notNull(),
  category: varchar("category", { length: 155 }).notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userRelationships = relations(users, ({ many }) => ({
  expenses: many(expenses),
}));

export const expensesRelationships = relations(expenses, ({ one }) => ({
  user: one(users, { fields: [expenses.userId], references: [users.id] }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Expenses = typeof expenses.$inferSelect;
export type NewExpenses = typeof expenses.$inferInsert;
