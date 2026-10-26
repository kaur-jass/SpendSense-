const axios = require("axios");
const Expense = require("../models/Expense");

/**
 * Controller to fetch monthly expense predictions from the Python ML service using combined CSV and MongoDB data.
 * @route GET /api/predictions/:month
 */
const getMonthlyPrediction = async (req, res) => {
  try {
    const { month } = req.params;

    // Validate YYYY-MM format
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
      return res.status(400).json({
        success: false,
        message: "Month must use YYYY-MM format.",
      });
    }

    const [year, monthNumber] = month.split("-").map(Number);
    const targetDate = new Date(Date.UTC(year, monthNumber - 1, 1));

    // 1. Load historical monthly totals from the existing CSV via ML API
    const csvResponse = await axios.get(
      `${process.env.ML_API_URL || "http://127.0.0.1:8000"}/historical-data`,
      { timeout: 15000 }
    );

    const historicalMonths = csvResponse.data.data.months;

    // 2. Retrieve expenses recorded before the requested month from MongoDB
    const expenses = await Expense.aggregate([
      {
        $match: {
          date: { $lt: targetDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          total: { $sum: "$amount" },
        },
      },
    ]);

    // 3. Combine historical data and MongoDB monthly totals
    const monthlyTotals = new Map();

    for (const item of historicalMonths) {
      monthlyTotals.set(item.month, item.total_expenses);
    }

    for (const expense of expenses) {
      const key = `${expense._id.year}-${String(
        expense._id.month
      ).padStart(2, "0")}`;

      // Replace historical totals for months represented in MongoDB
      // to avoid counting the same month's spending twice
      monthlyTotals.set(key, expense.total);
    }

    // Exclude the requested month and all later months
    const trainingMonths = [...monthlyTotals.entries()]
      .filter(([key]) => key < month)
      .sort(([a], [b]) => a.localeCompare(b));

    if (trainingMonths.length < 3) {
      return res.status(400).json({
        success: false,
        message: "At least three historical months are required.",
      });
    }

    // 4. Send the combined monthly totals to the Python model
    const response = await axios.post(
      `${process.env.ML_API_URL || "http://127.0.0.1:8000"}/predict`,
      {
        monthly_expenses: trainingMonths.map(([, total]) => total),
      },
      { timeout: 15000 }
    );

    return res.status(200).json({
      success: true,
      requestedMonth: month,
      historicalMonthsUsed: trainingMonths.length,
      data: response.data.data,
    });
  } catch (error) {
    console.error(
      "Monthly prediction error:",
      error.response?.data || error.message
    );

    return res.status(502).json({
      success: false,
      message: "Could not generate a prediction.",
      detail: error.response?.data?.detail || error.message,
    });
  }
};

module.exports = { getMonthlyPrediction };