import React from "react";
import EditExpense from "../_components/EditExpense"; // relative path to the new component

function ExpenseListTable({ expensesList = [], refreshData }) {
  return (
    <table className="w-full mt-5 text-left border-collapse">
      <thead>
        <tr>
          <th className="border-b p-2">Name</th>
          <th className="border-b p-2">Amount</th>
          <th className="border-b p-2">Date</th>
        </tr>
      </thead>
      <tbody>
        {Array.isArray(expensesList) && expensesList.length > 0 ? (
          expensesList.map((expense) => (
            <tr key={expense.id}>
              <td className="border-b p-2">{expense.name}</td>
              <td className="border-b p-2">{expense.amount}</td>
              <td className="border-b p-2">{expense.createdAt}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="3" className="text-center p-4">No expenses found.</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}




export default ExpenseListTable;
