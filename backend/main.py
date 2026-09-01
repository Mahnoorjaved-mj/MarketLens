from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from backend.database import engine

app = FastAPI(title="MarketLens API")

# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# HOME
# =========================================================

@app.get("/")
def home():
    return {
        "message": "MarketLens API is running",
        "project": "MarketLens",
        "data_source": "Kaggle Superstore → Power BI ETL → PostgreSQL"
    }


# =========================================================
# HEALTH
# =========================================================

@app.get("/api/health")
def health():

    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))

        return {
            "status": "ok",
            "database": "connected"
        }

    except Exception as e:

        return {
            "status": "error",
            "database": "disconnected",
            "error": str(e)
        }


# =========================================================
# DASHBOARD
# =========================================================

@app.get("/api/dashboard")
def dashboard():

    try:

        with engine.connect() as conn:

            # ---------------------------------------------
            # MAIN KPIs
            # ---------------------------------------------

            result = conn.execute(
                text("""
                    SELECT
                        COUNT(*) AS total_orders,
                        COALESCE(SUM(amount), 0) AS total_revenue,
                        COALESCE(SUM(profit), 0) AS total_profit,
                        COUNT(DISTINCT customer_id) AS total_customers
                    FROM sales
                """)
            ).mappings().first()

            total_orders = int(result["total_orders"] or 0)
            total_revenue = float(result["total_revenue"] or 0)
            total_profit = float(result["total_profit"] or 0)
            total_customers = int(result["total_customers"] or 0)

            # ---------------------------------------------
            # PROFIT MARGIN
            # ---------------------------------------------

            profit_margin = (
                (total_profit / total_revenue) * 100
                if total_revenue
                else 0
            )

            # ---------------------------------------------
            # MONTHLY REVENUE
            # ---------------------------------------------

            monthly_result = conn.execute(
                text("""
                    SELECT
                        TO_CHAR(
                            DATE_TRUNC('month', sale_date),
                            'YYYY-MM'
                        ) AS month,
                        ROUND(
                            SUM(amount)::numeric,
                            2
                        ) AS revenue,
                        ROUND(
                            SUM(profit)::numeric,
                            2
                        ) AS profit
                    FROM sales
                    GROUP BY DATE_TRUNC('month', sale_date)
                    ORDER BY DATE_TRUNC('month', sale_date)
                """)
            ).mappings().all()

            monthly_revenue = [
                {
                    "month": row["month"],
                    "revenue": float(row["revenue"] or 0),
                    "profit": float(row["profit"] or 0)
                }
                for row in monthly_result
            ]

            # ---------------------------------------------
            # TOP CUSTOMERS
            # ---------------------------------------------

            customer_result = conn.execute(
                text("""
                    SELECT
                        customer_id,
                        ROUND(SUM(amount)::numeric, 2) AS revenue,
                        ROUND(SUM(profit)::numeric, 2) AS profit
                    FROM sales
                    GROUP BY customer_id
                    ORDER BY SUM(amount) DESC
                    LIMIT 5
                """)
            ).mappings().all()

            top_customers = [
                {
                    "customer_id": row["customer_id"],
                    "revenue": float(row["revenue"] or 0),
                    "profit": float(row["profit"] or 0)
                }
                for row in customer_result
            ]

            # ---------------------------------------------
            # DATABASE RANGE
            # ---------------------------------------------

            date_result = conn.execute(
                text("""
                    SELECT
                        MIN(sale_date) AS first_date,
                        MAX(sale_date) AS last_date
                    FROM sales
                """)
            ).mappings().first()

            first_date = (
                date_result["first_date"].isoformat()
                if date_result["first_date"]
                else None
            )

            last_date = (
                date_result["last_date"].isoformat()
                if date_result["last_date"]
                else None
            )

        return {

            "total_revenue": round(total_revenue, 2),

            "total_orders": total_orders,

            # Keep this because your current React
            # dashboard already expects total_sales
            "total_sales": total_orders,

            "total_profit": round(total_profit, 2),

            "active_customers": total_customers,

            "profit_margin": round(profit_margin, 2),

            "forecast_accuracy": 0,

            "revenue_change": 0,
            "sales_change": 0,
            "customer_change": 0,
            "accuracy_change": 0,

            "monthly_revenue": monthly_revenue,

            "top_customers": top_customers,

            "data_range": {
                "first_date": first_date,
                "last_date": last_date
            },

            "source": "PostgreSQL"
        }

    except Exception as e:

        print("DASHBOARD ERROR:", str(e))

        return {
            "error": str(e)
        }