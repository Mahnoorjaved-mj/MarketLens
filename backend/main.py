from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy import text

from database import engine
from forecast_model import generate_forecast



app = FastAPI(title="MarketLens API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "MarketLens API is running"
    }


@app.get("/api/dashboard")
def get_dashboard(
    year: str = Query("All"),
    region: str = Query("All"),
    category: str = Query("All"),
):

    with engine.connect() as connection:

        # =====================================================
        # FILTER CONDITIONS
        # =====================================================

        conditions = []
        params = {}

        if year != "All":
            conditions.append(
                'EXTRACT(YEAR FROM "Order Date") = :year'
            )
            params["year"] = int(year)

        if region != "All":
            conditions.append(
                '"Region" = :region'
            )
            params["region"] = region

        if category != "All":
            conditions.append(
                '"Category" = :category'
            )
            params["category"] = category


        where_clause = ""

        if conditions:
            where_clause = "WHERE " + " AND ".join(conditions)


        # =====================================================
        # KPI DATA
        # =====================================================

        kpi_query = text(f"""
            SELECT

                COALESCE(SUM("Sales"), 0)
                    AS total_sales,

                COALESCE(SUM("Profit"), 0)
                    AS total_profit,

                COUNT(DISTINCT "Order ID")
                    AS total_orders,

                COUNT(DISTINCT "Customer ID")
                    AS total_customers

            FROM superstore

            {where_clause}
        """)


        kpi_result = connection.execute(
            kpi_query,
            params
        ).mappings().first()


        # =====================================================
        # SALES TREND
        # =====================================================

        trend_query = text(f"""
            SELECT

                EXTRACT(
                    YEAR FROM "Order Date"
                )::INTEGER AS year,

                COALESCE(
                    SUM("Sales"), 0
                ) AS sales

            FROM superstore

            {where_clause}

            GROUP BY
                EXTRACT(YEAR FROM "Order Date")

            ORDER BY year
        """)


        trend_rows = connection.execute(
            trend_query,
            params
        ).mappings().all()


        sales_trend = [
            {
                "label": str(row["year"]),
                "sales": float(row["sales"])
            }
            for row in trend_rows
        ]


        # =====================================================
        # CATEGORY SALES
        # =====================================================

        category_query = text(f"""
            SELECT

                "Category" AS category,

                COALESCE(
                    SUM("Sales"), 0
                ) AS sales

            FROM superstore

            {where_clause}

            GROUP BY "Category"

            ORDER BY sales DESC
        """)


        category_rows = connection.execute(
            category_query,
            params
        ).mappings().all()


        category_sales = [
            {
                "category": row["category"],
                "sales": float(row["sales"])
            }
            for row in category_rows
        ]


        # =====================================================
        # REGION SALES
        # =====================================================

        region_query = text(f"""
            SELECT

                "Region" AS region,

                COALESCE(
                    SUM("Sales"), 0
                ) AS sales

            FROM superstore

            {where_clause}

            GROUP BY "Region"

            ORDER BY sales DESC
        """)


        region_rows = connection.execute(
            region_query,
            params
        ).mappings().all()


        region_sales = [
            {
                "region": row["region"],
                "sales": float(row["sales"])
            }
            for row in region_rows
        ]


        # =====================================================
        # TOP PRODUCTS
        # =====================================================

        products_query = text(f"""
            SELECT

                "Product Name" AS product_name,

                COALESCE(
                    SUM("Sales"), 0
                ) AS sales,

                COALESCE(
                    SUM("Profit"), 0
                ) AS profit

            FROM superstore

            {where_clause}

            GROUP BY "Product Name"

            ORDER BY sales DESC

            LIMIT 5
        """)


        product_rows = connection.execute(
            products_query,
            params
        ).mappings().all()


        top_products = [
            {
                "product_name": row["product_name"],
                "sales": float(row["sales"]),
                "profit": float(row["profit"])
            }
            for row in product_rows
        ]


        # =====================================================
        # FILTER OPTIONS
        # =====================================================

        years_query = text("""
            SELECT DISTINCT

                EXTRACT(
                    YEAR FROM "Order Date"
                )::INTEGER AS year

            FROM superstore

            ORDER BY year
        """)


        years = [
            row["year"]
            for row in connection.execute(
                years_query
            ).mappings().all()
        ]


        regions_query = text("""
            SELECT DISTINCT "Region"

            FROM superstore

            ORDER BY "Region"
        """)


        regions = [
            row["Region"]
            for row in connection.execute(
                regions_query
            ).mappings().all()
        ]


        categories_query = text("""
            SELECT DISTINCT "Category"

            FROM superstore

            ORDER BY "Category"
        """)


        categories = [
            row["Category"]
            for row in connection.execute(
                categories_query
            ).mappings().all()
        ]


    # =====================================================
    # INSIGHTS
    # =====================================================

    total_sales = float(kpi_result["total_sales"])
    total_profit = float(kpi_result["total_profit"])

    return {

        "kpis": {
            "total_sales": total_sales,
            "total_profit": total_profit,
            "total_orders": int(
                kpi_result["total_orders"]
            ),
            "total_customers": int(
                kpi_result["total_customers"]
            ),

            "sales_change": 12.8,
            "profit_change": 8.4,
            "orders_change": 14.2,
            "customers_change": 6.7,
        },


        "sales_trend": sales_trend,


        "category_sales": category_sales,


        "region_sales": region_sales,


        "top_products": top_products,


        "filters": {
            "years": years,
            "regions": regions,
            "categories": categories,
        },


        "insights": {

            "sales":
                f"Your business generated "
                f"${total_sales:,.0f} in sales with "
                f"${total_profit:,.0f} total profit.",

            "customers":
                f"Your dashboard currently contains "
                f"{int(kpi_result['total_customers']):,} "
                f"unique customers and "
                f"{int(kpi_result['total_orders']):,} orders."
        }
    }


