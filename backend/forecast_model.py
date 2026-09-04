import pandas as pd
import numpy as np

from sqlalchemy import text

from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score

from database import engine


def load_sales_data():
    """
    Load real sales data from PostgreSQL Superstore table
    and aggregate it month-wise.
    """

    query = text("""
        SELECT
            "Order Date" AS order_date,
            "Sales" AS sales
        FROM superstore
        WHERE "Order Date" IS NOT NULL
          AND "Sales" IS NOT NULL
        ORDER BY "Order Date"
    """)

    with engine.connect() as connection:
        rows = connection.execute(query).mappings().all()

    df = pd.DataFrame(rows)

    if df.empty:
        raise ValueError("No sales data found in the database.")

    df["order_date"] = pd.to_datetime(df["order_date"])
    df["sales"] = pd.to_numeric(df["sales"])

    # Aggregate REAL sales month-wise
    monthly_sales = (
        df
        .set_index("order_date")
        .resample("MS")["sales"]
        .sum()
        .reset_index()
    )

    monthly_sales.columns = ["date", "sales"]

    return monthly_sales


def create_features(df):
    """
    Create time-series features for the ML model.
    """

    data = df.copy()

    # Previous months' sales
    data["lag_1"] = data["sales"].shift(1)
    data["lag_2"] = data["sales"].shift(2)
    data["lag_3"] = data["sales"].shift(3)

    # Rolling averages
    data["rolling_mean_3"] = (
        data["sales"]
        .shift(1)
        .rolling(3)
        .mean()
    )

    data["rolling_mean_6"] = (
        data["sales"]
        .shift(1)
        .rolling(6)
        .mean()
    )

    # Date features
    data["month"] = data["date"].dt.month
    data["year"] = data["date"].dt.year

    return data.dropna().reset_index(drop=True)


def train_forecast_model():
    """
    Train a Random Forest model on REAL historical sales.
    """

    monthly_sales = load_sales_data()

    model_data = create_features(monthly_sales)

    if len(model_data) < 10:
        raise ValueError(
            "Not enough historical monthly data to train the forecasting model."
        )

    feature_columns = [
        "lag_1",
        "lag_2",
        "lag_3",
        "rolling_mean_3",
        "rolling_mean_6",
        "month",
        "year",
    ]

    X = model_data[feature_columns]
    y = model_data["sales"]

    # Time-series split
    split_index = max(int(len(model_data) * 0.8), 1)

    X_train = X.iloc[:split_index]
    X_test = X.iloc[split_index:]

    y_train = y.iloc[:split_index]
    y_test = y.iloc[split_index:]

    model = RandomForestRegressor(
        n_estimators=300,
        max_depth=8,
        random_state=42,
        min_samples_leaf=1,
    )

    model.fit(X_train, y_train)

    # Real evaluation
    if len(X_test) > 0:
        predictions = model.predict(X_test)

        mae = mean_absolute_error(y_test, predictions)

        if len(y_test) > 1:
            r2 = r2_score(y_test, predictions)
        else:
            r2 = 0

        # Accuracy based on MAPE
        non_zero_mask = y_test != 0

        if non_zero_mask.any():
            mape = np.mean(
                np.abs(
                    (
                        y_test[non_zero_mask]
                        - predictions[non_zero_mask]
                    )
                    / y_test[non_zero_mask]
                )
            ) * 100

            accuracy = max(0, 100 - mape)
        else:
            accuracy = 0

    else:
        mae = 0
        r2 = 0
        accuracy = 0

    return {
        "model": model,
        "monthly_sales": monthly_sales,
        "feature_columns": feature_columns,
        "mae": float(mae),
        "r2": float(r2),
        "accuracy": float(accuracy),
    }


def generate_forecast(months=4):
    """
    Generate future predictions recursively.
    """

    training = train_forecast_model()

    model = training["model"]
    historical = training["monthly_sales"].copy()

    future_predictions = []

    working_data = historical.copy()

    for _ in range(months):

        next_date = (
            working_data["date"].max()
            + pd.DateOffset(months=1)
        )

        sales_values = working_data["sales"].tolist()

        lag_1 = sales_values[-1]
        lag_2 = sales_values[-2]
        lag_3 = sales_values[-3]

        rolling_mean_3 = np.mean(sales_values[-3:])
        rolling_mean_6 = np.mean(sales_values[-6:])

        features = pd.DataFrame([{
            "lag_1": lag_1,
            "lag_2": lag_2,
            "lag_3": lag_3,
            "rolling_mean_3": rolling_mean_3,
            "rolling_mean_6": rolling_mean_6,
            "month": next_date.month,
            "year": next_date.year,
        }])

        prediction = float(model.predict(features)[0])

        # Avoid negative revenue
        prediction = max(0, prediction)

        future_predictions.append({
            "date": next_date,
            "sales": prediction,
        })

        working_data = pd.concat(
            [
                working_data,
                pd.DataFrame([{
                    "date": next_date,
                    "sales": prediction,
                }]),
            ],
            ignore_index=True,
        )

    future_df = pd.DataFrame(future_predictions)

    return {
        "historical": historical,
        "forecast": future_df,
        "metrics": {
            "mae": training["mae"],
            "r2": training["r2"],
            "accuracy": training["accuracy"],
        },
    }