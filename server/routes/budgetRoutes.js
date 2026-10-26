const express = require("express");
const router = express.Router();

const {createOrUpdateBudget, getBudgetProgress,getDailyAllowance} = require("../controller/budgetController");
const {suggestNextBudget} = require("../controller/budgetPlannerController");
const {getBudgetRisk} = require("../controller/budgetRiskController");


router.post("/", createOrUpdateBudget);
router.post("/plan", suggestNextBudget);
router.get("/:month/allowance", getDailyAllowance);
router.get("/:month/risk", getBudgetRisk);
router.get("/:month", getBudgetProgress);

module.exports = router;