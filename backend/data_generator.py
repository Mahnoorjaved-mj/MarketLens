from backend.database import engine
from sqlalchemy import text
import random
from datetime import date, timedelta


def generate_data():

    with engine.begin() as connection:

        # ==========================================
        # SALES TABLE
        # ==========================================

        connection.execute(text("""
            CREATE TABLE IF NOT EXISTS sales (
                id SERIAL PRIMARY KEY,
                sale_date DATE NOT NULL,
                customer_id INTEGER,
                product_name VARCHAR(100),
                quantity INTEGER,
                revenue NUMERIC(12,2)
            )
        """))

        # ==========================================
        # CUSTOMERS TABLE
        # ==========================================

        connection.execute(text("""
            CREATE TABLE IF NOT EXISTS customers (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100),
                email VARCHAR(150)
            )
        """))

        # ==========================================
        # FORECASTS TABLE
        # ==========================================

        connection.execute(text("""
            CREATE TABLE IF NOT EXISTS forecasts (
                id SERIAL PRIMARY KEY,
                forecast_date DATE,
                predicted_revenue NUMERIC(12,2),
                accuracy NUMERIC(5,2)
            )
        """))

        # ==========================================
        # CHECK IF DATA ALREADY EXISTS
        # ==========================================

        customer_count = connection.execute(
            text("SELECT COUNT(*) FROM customers")
        ).scalar()

        sales_count = connection.execute(
            text("SELECT COUNT(*) FROM sales")
        ).scalar()

        # ==========================================
        # INSERT CUSTOMERS
        # ==========================================

        if customer_count == 0:

            for i in range(1, 101):

                connection.execute(
                    text("""
                        INSERT INTO customers (name, email)
                        VALUES (:name, :email)
                    """),
                    {
                        "name": f"Customer {i}",
                        "email": f"customer{i}@marketlens.com"
                    }
                )

        # ==========================================
        # INSERT SALES
        # ==========================================

        if sales_count == 0:

            start_date = date.today() - timedelta(days=180)

            for i in range(500):

                sale_date = start_date + timedelta(
                    days=random.randint(0, 180)
                )

                customer_id = random.randint(1, 100)

                quantity = random.randint(1, 20)

                revenue = round(
                    quantity * random.uniform(5000, 25000),
                    2
                )

                connection.execute(
                    text("""
                        INSERT INTO sales
                        (
                            sale_date,
                            customer_id,
                            product_name,
                            quantity,
                            revenue
                        )
                        VALUES
                        (
                            :sale_date,
                            :customer_id,
                            :product_name,
                            :quantity,
                            :revenue
                        )
                    """),
                    {
                        "sale_date": sale_date,
                        "customer_id": customer_id,
                        "product_name": f"Product {random.randint(1, 20)}",
                        "quantity": quantity,
                        "revenue": revenue
                    }
                )

        # ==========================================
        # INSERT FORECAST DATA
        # ==========================================

        forecast_count = connection.execute(
            text("SELECT COUNT(*) FROM forecasts")
        ).scalar()

        if forecast_count == 0:

            start_date = date.today()

            for i in range(30):

                forecast_date = start_date + timedelta(days=i)

                connection.execute(
                    text("""
                        INSERT INTO forecasts
                        (
                            forecast_date,
                            predicted_revenue,
                            accuracy
                        )
                        VALUES
                        (
                            :forecast_date,
                            :predicted_revenue,
                            :accuracy
                        )
                    """),
                    {
                        "forecast_date": forecast_date,
                        "predicted_revenue": round(
                            random.uniform(200000, 500000),
                            2
                        ),
                        "accuracy": round(
                            random.uniform(90, 97),
                            2
                        )
                    }
                )


if __name__ == "__main__":

    generate_data()

    print("===================================")
    print("MarketLens database populated!")
    print("Customers: 100")
    print("Sales: 500")
    print("Forecasts: 30")
    print("===================================")