import React from "react";
import { Pencil, Trash2 } from "lucide-react";

function IncomeItem({ income, onEdit, onDelete }) {
  return (
    <div className="p-5 border rounded-2xl hover:shadow-md cursor-pointer h-[170px]">
      <div className="flex gap-2 items-center justify-between">
        <div className="flex gap-2 items-center">
          <h2 className="text-2xl p-3 px-4 bg-slate-100 rounded-full">
            {income?.icon}
          </h2>
          <div>
            <h2 className="font-bold">{income.name}</h2>
          
          </div>
        </div>
        <h2 className="font-bold text-gray-550 text-lg">RM{income.amount}</h2>
      </div>

      <div className="mt-3 flex justify-end gap-2">
        <button onClick={() => onEdit(income)} className="text-blue-500">
          <Pencil size={18} />
        </button>
        <button onClick={() => onDelete(income.id)} className="text-red-500">
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}

export default IncomeItem;