@app.get("/api/forecast")
def get_forecast():

    try:

        result = generate_forecast(months=4)

        historical = result["historical"]
        forecast = result["forecast"]
        metrics = result["metrics"]

        # Last 5 historical months for chart
        chart_data = []

        historical_display = historical.tail(5)

        for _, row in historical_display.iterrows():

            chart_data.append({
                "month": row["date"].strftime("%b %Y"),
                "actual": round(float(row["sales"]), 2),
                "predicted": None,
            })

        # Add future predictions
        for _, row in forecast.iterrows():

            chart_data.append({
                "month": row["date"].strftime("%b %Y"),
                "actual": None,
                "predicted": round(float(row["sales"]), 2),
            })

        total_forecast = float(forecast["sales"].sum())

        last_actual = float(historical.iloc[-1]["sales"])
        first_prediction = float(forecast.iloc[0]["sales"])

        if last_actual > 0:
            growth = (
                (first_prediction - last_actual)
                / last_actual
            ) * 100
        else:
            growth = 0

        return {

            "forecast_data": chart_data,

            "summary": {

                "predicted_revenue": round(
                    total_forecast,
                    2
                ),

                "forecast_growth": round(
                    growth,
                    2
                ),

                "model_accuracy": round(
                    metrics["accuracy"],
                    2
                ),

                "mae": round(
                    metrics["mae"],
                    2
                ),

                "r2_score": round(
                    metrics["r2"],
                    4
                ),
            },

            "insight": (
                f"The forecasting model predicts approximately "
                f"${total_forecast:,.0f} in revenue over the next "
                f"{len(forecast)} months based on historical sales patterns."
            ),

            "model": {
                "name": "Random Forest Regressor",
                "trained_on": "Historical Superstore sales data",
                "status": "active",
            },
        }

    except Exception as error:

        return {
            "error": str(error)
        }

    
@app.get("/api/tables")
def get_tables():

    query = text("""
        SELECT table_schema, table_name
        FROM information_schema.tables
        WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
        ORDER BY table_schema, table_name;
    """)

    with engine.connect() as connection:
        rows = connection.execute(query).mappings().all()

    return [
        {
            "schema": row["table_schema"],
            "table": row["table_name"]
        }
        for row in rows
    ]

@app.get("/api/table-columns")
def get_table_columns():

    query = text("""
        SELECT
            column_name,
            data_type
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'analytics_sales'
        ORDER BY ordinal_position;
    """)

    with engine.connect() as connection:
        rows = connection.execute(query).mappings().all()

    return [
        {
            "column": row["column_name"],
            "type": row["data_type"]
        }
        for row in rows
    ]