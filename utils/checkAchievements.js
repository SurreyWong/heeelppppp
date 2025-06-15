import { db } from './dbConfig'
import { Achievements, Budgets, Incomes, Expenses } from "../../../../../utils/schema";
import { eq } from "drizzle-orm";

export async function checkAchievements(userId) {
  const [expenses, smallExpenses, incomeTotal, categories, budgets] = await Promise.all([
    db.select().from(Expenses).where(eq(Expenses.createdBy, userId)),
    db.select().from(Expenses).where(eq(Expenses.createdBy, userId)).where(Expenses.amount.lt(50)),
    db.select().from(Incomes).where(eq(Incomes.createdBy, userId)),
    db.select().from(Budgets).where(eq(Budgets.createdBy, userId)), // Assuming categories stored in budgets for now
    db.select().from(Budgets).where(eq(Budgets.createdBy, userId)),
  ]);

  const incomeSum = incomeTotal.reduce((sum, income) => sum + parseFloat(income.amount), 0);

  const conditions = [
    { name: "First Tracker", earned: expenses.length >= 1 },
    { name: "Pennywise", earned: smallExpenses.length >= 50 },
    { name: "Income Tracker", earned: incomeSum >= 5000 },
    { name: "Explorer", earned: categories.length >= 10 },
    { name: "Budget Pro", earned: budgets.length >= 10 },
  ];

  for (const { name, earned } of conditions) {
    if (!earned) continue;
    const existing = await db
      .select()
      .from(Achievements)
      .where(eq(Achievements.userId, userId))
      .where(eq(Achievements.name, name));

    if (existing.length === 0) {
      await db.insert(Achievements).values({ userId, name, earned: 1, claimed: 0 });
    }
  }
}
