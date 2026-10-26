import pandas as pd
import pytest
from ml.src.services.prediction_service import predict_next_month


def test_predict_next_month_returns_expected_fields():
    monthly_data = pd.DataFrame({
        "total_expenses": [8000, 8500, 9000, 9500, 10000],
    })
    result = predict_next_month(monthly_data)

    assert "predicted_expenses" in result
    assert "historical_months" in result
    assert result["historical_months"] == 5
    assert result["predicted_expenses"] > 0


def test_predict_next_month_rejects_insufficient_data():
    monthly_data = pd.DataFrame({
        "total_expenses": [8000, 8500],
    })
    with pytest.raises(ValueError, match="At least 3 months"):
        predict_next_month(monthly_data)


def test_predict_next_month_rejects_missing_column():
    monthly_data = pd.DataFrame({
        "expenses": [8000, 8500, 9000],
    })
    with pytest.raises(ValueError, match="total_expenses"):
        predict_next_month(monthly_data)


def test_predict_next_month_rejects_invalid_values():
    monthly_data = pd.DataFrame({
        "total_expenses": [8000, float("nan"), 9000],
    })
    with pytest.raises(ValueError, match="finite numbers"):
        predict_next_month(monthly_data)


def test_predict_next_month_rejects_negative_expenses():
    monthly_data = pd.DataFrame({
        "total_expenses": [8000, -100, 9000],
    })
    with pytest.raises(ValueError, match="cannot be negative"):
        predict_next_month(monthly_data)