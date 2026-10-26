const Expense = require("../models/Expense");
const Budget = require("../models/Budget");

/**
 * Assesses the budget risk for a specified month based on current spending rate.
 * @param {string} month - Format: "YYYY-MM"
 */
const assessBudgetRisk = async (month) => {
  const budget = await Budget.findOne({ month });
  if (!budget) {
    throw new Error("No budget found for the selected month.");
  }

  const [year, monthNumber] = month.split("-").map(Number);

  // Define date range in UTC
  const startDate = new Date(Date.UTC(year, monthNumber - 1, 1));
  const endDate = new Date(Date.UTC(year, monthNumber, 1));

  // Retrieve monthly expenses
  const expenses = await Expense.find({
    date: {
      $gte: startDate,
      $lt: endDate,
    },
  });

  const totalSpent = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  // Time calculations
  const now = new Date();
  const currentMonth =
    now.getUTCFullYear() === year && now.getUTCMonth() + 1 === monthNumber;

  const isPastMonth =
    year < now.getUTCFullYear() ||
    (year === now.getUTCFullYear() && monthNumber < now.getUTCMonth() + 1);

  // Fetch total days in the target month
  const daysInMonth = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate();

  const daysElapsed = currentMonth
    ? now.getUTCDate()
    : isPastMonth
    ? daysInMonth
    : 0;

  // Projection calculations
  const dailySpending = daysElapsed > 0 ? totalSpent / daysElapsed : 0;

  const projectedSpending =
    daysElapsed > 0
      ? Math.round(dailySpending * daysInMonth * 100) / 100
      : 0;

  const budgetUsagePercentage = (totalSpent / budget.totalBudget) * 100;

  // Determine risk level and reasoning
  let risk;
  let reason;

  if (totalSpent >= budget.totalBudget) {
    risk = "HIGH";
    reason = "Your spending has reached or exceeded your budget.";
  } else if (daysElapsed > 0 && projectedSpending > budget.totalBudget) {
    risk = "HIGH";
    reason = "Your current spending rate projects an overspend.";
  } else if (daysElapsed > 0 && projectedSpending >= budget.totalBudget * 0.8) {
    risk = "MEDIUM";
    reason = "Your projected spending is approaching the budget limit.";
  } else {
    risk = "LOW";
    reason =
      currentMonth || isPastMonth
        ? "Your spending is currently within the budget."
        : "No spending has been recorded yet for this future month.";
  }

  return {
    month,
    totalBudget: budget.totalBudget,
    totalSpent: Math.round(totalSpent * 100) / 100,
    remainingBudget:
      Math.round((budget.totalBudget - totalSpent) * 100) / 100,
    budgetUsagePercentage: Math.round(budgetUsagePercentage * 100) / 100,
    projectedSpending,
    risk,
    reason,
    assessmentType: "rule-based estimate",
  };
};

module.exports = { assessBudgetRisk };