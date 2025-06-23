"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { db } from "../../../../../../utils/dbConfig";
import { Budgets, Expenses } from "../../../../../../utils/schema";
import { eq } from "drizzle-orm";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

function AddExpenseForm({ refreshData }) {
  const { user } = useUser();
  const [budgetList, setBudgetList] = useState([]);
  const [selectedBudgetId, setSelectedBudgetId] = useState("");
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");

  useEffect(() => {
    const fetchBudgets = async () => {
      if (user?.primaryEmailAddress?.emailAddress) {
        const result = await db
          .select()
          .from(Budgets)
          .where(eq(Budgets.createdBy, user.primaryEmailAddress.emailAddress));
        setBudgetList(result);
      }
    };

    fetchBudgets();
  }, [user]);

  const handleAddExpense = async () => {
  try {
    if (!expenseName || !expenseAmount || !selectedBudgetId) {
      toast.error("Please fill in all fields.");
      return;
    }

    const today = new Date().toISOString().slice(0, 10);

    const todayExpenses = await db
      .select()
      .from(Expenses)
      .where(eq(Expenses.createdBy, user?.primaryEmailAddress?.emailAddress));

    const hasExpenseToday = todayExpenses.some(
      (exp) => exp.createdAt.slice(0, 10) === today
    );

    console.log("Has Expense Today:", hasExpenseToday);

    // Start debugging
    console.log("Inserting expense...");
    await db.insert(Expenses).values({
      name: expenseName,
      amount: Number(expenseAmount),
      budgetId: Number(selectedBudgetId),
      createdAt: new Date().toISOString(),
      createdBy: user?.primaryEmailAddress?.emailAddress,
    });
    console.log("Expense inserted successfully");
    // Stop debugging


    if (!hasExpenseToday) {
      const quotes = [
        "Your wallet will thank you later!",
        "Saving is a habit and YOU SLAAAAAAAAAYYYYYY!",
        "You are in control of your own money!",
        "A budget is telling your money where it go instead of where it went",
        "Just a little time you spend here will lead to big changes",
      ];
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      toast.info(randomQuote);
    }

    setExpenseName("");
    setExpenseAmount("");
    setSelectedBudgetId("");
    refreshData && refreshData();
  } catch (error) {
    console.error("Add Expense Error:", error);
    toast.error("Failed to add expense.");
  }
};


  return (
    <div className="mt-5 border p-5 rounded-xl">
      <h2 className="text-xl font-semibold mb-3">Add New Expense</h2>
      <div className="grid gap-3">
        <Input
          placeholder="Expense Name"
          value={expenseName}
          onChange={(e) => setExpenseName(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Amount (e.g. 20)"
          value={expenseAmount}
          onChange={(e) => setExpenseAmount(e.target.value)}
        />
        <select
          value={selectedBudgetId}
          onChange={(e) => setSelectedBudgetId(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">-- Select a Budget --</option>
          {budgetList.map((budget) => (
            <option key={budget.id} value={budget.id}>
              {budget.name}
            </option>
          ))}
        </select>
        <Button onClick={handleAddExpense}>Add Expense</Button>
      </div>
    </div>
  );
}

export default AddExpenseForm;
