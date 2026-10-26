const express = require("express");
const router = express.Router();

const {getExpenses, createExpense, getExpenseById, updateExpense, deleteExpense,} = require("../controller/expenseController");

router.route("/").get(getExpenses).post(createExpense);
router.route("/:id").get(getExpenseById).put(updateExpense).delete(deleteExpense);
module.exports = router;

