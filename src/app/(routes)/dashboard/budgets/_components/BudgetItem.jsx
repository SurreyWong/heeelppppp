import Link from "next/link";
import React from "react";
import EditBudgetDialog from "./EditBudgetDialog";
import { Trash } from "lucide-react";
import { db } from "../../../../../../utils/dbConfig";
import { Budgets } from "../../../../../../utils/schema";
import { eq } from "drizzle-orm";
import { toast } from "sonner";

function BudgetItem({ budget, refreshData }) {
  const calculateProgressPerc = () => {
    const perc = (budget.totalSpend / budget.amount) * 100;
    return perc > 100 ? 100 : perc.toFixed(2);
  };

  const handleDelete = async () => {
    await db.delete(Budgets).where(eq(Budgets.id, budget.id));
    toast("Budget deleted");
    refreshData();
  };

  return (
    <div className="p-5 border rounded-2xl hover:shadow-md cursor-pointer h-[190px] relative">
      <div className="absolute right-3 top-3 flex gap-2">
        <EditBudgetDialog budget={budget} refreshData={refreshData} />
        <Trash
          className="w-4 h-4 text-red-500 cursor-pointer"
          onClick={handleDelete}
        />
      </div>

      <Link href={"/dashboard/expenses/" + budget?.id} className="block mt-4">
        <div className="flex gap-2 items-center justify-between">
          <div className="flex gap-2 items-center">
            <h2 className="text-2xl p-3 px-4 bg-slate-100 rounded-full">
              {budget?.icon}
            </h2>
            <div>
              <h2 className="font-bold">{budget.name}</h2>
              <h2 className="text-sm text-gray-500">{budget.totalItem} Item</h2>
            </div>
          </div>
          <h2 className="font-bold text-gray-550 text-lg">RM{budget.amount}</h2>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs text-slate-400">
              RM{budget.totalSpend || 0} Spend
            </h2>
            <h2 className="text-xs text-slate-400">
              RM{budget.amount - budget.totalSpend} Remaining
            </h2>
          </div>
          <div className="w-full bg-slate-300 h-2 rounded-full">
            <div
              className="bg-primary h-2 rounded-full"
              style={{ width: `${calculateProgressPerc()}%` }}
            ></div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default BudgetItem;
