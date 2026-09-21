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


def seed_to_mongodb(db):
    """Seed cleaned sales data from data/processed into MongoDB."""
    clean_csv = Path(__file__).resolve().parent.parent / "data" / "processed" / "SalesData_clean.csv"
    if not clean_csv.exists():
        print(f"⚠️  {clean_csv} not found. Run ETL first.")
        return

    df = pd.read_csv(clean_csv)
    records = df.to_dict(orient="records")
    collection = db["sales"]
    collection.delete_many({})  # Reset existing
    collection.insert_many(records)
    print(f"✅ Loaded {len(records)} records into MongoDB 'sales' collection.")


def main():
    import sys
    print(f"Connecting to MongoDB at {MONGO_URI}...")
    try:
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=3000)
        db = client[DB_NAME]
        
        # Check if user wants to seed first
        if "--seed" in sys.argv:
            seed_to_mongodb(db)

        collections = ["sales", "customers", "forecast_metrics"]
        for col in collections:
            sync_collection(db, col)

        print("\n🎉 Done! Refresh Power BI to load the latest MongoDB data.")
    except Exception as e:
        print(f"❌ Connection error: {e}")


if __name__ == "__main__":
    main()
