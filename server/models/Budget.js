const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
  {
    month: {
      type: String,
      required: true,
      match: /^\d{4}-(0[1-9]|1[0-2])$/,
    },

    totalBudget: {
      type: Number,
      required: true,
      min: 1,
    },

    categoryBudgets: {
      type: Map,
      of: {
        type: Number,
        min: 0,
      },
      default: {},
    },
  },
  { timestamps: true }
);

budgetSchema.index({ month: 1 }, { unique: true });

module.exports = mongoose.model("Budget", budgetSchema);