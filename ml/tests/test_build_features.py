import pandas as pd
import pytest
from ml.src.features.build_features import build_monthly_features


def test_build_monthly_features():
    transactions = pd.DataFrame({
        "date": [
            "2026-01-05",
            "2026-01-08",
            "2026-01-10",
            "2026-02-02",
            "2026-02-15",
        ],
        "amount": [250, 500, 1000, 300, 200],
        "type": [
            "expense",
            "expense",
            "income",
            "expense",
            "expense",
        ],
    })
    result = build_monthly_features(transactions)

    assert len(result) == 2
    assert result["total_expenses"].tolist() == [750, 500]
    assert result["transaction_count"].tolist() == [2, 2]


def test_empty_transactions_raise_error():
    transactions = pd.DataFrame(columns=["date", "amount"])
    with pytest.raises(ValueError):
        build_monthly_features(transactions)


def test_missing_required_column_raises_error():
    transactions = pd.DataFrame({
        "date": ["2026-01-01"],
    })
    with pytest.raises(ValueError, match="Missing required columns"):
        build_monthly_features(transactions)


def test_invalid_transactions_raise_error():
    transactions = pd.DataFrame({
        "date": ["invalid-date"],
        "amount": ["invalid-amount"],
    })
    with pytest.raises(ValueError, match="No valid transactions"):
        build_monthly_features(transactions)