import pandas as pd


def build_monthly_features(
    transactions: pd.DataFrame,
) -> pd.DataFrame:
    """Aggregate transactions into monthly features.

    Required columns:
        date: Transaction date.
        amount: Transaction amount.

    Optional column:
        type: Transaction category, such as expense or income.

    If a type column exists, only rows explicitly classified as
    expenses are included. Without a type column, all transactions
    are included, so callers must ensure the data contains expenses only.

    Returns:
        A DataFrame containing monthly expenditure and transaction count.
    """
    required_columns = {"date", "amount"}
    missing_columns = required_columns - set(transactions.columns)

    if missing_columns:
        raise ValueError(f"Missing required columns: {sorted(missing_columns)}")

    if transactions.empty:
        raise ValueError("Cannot build features from empty transactions.")

    data = transactions.copy()

    data["date"] = pd.to_datetime(data["date"], errors="coerce")
    data["amount"] = pd.to_numeric(data["amount"], errors="coerce")

    data = data.dropna(subset=["date", "amount"])

    if data.empty:
        raise ValueError("No valid transactions available.")

    # If transaction types are provided, include only expenses.
    if "type" in data.columns:
        expense_mask = (
            data["type"].astype("string").str.strip().str.lower().eq("expense")
        )

        data = data.loc[expense_mask].copy()

    if data.empty:
        raise ValueError("No expense transactions available.")

    # Group dates into calendar months.
    data["month"] = data["date"].dt.to_period("M")

    monthly = (
        data.groupby("month")
        .agg(
            total_expenses=("amount", "sum"),
            transaction_count=("amount", "size"),
        )
        .reset_index()
    )

    monthly["month"] = monthly["month"].dt.to_timestamp()

    return monthly