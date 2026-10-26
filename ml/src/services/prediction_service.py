import numpy as np
import pandas as pd
from ml.src.models.linear_regression import LinearRegression


def predict_next_month(
    monthly_data: pd.DataFrame,
) -> dict:
    """Train a linear regression model on historical monthly expenditure

    and predict the next month's expenditure.
    Required column:
        total_expenses

    The DataFrame must contain consecutive monthly observations.
    """
    if "total_expenses" not in monthly_data.columns:
        raise ValueError("Monthly data must contain 'total_expenses'.")

    if monthly_data.empty:
        raise ValueError("Monthly data cannot be empty.")

    expenses = pd.to_numeric(
        monthly_data["total_expenses"],
        errors="coerce",
    ).to_numpy(dtype=float)

    if not np.isfinite(expenses).all():
        raise ValueError("Monthly expenses must contain finite numbers.")

    if len(expenses) < 3:
        raise ValueError("At least 3 months of historical data are required.")

    if (expenses < 0).any():
        raise ValueError("Monthly expenses cannot be negative.")

    # Represent time as 0, 1, 2, ..., n-1.
    X = np.arange(len(expenses), dtype=float).reshape(-1, 1)
    y = expenses

    # Standardize the input feature for training.
    x_mean = X.mean(axis=0)
    x_std = X.std(axis=0)

    X_scaled = (X - x_mean) / x_std

    model = LinearRegression(
        learning_rate=0.01,
        n_iterations=3000,
    )

    model.fit(X_scaled, y)

    # The next month is the next time step.
    next_month = np.array([[float(len(expenses))]])
    next_month_scaled = (next_month - x_mean) / x_std

    prediction = float(model.predict(next_month_scaled)[0])

    return {
        "predicted_expenses": round(max(0.0, prediction), 2),
        "historical_months": len(expenses),
        "model": "Linear Regression",
    }