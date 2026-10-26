const Budget = require("../models/Budget");
const Expense = require("../models/Expense");

const CATEGORIES = [
  "Food",
  "Snacks",
  "Shopping",
  "Travel",
  "Education",
  "Bills",
  "Healthcare",
  "Miscellaneous",
];

const isValidMonth = (month) =>
  typeof month === "string" &&
  /^\d{4}-(0[1-9]|1[0-2])$/.test(month);

const getMonthRange = (month) => {
  const [year, monthNumber] = month.split("-").map(Number);

  return {
    start: new Date(Date.UTC(year, monthNumber - 1, 1)),
    end: new Date(Date.UTC(year, monthNumber, 1)),
  };
};

// POST /api/budgets
const createOrUpdateBudget = async (req, res) => {
  try {
    const { month, totalBudget, categoryBudgets = {} } = req.body;

    if (!isValidMonth(month)) {
      return res.status(400).json({
        success: false,
        message: "Month must use YYYY-MM format.",
      });
    }

    if (
      typeof totalBudget !== "number" ||
      !Number.isFinite(totalBudget) ||
      totalBudget <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Total budget must be a positive number.",
      });
    }

    if (
      !categoryBudgets ||
      typeof categoryBudgets !== "object" ||
      Array.isArray(categoryBudgets)
    ) {
      return res.status(400).json({
        success: false,
        message: "Category budgets must be an object.",
      });
    }

    for (const [category, amount] of Object.entries(categoryBudgets)) {
      if (!CATEGORIES.includes(category)) {
        return res.status(400).json({
          success: false,
          message: `Invalid category: ${category}`,
        });
      }

      if (
        typeof amount !== "number" ||
        !Number.isFinite(amount) ||
        amount < 0
      ) {
        return res.status(400).json({
          success: false,
          message: `Invalid budget for ${category}.`,
        });
      }
    }

    const allocatedTotal = Object.values(categoryBudgets).reduce(
      (sum, amount) => sum + amount,
      0
    );

    if (allocatedTotal > totalBudget) {
      return res.status(400).json({
        success: false,
        message: "Category budgets cannot exceed the total budget.",
      });
    }

    const budget = await Budget.findOneAndUpdate(
      { month },
      { totalBudget, categoryBudgets },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Budget saved successfully.",
      data: budget,
    });
  } catch (error) {
    console.error("Budget save error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to save budget.",
    });
  }
};

// GET /api/budgets/:month
const getBudgetProgress = async (req, res) => {
  try {
    const { month } = req.params;

    if (!isValidMonth(month)) {
      return res.status(400).json({
        success: false,
        message: "Month must use YYYY-MM format.",
      });
    }

    const budget = await Budget.findOne({ month });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "No budget found for this month.",
      });
    }

    const { start, end } = getMonthRange(month);

    const expenses = await Expense.find({
      date: { $gte: start, $lt: end },
    });

    const spentByCategory = Object.fromEntries(
      CATEGORIES.map((category) => [category, 0])
    );

    let totalSpent = 0;

    for (const expense of expenses) {
      totalSpent += expense.amount;
      spentByCategory[expense.category] =
        (spentByCategory[expense.category] || 0) + expense.amount;
    }

    const categoryLimits =
      budget.categoryBudgets instanceof Map
        ? Object.fromEntries(budget.categoryBudgets)
        : budget.categoryBudgets.toObject
          ? budget.categoryBudgets.toObject()
          : budget.categoryBudgets;

    const categoryProgress = {};

    for (const category of CATEGORIES) {
      const limit = categoryLimits[category] ?? 0;
      const spent = spentByCategory[category];

      categoryProgress[category] = {
        budget: limit,
        spent,
        remaining: limit - spent,
        percentageUsed:
          limit > 0 ? Number(((spent / limit) * 100).toFixed(2)) : null,
      };
    }

    res.status(200).json({
      success: true,
      data: {
        month,
        totalBudget: budget.totalBudget,
        totalSpent: Number(totalSpent.toFixed(2)),
        remaining: Number((budget.totalBudget - totalSpent).toFixed(2)),
        percentageUsed: Number(
          ((totalSpent / budget.totalBudget) * 100).toFixed(2)
        ),
        categoryProgress,
      },
    });
  } catch (error) {
    console.error("Budget progress error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to calculate budget progress.",
    });
  }
};

// GET /api/budgets/:month/allowance
const getDailyAllowance = async (req, res) => {
  try {
    const { month } = req.params;

    if (!isValidMonth(month)) {
      return res.status(400).json({
        success: false,
        message: "Month must use YYYY-MM format.",
      });
    }

    const budget = await Budget.findOne({ month });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "No budget found for this month.",
      });
    }

    const { start, end } = getMonthRange(month);

    const expenses = await Expense.find({
      date: { $gte: start, $lt: end },
    });

    const totalSpent = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    const remainingBudget = budget.totalBudget - totalSpent;

    // Use the current date for the current month.
    // For a future month, calculate using its first day.
    const now = new Date();
    const [year, monthNumber] = month.split("-").map(Number);

    const isCurrentMonth =
      now.getFullYear() === year && now.getMonth() + 1 === monthNumber;

    const isPastMonth =
      new Date(year, monthNumber - 1, 1) <
      new Date(now.getFullYear(), now.getMonth(), 1);

    if (isPastMonth) {
      return res.status(400).json({
        success: false,
        message: "Daily allowance is only available for the current or a future month.",
      });
    }

    const referenceDate = isCurrentMonth
      ? now
      : new Date(year, monthNumber - 1, 1);

    const daysInMonth = new Date(year, monthNumber, 0).getDate();

    const daysRemaining = isCurrentMonth
      ? daysInMonth - now.getDate() + 1
      : daysInMonth;

    const dailyAllowance =
      remainingBudget > 0
        ? Number((remainingBudget / daysRemaining).toFixed(2))
        : 0;

    res.status(200).json({
      success: true,
      data: {
        month,
        totalBudget: budget.totalBudget,
        totalSpent: Number(totalSpent.toFixed(2)),
        remainingBudget: Number(remainingBudget.toFixed(2)),
        daysRemaining,
        dailyAllowance,
        isOverBudget: remainingBudget < 0,
        message:
          remainingBudget < 0
            ? "You have exceeded your monthly budget."
            : `You can spend approximately ₹${dailyAllowance} per day.`,
      },
    });
  } catch (error) {
    console.error("Daily allowance error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to calculate daily allowance.",
    });
  }
};

module.exports = {
  createOrUpdateBudget,
  getBudgetProgress,
  getDailyAllowance,
};