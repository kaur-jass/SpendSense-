const { assessBudgetRisk } = require("../services/budgetRiskService");

/**
 * Controller to fetch budget risk assessment for a given month.
 * @route GET /api/budget/risk/:month
 */
const getBudgetRisk = async (req, res) => {
  try {
    const { month } = req.params;

    // Validate YYYY-MM format
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
      return res.status(400).json({
        success: false,
        message: "Month must use YYYY-MM format.",
      });
    }

    const riskAssessment = await assessBudgetRisk(month);

    return res.status(200).json({
      success: true,
      message: "Budget risk assessment completed.",
      data: riskAssessment,
    });
  } catch (error) {
    console.error("Budget risk assessment error:", error);

    if (error.message === "No budget found for the selected month.") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to assess budget risk.",
    });
  }
};

module.exports = { getBudgetRisk };