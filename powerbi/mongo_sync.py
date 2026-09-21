"""
MarketLens - MongoDB to Power BI Data Sync
Fetches collections from MongoDB, cleans them, and exports them to CSV for Power BI.
"""

import os
from pathlib import Path
import pandas as pd
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

MONGO_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("MONGODB_DB", "marketlens")
OUTPUT_DIR = Path(__file__).resolve().parent.parent / "data" / "processed"


def sync_collection(db, collection_name: str) -> pd.DataFrame:
    """Fetch collection, remove MongoDB internal _id, and return DataFrame."""
    cursor = db[collection_name].find()
    df = pd.DataFrame(list(cursor))

    if df.empty:
        print(f"⚠️  Collection '{collection_name}' is empty.")
        return df

    if "_id" in df.columns:
        df = df.drop(columns=["_id"])

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    out_path = OUTPUT_DIR / f"{collection_name}.csv"
    df.to_csv(out_path, index=False)
    print(f"✅ Synced {len(df)} rows from '{collection_name}' -> {out_path}")
    return df


def main():
    print(f"Connecting to MongoDB at {MONGO_URI}...")
    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]

    collections = ["customers", "sales", "forecast_metrics"]
    for col in collections:
        try:
            sync_collection(db, col)
        except Exception as e:
            print(f"❌ Error syncing '{col}': {e}")

    print("\n🎉 Sync completed! Refresh your Power BI dashboard to view latest data.")


if __name__ == "__main__":
    main()
