from pathlib import Path

import numpy as np
import pandas as pd
from ml.src.evaluation.metrics import (
    mean_absolute_error,
    r_squared,
    root_mean_squared_error,
)
from ml.src.services.prediction_service import predict_next_month

PROJECT_ROOT = Path(__file__).resolve().parents[2]
DATA_FILE = PROJECT_ROOT / "ml" / "data" / "monthly_training_data.csv"


def main():
    if not DATA_FILE.exists():
        raise FileNotFoundError(
            "Monthly training data not found. "
            "Run python -m ml.src.prepare_training_data first."
        )

    data = pd.read_csv(DATA_FILE)
    data["month"] = pd.to_datetime(data["month"])
    data = data.sort_values("month").reset_index(drop=True)

    if len(data) < 4:
        raise ValueError(
            "At least four months are required for this evaluation."
        )

    actual_values = []
    predicted_values = []

    print("\nSpendSense: Walk-Forward Evaluation")
    print("=" * 42)

    # Train only on earlier months and predict the next month.
    for test_index in range(3, len(data)):
        training_data = data.iloc[:test_index].copy()
        test_row = data.iloc[test_index]

        result = predict_next_month(training_data)

        actual = float(test_row["total_expenses"])
        predicted = float(result["predicted_expenses"])

        actual_values.append(actual)
        predicted_values.append(predicted)

        print(f"\nTraining through: {training_data.iloc[-1]['month']:%B %Y}")
        print(f"Month predicted:  {test_row['month']:%B %Y}")
        print(f"Actual expenses:  ₹{actual:,.2f}")
        print(f"Predicted:        ₹{predicted:,.2f}")
        print(f"Absolute error:   ₹{abs(actual - predicted):,.2f}")

    actual_array = np.asarray(actual_values, dtype=float)
    predicted_array = np.asarray(predicted_values, dtype=float)

    print("\n" + "=" * 42)
    print("Overall Evaluation")
    print("=" * 42)

    print(f"MAE:  ₹{mean_absolute_error(actual_array, predicted_array):,.2f}")
    print(
        f"RMSE: ₹{root_mean_squared_error(actual_array, predicted_array):,.2f}"
    )

    if np.ptp(actual_array) == 0:
        print("R²:   Undefined because actual values are constant.")
    else:
        print(f"R²:   {r_squared(actual_array, predicted_array):.4f}")

    print(f"\nMonths evaluated: {len(actual_array)}")
    print(
        "\nNote: This is a small validation sample. "
        "Metrics are preliminary, not a guarantee of future accuracy."
    )


if __name__ == "__main__":
    main()