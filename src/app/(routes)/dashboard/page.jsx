'use client';
import React, { useState, useEffect } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import CardInfo from "./_components/CardInfo";
import BarChartDashboard from "./_components/BarChartDashboard";
import { db } from "../../../../utils/dbConfig";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { Budgets, Expenses, Incomes } from "../../../../utils/schema";
import BudgetItem from "./budgets/_components/BudgetItem";


function Dashboard() {
  const { user } = useUser();
  const [budgetList, setBudgetList] = useState([]);
  const [incomeList, setIncomeList] = useState([]);
  const [expenseList, setExpensesList] = useState([]);
  const [selectedBudgetId, setSelectedBudgetId] = useState(null);

  useEffect(() => {
    user && getBudgetList();
  }, [user]);

  const getBudgetList = async () => {
    const result = await db
      .select({
        ...getTableColumns(Budgets),
        totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
        totalItem: sql`count(${Expenses.id})`.mapWith(Number),
      })
      .from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
      .groupBy(Budgets.id)
      .orderBy(desc(Budgets.id));

    setBudgetList(result);
    getIncomeList();
    getExpensesByBudget(null); // Load all expenses initially
  };

  const getExpensesByBudget = async (budgetId) => {
    let query = db
      .select({
        id: Expenses.id,
        name: Expenses.name,
        amount: Expenses.amount,
        createdAt: Expenses.createdAt,
        budgetId: Expenses.budgetId,
      })
      .from(Budgets)
      .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
      .orderBy(desc(Expenses.id));

    if (budgetId) {
      query = query.where(eq(Expenses.budgetId, budgetId));
    }

    const result = await query;
    setExpensesList(result);
  };

  const getIncomeList = async () => {
    try {
      const result = await db
        .select({
          ...getTableColumns(Incomes),
          totalAmount: sql`SUM(CAST(${Incomes.amount} AS NUMERIC))`.mapWith(Number),
        })
        .from(Incomes)
        .groupBy(Incomes.id);

      setIncomeList(result);
    } catch (error) {
      console.error("Error fetching income list:", error);
    }
  };

  return (
    <div className="p-8">
      <h2 className="font-bold text-4xl">Hi, {user?.fullName}</h2>
      <p className="font-bold">Let's manage your expenses</p>

      <CardInfo budgetList={budgetList} incomeList={incomeList} />

      <div className="grid grid-cols-1 lg:grid-cols-3 mt-6 gap-5">
        <div className="lg:col-span-2">
          <BarChartDashboard budgetList={budgetList} />
        </div>

        <div className="grid gap-5">
          <h2 className="font-bold text-lg">Latest Budgets</h2>
          {budgetList?.length > 0 ? (
            budgetList.map((budget, index) => (
              <div
  key={index}
  className="cursor-pointer"
  onClick={() => {
    console.log("Clicked budget:", budget.id);
    setSelectedBudgetId(budget.id);
    getExpensesByBudget(budget.id);
  }}
>
  <BudgetItem budget={budget} />
</div>

            ))
          ) : (
            [1, 2, 3, 4].map((items, index) => (
              <div key={index} className="h-[180px] w-full bg-slate-200 lg animate-pulse" />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
