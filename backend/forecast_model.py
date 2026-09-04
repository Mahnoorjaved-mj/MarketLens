import pandas as pd
import numpy as np

from sqlalchemy import text
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score

from database import engine


# ==========================================
# LOAD REAL SALES DATA FROM POSTGRESQL
# ==========================================

def load_sales_data():

    query = text("""
        SELECT
            order_date,
            sales
        FROM analytics_sales
        WHERE order_date IS NOT NULL
          AND sales IS NOT NULL
        ORDER BY order_date
    """)

    with engine.connect() as connection:
        rows = connection.execute(query).mappings().all()

    df = pd.DataFrame(rows)

    if df.empty:
        raise ValueError(
            "No sales data found in analytics_sales table."
        )

    df["order_date"] = pd.to_datetime(df["order_date"])
    df["sales"] = pd.to_numeric(df["sales"])

    # ==========================================
    # AGGREGATE REAL SALES MONTH-WISE
    # ==========================================

    monthly_sales = (
        df
        .set_index("order_date")
        .resample("MS")["sales"]
        .sum()
        .reset_index()
    )

    monthly_sales.columns = ["date", "sales"]

    return monthly_sales


# ==========================================
# CREATE TIME SERIES FEATURES
# ==========================================

def create_features(df):

    data = df.copy()

    # Previous sales values
    data["lag_1"] = data["sales"].shift(1)
    data["lag_2"] = data["sales"].shift(2)
    data["lag_3"] = data["sales"].shift(3)

    # Moving averages
    data["rolling_mean_3"] = (
        data["sales"]
        .shift(1)
        .rolling(window=3)
        .mean()
    )

    data["rolling_mean_6"] = (
        data["sales"]
        .shift(1)
        .rolling(window=6)
        .mean()
    )

    # Time information
    data["month"] = data["date"].dt.month
    data["year"] = data["date"].dt.year

    return data.dropna().reset_index(drop=True)


# ==========================================
# TRAIN REAL ML MODEL
# ==========================================

def train_forecast_model():

    monthly_sales = load_sales_data()

    model_data = create_features(monthly_sales)

    if len(model_data) < 10:
        raise ValueError(
            "Not enough historical data to train the model."
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

    # ==========================================
    # TIME SERIES TRAIN / TEST SPLIT
    # ==========================================

    split_index = int(len(model_data) * 0.8)

    X_train = X.iloc[:split_index]
    X_test = X.iloc[split_index:]

    y_train = y.iloc[:split_index]
    y_test = y.iloc[split_index:]

    # ==========================================
    # RANDOM FOREST MODEL
    # ==========================================

    model = RandomForestRegressor(

        n_estimators=300,
        max_depth=8,
        min_samples_leaf=1,
        random_state=42,

    )

    model.fit(X_train, y_train)

    # ==========================================
    # REAL MODEL EVALUATION
    # ==========================================

    predictions = model.predict(X_test)

    mae = mean_absolute_error(
        y_test,
        predictions
    )

    r2 = r2_score(
        y_test,
        predictions
    )

    # MAPE → Accuracy

    non_zero_mask = y_test != 0

    mape = np.mean(

        np.abs(
            (
                y_test[non_zero_mask]
                - predictions[non_zero_mask]
            )
            /
            y_test[non_zero_mask]
        )

    ) * 100

    accuracy = max(
        0,
        100 - mape
    )

    return {

        "model": model,

        "monthly_sales": monthly_sales,

        "mae": float(mae),

        "r2": float(r2),

        "accuracy": float(accuracy),

    }


# ==========================================
# GENERATE FUTURE FORECAST
# ==========================================

def generate_forecast(months=4):

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

        sales_values = (
            working_data["sales"]
            .tolist()
        )

        # Features based on REAL + previous predictions

        features = pd.DataFrame([{

            "lag_1": sales_values[-1],

            "lag_2": sales_values[-2],

            "lag_3": sales_values[-3],

            "rolling_mean_3":
                np.mean(sales_values[-3:]),

            "rolling_mean_6":
                np.mean(sales_values[-6:]),

            "month": next_date.month,

            "year": next_date.year,

        }])

        prediction = float(
            model.predict(features)[0]
        )

        # Revenue cannot be negative

        prediction = max(
            0,
            prediction
        )


        future_predictions.append({

            "date": next_date,

            "sales": prediction,

        })


        # Add prediction so next month uses it

        working_data = pd.concat(

            [

                working_data,

                pd.DataFrame([{

                    "date": next_date,

                    "sales": prediction,

                }])

            ],

            ignore_index=True

        )


    future_df = pd.DataFrame(
        future_predictions
    )


    return {

        "historical": historical,

        "forecast": future_df,

        "metrics": {

            "mae": training["mae"],

            "r2": training["r2"],

            "accuracy": training["accuracy"],

        }

    }