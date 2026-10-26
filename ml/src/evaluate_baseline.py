from pathlib import Path

import numpy as np
import pandas as pd
from ml.src.evaluation.metrics import (
    mean_absolute_error,
    r_squared,
    root_mean_squared_error,
)

PROJECT_ROOT = Path(__file__).resolve().parents[2]
DATA_FILE = PROJECT_ROOT / "ml" / "data" / "monthly_training_data.csv"


def main():
    data = pd.read_csv(DATA_FILE)
    data["month"] = pd.to_datetime(data["month"])
    data = data.sort_values("month").reset_index(drop=True)

    if len(data) < 4:
        raise ValueError("At least four months are required.")

    # Evaluate target months (index 3 onward).
    actual = data.iloc[3:]["total_expenses"].to_numpy(dtype=float)

    # Predict each month using the previous month's actual expenses (naive baseline).
    predicted = (
        data.iloc[2 : len(data) - 1]["total_expenses"].to_numpy(dtype=float)
    )

    print("\nSpendSense: Naive Baseline Evaluation")
    print("=" * 42)

    for index, row_index in enumerate(range(3, len(data))):
        month = data.loc[row_index, "month"]
        print(f"\nMonth: {month:%B %Y}")
        print(f"Actual expenses: ₹{actual[index]:,.2f}")
        print(f"Baseline prediction: ₹{predicted[index]:,.2f}")
        print(f"Absolute error: ₹{abs(actual[index] - predicted[index]):,.2f}")

    print("\n" + "=" * 42)
    print("Baseline Metrics")
    print("=" * 42)
    print(f"MAE:  ₹{mean_absolute_error(actual, predicted):,.2f}")
    print(f"RMSE: ₹{root_mean_squared_error(actual, predicted):,.2f}")

    if np.ptp(actual) == 0:
        print("R²:   Undefined because actual values are constant.")
    else:
        print(f"R²:   {r_squared(actual, predicted):.4f}")


if __name__ == "__main__":
    main()