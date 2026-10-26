from pathlib import Path

import pandas as pd
from ml.src.services.prediction_service import predict_next_month

PROJECT_ROOT = Path(__file__).resolve().parents[2]
DATA_FILE = PROJECT_ROOT / "ml" / "data" / "monthly_training_data.csv"


def main():
    if not DATA_FILE.exists():
        raise FileNotFoundError(
            f"Monthly training data not found: {DATA_FILE}. "
            "Run python -m ml.src.prepare_training_data first."
        )

    monthly_data = pd.read_csv(DATA_FILE)
    monthly_data["month"] = pd.to_datetime(monthly_data["month"])
    monthly_data = monthly_data.sort_values("month").reset_index(drop=True)

    # Train using historical months and predict the next month.
    prediction = predict_next_month(monthly_data)

    print("\nOctober 2026 Expense Prediction")
    print("--------------------------------")
    print(f"Predicted expenses: ₹{prediction['predicted_expenses']:,.2f}")
    print(f"Historical months used: {prediction['historical_months']}")
    print(f"Model: {prediction['model']}")


if __name__ == "__main__":
    main()