const Budget = require("../models/Budget");
const Expense = require("../models/Expense");
const { planNextBudget } = require("../services/budgetPlanner");

const suggestNextBudget = async (req, res) => {
  try {
    const { month, essentialExpensesCovered } = req.body;

    if (
      typeof month !== "string" ||
      !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)
    ) {
      return res.status(400).json({
        success: false,
        message: "Month must use YYYY-MM format.",
      });
    }

    if (typeof essentialExpensesCovered !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "essentialExpensesCovered must be true or false.",
      });
    }

    const budget = await Budget.findOne({ month });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "No budget found for this month.",
      });
    }

    const [year, monthNumber] = month.split("-").map(Number);

    const start = new Date(Date.UTC(year, monthNumber - 1, 1));
    const end = new Date(Date.UTC(year, monthNumber, 1));

    const expenses = await Expense.find({
      date: { $gte: start, $lt: end },
    });

    const actualSpent = expenses.reduce(
      (total, expense) => total + expense.amount,
      0
    );

    const recommendation = planNextBudget({
      currentBudget: budget.totalBudget,
      actualSpent,
      essentialExpensesCovered,
    });

    return res.status(200).json({
      success: true,
      message: "Budget recommendation generated.",
      data: {
        month,
        ...recommendation,
        requiresUserApproval: true,
      },
    });
  } catch (error) {
    console.error("Budget planner error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to generate budget recommendation.",
    });
  }
};

module.exports = { suggestNextBudget };