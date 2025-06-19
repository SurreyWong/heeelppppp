"use client";
import React, { useEffect, useState } from "react";
import CreateIncome from "./CreateIncomes"; 
import { db } from "../../../../../../utils/dbConfig";
import { desc, eq, getTableColumns } from "drizzle-orm";
import { Incomes } from "../../../../../../utils/schema";
import { useUser } from "@clerk/nextjs";
import IncomeItem from "./IncomeItem"; 
import {toast} from "sonner";
import EditIncomeDialog from "./EditIncomeDialog";

function IncomeList() {
  const [incomeList, setIncomeList] = useState([]);
  const [editIncome, setEditIncome] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    user && getIncomeList();
  }, [user]);

  const getIncomeList = async () => {
    const result = await db
      .select({
        ...getTableColumns(Incomes),
      })
      .from(Incomes)
      .where(eq(Incomes.createdBy, user?.primaryEmailAddress?.emailAddress))
      .orderBy(desc(Incomes.id));

    setIncomeList(result);
  };

  const deleteIncome = async (id) => {
    await db.delete(Incomes).where(eq(Incomes.id, id));
    toast("Income deleted");
    getIncomeList();
  };

  return (
    <div className="mt-7">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <CreateIncome refreshData={getIncomeList} />
        {incomeList.length > 0
          ? incomeList.map((income, index) => (
              <IncomeItem
                key={index}
                income={income}
                onEdit={setEditIncome}
                onDelete={deleteIncome}
              />
            ))
          : [1, 2, 3].map((_, index) => (
              <div
                key={index}
                className="w-full bg-slate-200 rounded-lg h-[150px] animate-pulse"
              ></div>
            ))}
      </div>

      {editIncome && (
        <EditIncomeDialog
          income={editIncome}
          onClose={() => setEditIncome(null)}
          onUpdated={getIncomeList}
        />
      )}
    </div>
  );
}

export default IncomeList;
