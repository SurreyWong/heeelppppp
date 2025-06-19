"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { db } from "../../../../../../utils/dbConfig";
import { Expenses, Budgets } from "../../../../../../utils/schema";
import { eq } from "drizzle-orm";
import EditExpense from "./EditExpense";
import DeleteExpense from "./DeleteExpense";
import { Pencil, Trash2 } from "lucide-react";

function ExpensesList() {
  const { user } = useUser();
  const [expenses, setExpenses] = useState([]);

  const fetchExpenses = async () => {
    if (user?.primaryEmailAddress?.emailAddress) {
      const result = await db
        .select({
          id: Expenses.id,
          name: Expenses.name,
          amount: Expenses.amount,
          createdAt: Expenses.createdAt,
          budgetName: Budgets.name,
        })
        .from(Expenses)
        .innerJoin(Budgets, eq(Expenses.budgetId, Budgets.id))
        .where(eq(Budgets.createdBy, user.primaryEmailAddress.emailAddress))
        .orderBy(Expenses.createdAt);
      setExpenses(result);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [user]);

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Expense History</h2>
      {expenses.length === 0 ? (
        <p className="text-gray-500">No expenses recorded yet.</p>
      ) : (
        <ul className="space-y-2">
          {expenses.map((expense) => (
            <li
              key={expense.id}
              className="border p-3 rounded flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{expense.name}</p>
                <p className="text-sm text-gray-500">
                  Category: {expense.budgetName}
                </p>
              </div>

              <div className="text-right">
                <p className="text-green-600 font-semibold">
                  - RM{expense.amount}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(expense.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex gap-3 items-center ml-4">
                <EditExpense expense={expense} refreshData={fetchExpenses}>
                  <Pencil className="w-4 h-4 text-blue-500 cursor-pointer" />
                </EditExpense>
                <DeleteExpense expenseId={expense.id} refreshData={fetchExpenses}>
                  <Trash2 className="w-4 h-4 text-red-500 cursor-pointer" />
                </DeleteExpense>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ExpensesList;
