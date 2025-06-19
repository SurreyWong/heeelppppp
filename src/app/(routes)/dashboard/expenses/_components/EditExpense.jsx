"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { db } from "../../../../../../utils/dbConfig";
import { Expenses } from "../../../../../../utils/schema";
import { eq } from "drizzle-orm";
import { toast } from "sonner";

function EditExpense({ expense, refreshData, children }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(expense.name);
  const [amount, setAmount] = useState(expense.amount);

  useEffect(() => {
    setName(expense.name);
    setAmount(expense.amount);
  }, [expense]);

  const handleUpdate = async () => {
    if (!name || isNaN(amount) || amount <= 0) {
      toast.error("Enter valid name and amount");
      return;
    }

    await db
      .update(Expenses)
      .set({
        name: name.trim(),
        amount: Number(amount),
      })
      .where(eq(Expenses.id, expense.id));

    toast.success("Expense updated!");
    refreshData();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Expense</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Amount (RM)</label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>
        </DialogDescription>
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button onClick={handleUpdate}>Update</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditExpense;
