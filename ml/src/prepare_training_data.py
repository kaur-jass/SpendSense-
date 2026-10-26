from pathlib import Path

from ml.src.data.load_data import load_transactions
from ml.src.data.preprocessing import clean_transactions
from ml.src.features.build_features import build_monthly_features

# Project paths
PROJECT_ROOT = Path(__file__).resolve().parents[2]
ML_DIR = PROJECT_ROOT / "ml"
INPUT_FILE = ML_DIR / "data" / "statement.csv"
OUTPUT_FILE = ML_DIR / "data" / "monthly_training_data.csv"

# Maximum transaction amount to include in personal-spending data
MAX_TRANSACTION_AMOUNT = 5000


def classify_transactions(df):
    """Classify transactions using their descriptions."""
    if "source_text" not in df.columns:
        raise ValueError("The CSV must contain a 'source_text' column.")

    descriptions = (
        df["source_text"]
        .astype("string")
        .str.lower()
        .str.replace(r"\s+", "", regex=True)
    )

    transfer_mask = descriptions.str.contains(
        r"selftransfer|ownaccount|accounttransfer",
        regex=True,
        na=False,
    )

    income_mask = descriptions.str.contains(
        r"receivedfrom|refund|cashback",
        regex=True,
        na=False,
    )

    df = df.copy()
    df["type"] = "expense"
    df.loc[transfer_mask, "type"] = "transfer"
    df.loc[income_mask, "type"] = "income"

    return df


def main():
    transactions = load_transactions(INPUT_FILE)
    cleaned = clean_transactions(transactions)
    classified = classify_transactions(cleaned)

    # Keep only transactions classified as expenses.
    expenses = classified[classified["type"] == "expense"].copy()

    # Exclude transactions above ₹6,000.
    excluded_count = (expenses["amount"] > MAX_TRANSACTION_AMOUNT).sum()

    expenses = expenses[expenses["amount"] <= MAX_TRANSACTION_AMOUNT].copy()

    if expenses.empty:
        raise ValueError("No expenses remain after applying the ₹6,000 limit.")

    # Aggregate the filtered expenses by month.
    monthly_data = build_monthly_features(expenses)

    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    monthly_data.to_csv(OUTPUT_FILE, index=False)

    print("\nMonthly training data created successfully.")
    print(f"Output: {OUTPUT_FILE}")
    print(f"Maximum transaction amount: ₹{MAX_TRANSACTION_AMOUNT}")
    print(f"Transactions excluded for exceeding the limit: {excluded_count}")
    print("\nMonthly data:")
    print(monthly_data.to_string(index=False))


if __name__ == "__main__":
    main()