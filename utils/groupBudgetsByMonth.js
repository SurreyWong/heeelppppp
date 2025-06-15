import { format } from "date-fns";

export function groupBudgetsByMonth(budgets) {
  const grouped = {};

  budgets.forEach((budget) => {
    const month = format(new Date(budget.createdAt), "MMM yyyy");
    if (!grouped[month]) {
      grouped[month] = {
        month,
        totalSpend: 0,
        amount: 0,
      };
    }

    grouped[month].amount += Number(budget.amount);
    grouped[month].totalSpend += Number(budget.totalSpend ?? 0);
  });

  return Object.values(grouped);
}
