import AddExpenseForm from "./_components/AddExpenseForm";
import ExpensesList from "./_components/ExpensesList";

export default function ExpensesPage() {
  return (
    <div className="max-w-2xl mx-auto p-5">
      <AddExpenseForm />
      <ExpensesList />
    </div>
  );
}
