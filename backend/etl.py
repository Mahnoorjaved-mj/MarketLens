import pandas as pd
from pathlib import Path
from sqlalchemy import text

from backend.database import engine


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

RAW_FILE = BASE_DIR / "data" / "raw" / "Sample - Superstore.csv"
PROCESSED_FILE = BASE_DIR / "data" / "processed" / "SalesData_clean.csv"


# ============================================================
# LOAD DATA
# ============================================================

def load_data():
    print("\nLoading:")
    print(RAW_FILE)

    # Power BI used Encoding=1252
    df = pd.read_csv(
        RAW_FILE,
        encoding="cp1252"
    )

    print(f"CSV loaded successfully: {len(df)} rows")

    return df


# ============================================================
# POWER BI ETL REPRODUCTION
# ============================================================

def transform_data(df):

    print("\nOriginal columns:")
    print(list(df.columns))

    # --------------------------------------------------------
    # 1. Rename columns to match our database/API structure
    # --------------------------------------------------------

    df = df.rename(columns={
        "Row ID": "row_id",
        "Order ID": "order_id",
        "Order Date": "order_date",
        "Ship Date": "ship_date",
        "Ship Mode": "ship_mode",
        "Customer ID": "customer_id",
        "Customer Name": "customer_name",
        "Segment": "segment",
        "Country": "country",
        "City": "city",
        "State": "state",
        "Postal Code": "postal_code",
        "Region": "region",
        "Product ID": "product_id",
        "Category": "category",
        "Sub-Category": "sub_category",
        "Product Name": "product_name",
        "Sales": "sales",
        "Quantity": "quantity",
        "Discount": "discount",
        "Profit": "profit"
    })

    # --------------------------------------------------------
    # 2. Remove duplicates based on Row ID
    # Power BI:
    # Table.Distinct(..., {"Row ID"})
    # --------------------------------------------------------

    df = df.drop_duplicates(
        subset=["row_id"]
    )

    print(f"After removing duplicates: {len(df)} rows")

    # --------------------------------------------------------
    # 3. Convert dates
    # --------------------------------------------------------

    df["order_date"] = pd.to_datetime(
        df["order_date"],
        errors="coerce"
    )

    df["ship_date"] = pd.to_datetime(
        df["ship_date"],
        errors="coerce"
    )

    # --------------------------------------------------------
    # 4. Trim + Clean text
    # --------------------------------------------------------

    text_columns = [
        "customer_name",
        "segment",
        "country",
        "city",
        "state",
        "region",
        "category",
        "sub_category",
        "product_name",
        "ship_mode"
    ]

    for column in text_columns:

        if column in df.columns:

            df[column] = (
                df[column]
                .fillna("")
                .astype(str)
                .str.replace(r"[\x00-\x1F\x7F]", "", regex=True)
                .str.strip()
            )

    # --------------------------------------------------------
    # 5. Numeric columns
    # --------------------------------------------------------

    numeric_columns = [
        "row_id",
        "postal_code",
        "sales",
        "quantity",
        "discount",
        "profit"
    ]

    for column in numeric_columns:

        if column in df.columns:

            df[column] = pd.to_numeric(
                df[column],
                errors="coerce"
            )

    # --------------------------------------------------------
    # 6. Postal Code → Text
    # --------------------------------------------------------

    df["postal_code"] = (
        df["postal_code"]
        .fillna("")
        .astype(str)
        .str.replace(r"\.0$", "", regex=True)
    )

    # --------------------------------------------------------
    # 7. Shipping Days
    # --------------------------------------------------------

    df["shipping_days"] = (
        df["ship_date"] - df["order_date"]
    ).dt.days

    # --------------------------------------------------------
    # 8. Final database columns
    # --------------------------------------------------------

    final_columns = [
        "row_id",
        "order_id",
        "order_date",
        "ship_date",
        "ship_mode",
        "customer_id",
        "customer_name",
        "segment",
        "country",
        "city",
        "state",
        "postal_code",
        "region",
        "product_id",
        "category",
        "sub_category",
        "product_name",
        "sales",
        "quantity",
        "discount",
        "profit",
        "shipping_days"
    ]

    df = df[final_columns]

    # --------------------------------------------------------
    # 9. Remove rows where essential fields are missing
    # --------------------------------------------------------

    df = df.dropna(
        subset=[
            "row_id",
            "customer_id",
            "sales",
            "order_date"
        ]
    )

    print("\nClean data:")
    print(df.head())

    print(f"\nRows after cleaning: {len(df)}")

    return df


# ============================================================
# SAVE CLEAN CSV
# ============================================================

def save_processed_data(df):

    PROCESSED_FILE.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    df.to_csv(
        PROCESSED_FILE,
        index=False,
        encoding="utf-8-sig"
    )

    print("\nClean CSV saved:")
    print(PROCESSED_FILE)


# ============================================================
# LOAD INTO POSTGRESQL
# ============================================================

def load_to_postgres(df):

    print("\nConnecting to PostgreSQL...")

    with engine.begin() as connection:

        print("Clearing old sales data...")

        connection.execute(
            text("TRUNCATE TABLE sales RESTART IDENTITY")
        )

        print("Old sales data cleared.")

    db_df = df.rename(columns={
        "customer_id": "customer_id",
        "sales": "amount",
        "order_date": "sale_date",
        "profit": "profit"
    })

    db_df = db_df[
        [
            "customer_id",
            "amount",
            "sale_date",
            "profit"
        ]
    ]

    print("Inserting fresh data into PostgreSQL...")

    db_df.to_sql(
        "sales",
        con=engine,
        if_exists="append",
        index=False,
        method="multi",
        chunksize=500
    )

    print("Data inserted successfully!")


# ============================================================
# VERIFY DATABASE
# ============================================================

def verify_database():

    query = text("""
        SELECT
            COUNT(*) AS total_rows,
            COALESCE(SUM(amount), 0) AS revenue,
            COALESCE(SUM(profit), 0) AS profit,
            COUNT(DISTINCT customer_id) AS customers
        FROM public.sales;
    """)

    with engine.connect() as connection:

        result = connection.execute(query)

        row = result.fetchone()

    print("\n")
    print("=" * 45)
    print("DATABASE VERIFICATION")
    print("=" * 45)

    print(f"Total rows : {row.total_rows}")
    print(f"Revenue    : {row.revenue}")
    print(f"Profit     : {row.profit}")
    print(f"Customers  : {row.customers}")

    print("=" * 45)


# ============================================================
# MAIN ETL PIPELINE
# ============================================================

def run_etl():

    print("\n")
    print("=" * 45)
    print("       MARKETLENS ETL PIPELINE")
    print("=" * 45)

    df = load_data()

    df = transform_data(df)

    save_processed_data(df)

    load_to_postgres(df)

    verify_database()

    print("\nETL COMPLETED SUCCESSFULLY! ✅")


if __name__ == "__main__":
    run_etl()