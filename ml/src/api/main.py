from pathlib import Path
import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from ml.src.services.prediction_service import predict_next_month

PROJECT_ROOT = Path(__file__).resolve().parents[3]
DATA_FILE = PROJECT_ROOT / "ml" / "data" / "monthly_training_data.csv"

app = FastAPI(
    title="SpendSense ML API",
    description="Predicts monthly expenses using Linear Regression.",
    version="1.1.0",
)


class PredictionRequest(BaseModel):
    monthly_expenses: list[float] = Field(
        ...,
        min_length=3,
        description="At least three historical monthly expense totals.",
    )


@app.get("/health")
def health_check():
    return {
        "success": True,
        "message": "SpendSense ML API is running.",
    }


@app.post("/predict")
def predict_expenses(request: PredictionRequest):
    try:
        monthly_data = pd.DataFrame(
            {"total_expenses": request.monthly_expenses}
        )
        prediction = predict_next_month(monthly_data)

        return {
            "success": True,
            "data": prediction,
        }

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        ) from error

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail="Prediction failed.",
        ) from error


@app.get("/predict-from-csv")
def predict_from_csv():
    try:
        if not DATA_FILE.exists():
            raise HTTPException(
                status_code=404,
                detail="Monthly training data CSV was not found.",
            )

        monthly_data = pd.read_csv(DATA_FILE)
        required_columns = {"month", "total_expenses"}

        if not required_columns.issubset(monthly_data.columns):
            raise HTTPException(
                status_code=400,
                detail="CSV must contain month and total_expenses columns.",
            )

        monthly_data["month"] = pd.to_datetime(
            monthly_data["month"],
            errors="coerce",
        )

        monthly_data["total_expenses"] = pd.to_numeric(
            monthly_data["total_expenses"],
            errors="coerce",
        )

        monthly_data = (
            monthly_data.dropna(subset=["month", "total_expenses"])
            .sort_values("month")
            .reset_index(drop=True)
        )

        prediction = predict_next_month(monthly_data)

        return {
            "success": True,
            "source": "monthly_training_data.csv",
            "last_historical_month": (
                monthly_data["month"].max().strftime("%Y-%m")
            ),
            "data": prediction,
        }

    except HTTPException:
        raise

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        ) from error

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail="CSV prediction failed.",
        ) from error


@app.get("/historical-data")
def get_historical_data():
    try:
        if not DATA_FILE.exists():
            raise HTTPException(
                status_code=404,
                detail="Monthly training data CSV was not found.",
            )

        monthly_data = pd.read_csv(DATA_FILE)

        required_columns = {"month", "total_expenses"}

        if not required_columns.issubset(monthly_data.columns):
            raise HTTPException(
                status_code=400,
                detail="CSV must contain month and total_expenses columns.",
            )

        monthly_data["month"] = pd.to_datetime(
            monthly_data["month"],
            errors="coerce",
        )
        monthly_data["total_expenses"] = pd.to_numeric(
            monthly_data["total_expenses"],
            errors="coerce",
        )

        monthly_data = monthly_data.dropna(
            subset=["month", "total_expenses"]
        ).sort_values("month")

        return {
            "success": True,
            "data": {
                "months": [
                    {
                        "month": row["month"].strftime("%Y-%m"),
                        "total_expenses": float(row["total_expenses"]),
                    }
                    for _, row in monthly_data.iterrows()
                ]
            },
        }

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail="Could not load historical data.",
        ) from error