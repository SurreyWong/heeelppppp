import {
    integer, numeric, pgTable, serial, varchar
} from 'drizzle-orm/pg-core'

//import { pgTable, integer, serial, text, timestamp } from 'drizzle-orm/pg-core';

//budget schema
export const Budgets = pgTable("budgets", {
    id: serial("id").primaryKey(),
    name: varchar("name").notNull(),
    amount: numeric("amount").notNull().default(0),
    icon: varchar("icon"),
    createdBy: varchar("createdBy").notNull(),
  });
  
  export const Incomes = pgTable("incomes", {
    id: serial("id").primaryKey(),
    name: varchar("name").notNull(),
    amount: numeric("amount").notNull(),
    icon: varchar("icon"),
    createdBy: varchar("createdBy").notNull(),
  });
  export const Expenses = pgTable("expenses", {
    id: serial("id").primaryKey(),
    name: varchar("name").notNull(),
    amount: numeric("amount").notNull().default(0),
    budgetId: integer("budgetId").references(() => Budgets.id),
    createdAt: varchar("createdAt").notNull(),
    createdBy: varchar("createdBy").notNull(),
  });
  export const Achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: varchar("userId").notNull(),
  name: varchar("name").notNull(),
  earned: integer("earned").notNull().default(0),
  claimed: integer("claimed").notNull().default(0),
  progress: integer("progress").notNull().default(0),  // <-- new column for current progress
  target: integer("target").notNull().default(0), 
});
