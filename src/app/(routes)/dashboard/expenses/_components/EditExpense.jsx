"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { db } from "../../../../../../utils/dbConfig";
import { Expenses } from "../../../../../../utils/schema";
import { eq } from "drizzle-orm";
import { toast } from "sonner";

function EditExpense({ expenseInfo, refreshData }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (expenseInfo) {
      setName(expenseInfo.name);
      setAmount(expenseInfo.amount);
    }
  }, [expenseInfo]);

  const onUpdateExpense = async () => {
    const numericAmount = Number(amount);
    if (!name || isNaN(numericAmount) || numericAmount <= 0) {
      toast.error("Please enter a valid name and amount");
      return;
    }

    try {
      await db
        .update(Expenses)
        .set({
          name: name.trim(),
          amount: numericAmount,
        })
        .where(eq(Expenses.id, expenseInfo.id))
        .returning();

      toast.success("Expense updated!");
      refreshData();
    } catch {
      toast.error("Failed to update expense");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Expense</DialogTitle>
          <DialogDescription>
            <div className="mt-5">
              <div className="mb-4">
                <h2 className="text-black font-medium my-1">Expense Name</h2>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <h2 className="text-black font-medium my-1">Expense Amount</h2>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button disabled={!(name && amount)} onClick={onUpdateExpense}>
              Update Expense
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditExpense;
