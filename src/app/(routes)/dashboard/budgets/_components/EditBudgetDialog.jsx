"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EmojiPicker from "emoji-picker-react";
import { Pencil } from "lucide-react";
import { db } from "../../../../../../utils/dbConfig";
import { Budgets } from "../../../../../../utils/schema";
import { eq } from "drizzle-orm";
import { toast } from "sonner";

function EditBudgetDialog({ budget, refreshData }) {
  const [open, setOpen] = useState(false);
  const [emojiIcon, setEmojiIcon] = useState(budget.icon);
  const [name, setName] = useState(budget.name);
  const [amount, setAmount] = useState(budget.amount);
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);

  const handleUpdate = async () => {
    await db
      .update(Budgets)
      .set({
        icon: emojiIcon,
        name,
        amount,
      })
      .where(eq(Budgets.id, budget.id));

    toast("Budget updated");
    refreshData();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Pencil className="w-4 h-4 text-blue-500 cursor-pointer" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Budget</DialogTitle>
          <DialogDescription>
            <div className="mt-4 space-y-4">
              <Button
                variant="outline"
                onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
              >
                {emojiIcon}
              </Button>
              {openEmojiPicker && (
                <div className="absolute z-20">
                  <EmojiPicker
                    onEmojiClick={(e) => {
                      setEmojiIcon(e.emoji);
                      setOpenEmojiPicker(false);
                    }}
                  />
                </div>
              )}
              <div>
                <h2 className="text-sm font-medium mb-1">Budget Name</h2>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <h2 className="text-sm font-medium mb-1">Budget Amount</h2>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <Button
                disabled={!name || !amount}
                onClick={handleUpdate}
                className="w-full rounded-full mt-4"
              >
                Update Budget
              </Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default EditBudgetDialog;
