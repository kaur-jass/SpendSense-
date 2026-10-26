const MIN_TARGET = 2000;
const MAX_TARGET = 2500;

const REDUCTION_RATE = 0.10;
const MAX_INCREASE_RATE = 0.10;

const planNextBudget = ({
  currentBudget,
  actualSpent,
  essentialExpensesCovered,
}) => {
  // Validate inputs
  if (
    !Number.isFinite(currentBudget) ||
    currentBudget <= 0 ||
    !Number.isFinite(actualSpent) ||
    actualSpent < 0
  ) {
    throw new Error("Budget and spending must be valid non-negative numbers.");
  }

  if (typeof essentialExpensesCovered !== "boolean") {
    throw new Error("Please specify whether essential expenses are covered.");
  }

  let suggestedBudget;
  let reason;

  // Rule 1: Do not reduce if essential expenses are not covered.
  if (!essentialExpensesCovered) {
    suggestedBudget = currentBudget;
    reason = "Maintain the budget because essential expenses need coverage.";
  }

  // Rule 2: If spending exceeded the current budget, avoid further cuts.
  else if (actualSpent > currentBudget) {
    suggestedBudget = Math.min(
      actualSpent,
      currentBudget * (1 + MAX_INCREASE_RATE)
    );

    reason =
      "Spending exceeded the budget, so the next budget should not be reduced.";
  }

  // Rule 3: If the budget is already within the target range, maintain it.
  else if (
    currentBudget >= MIN_TARGET &&
    currentBudget <= MAX_TARGET
  ) {
    suggestedBudget = currentBudget;
    reason = "The current budget is already within your target range.";
  }

  // Rule 4: Gradually reduce the budget when spending is comfortably within it.
  else if (actualSpent <= currentBudget * 0.8) {
    suggestedBudget = currentBudget * (1 - REDUCTION_RATE);

    // Do not reduce below the maximum target in one step.
    if (currentBudget > MAX_TARGET) {
      suggestedBudget = Math.max(suggestedBudget, MAX_TARGET);
    }

    reason =
      "Spending stayed comfortably within budget, so a gradual reduction is suggested.";
  }

  // Rule 5: Otherwise, maintain the existing budget.
  else {
    suggestedBudget = currentBudget;
    reason =
      "Spending was close to the budget, so maintaining it is safer.";
  }

  suggestedBudget = Math.round(suggestedBudget);

  return {
    currentBudget,
    actualSpent,
    suggestedBudget,
    reduction: currentBudget - suggestedBudget,
    targetRange: {
      minimum: MIN_TARGET,
      maximum: MAX_TARGET,
    },
    essentialExpensesCovered,
    reason,
  };
};

module.exports = { planNextBudget };