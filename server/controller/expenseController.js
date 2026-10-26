const Expense = require("../models/Expense");

// GET /api/expenses
const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch expenses",
    });
  }
};

// POST /api/expenses
const createExpense = async (req, res) => {
  try {
    const { title, amount, category, date, notes } = req.body;

    const expense = await Expense.create({
      title,
      amount,
      category,
      date,
      notes,
    });

    res.status(201).json({
      success: true,
      message: "Expense created successfully",
      data: expense,
    });
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create expense",
    });
  }
};

// GET /api/expenses/:id
const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.status(200).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid expense ID",
    });
  }
};

// PUT /api/expenses/:id
const updateExpense = async (req, res) => {
  try {
    const allowedFields = ["title", "amount", "category", "date", "notes"];
    const updates = {};

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updates[field] = req.body[field];
      }
    }

    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      data: expense,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE /api/expenses/:id
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid expense ID",
    });
  }
};

module.exports = {
  getExpenses,
  createExpense,
  getExpenseById,
  updateExpense,
  deleteExpense,
};
