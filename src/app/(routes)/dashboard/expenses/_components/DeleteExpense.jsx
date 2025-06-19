"use client";

import React from "react";
import { db } from "../../../../../../utils/dbConfig";
import { Expenses } from "../../../../../../utils/schema";
import { eq } from "drizzle-orm";
import { toast } from "sonner";

function DeleteExpense({ expenseId, refreshData, children }) {
  const handleDelete = async (e) => {
    e.stopPropagation();

    await db.delete(Expenses).where(eq(Expenses.id, expenseId));
    toast.success("Expense deleted");
    refreshData();
  };

  return <span onClick={handleDelete}>{children}</span>;
}

export default DeleteExpense;
