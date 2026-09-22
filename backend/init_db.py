from sqlalchemy import text
try:
    from backend.database import engine, Base, SessionLocal
    from backend.auth import seed_default_user_if_needed
except ImportError:
    from database import engine, Base, SessionLocal
    from auth import seed_default_user_if_needed


def init_postgres():
    print("Initializing PostgreSQL database for MarketLens...")
    
    # 1. Create tables defined in models (User, Customer, Sale, ForecastMetric)
    Base.metadata.create_all(bind=engine)

    # 2. Seed default admin user
    db = SessionLocal()
    try:
        seed_default_user_if_needed(db)
        print("Default admin user verified/seeded.")
    finally:
        db.close()

    # 3. Create or replace superstore view mapping analytics_sales to Title Case columns
    create_view_sql = """
    CREATE OR REPLACE VIEW superstore AS 
    SELECT 
        row_id AS "Row ID",
        order_id AS "Order ID",
        order_date AS "Order Date",
        ship_date AS "Ship Date",
        ship_mode AS "Ship Mode",
        customer_id AS "Customer ID",
        customer_name AS "Customer Name",
        segment AS "Segment",
        country AS "Country",
        city AS "City",
        state AS "State",
        postal_code AS "Postal Code",
        region AS "Region",
        product_id AS "Product ID",
        category AS "Category",
        sub_category AS "Sub-Category",
        product_name AS "Product Name",
        sales AS "Sales",
        quantity AS "Quantity",
        discount AS "Discount",
        profit AS "Profit"
    FROM analytics_sales;
    """

    with engine.begin() as conn:
        conn.execute(text(create_view_sql))
        print("View 'superstore' created successfully in PostgreSQL!")

    # 4. Check if customers table is populated, if not populate from analytics_customers
    with engine.begin() as conn:
        cust_count = conn.execute(text("SELECT COUNT(*) FROM customers")).scalar()
        if cust_count == 0:
            print("Populating 'customers' table from analytics_customers...")
            conn.execute(text("""
                INSERT INTO customers (name, email, status)
                SELECT 
                    customer_name AS name,
                    LOWER(REPLACE(customer_id, ' ', '')) || '@example.com' AS email,
                    'active' AS status
                FROM analytics_customers
                ON CONFLICT DO NOTHING;
            """))
            print("Customers table populated.")

    # 5. Check if products table is populated, if not populate from analytics_products
    with engine.begin() as conn:
        try:
            prod_count = conn.execute(text("SELECT COUNT(*) FROM products")).scalar()
            if prod_count == 0:
                print("Populating 'products' table from analytics_products...")
                conn.execute(text("""
                    INSERT INTO products (product_name, category, sub_category, price)
                    SELECT 
                        product_name,
                        category,
                        sub_category,
                        avg_sales AS price
                    FROM analytics_products
                    ON CONFLICT DO NOTHING;
                """))
                print("Products table populated.")
        except Exception as e:
            print(f"Products table populate note: {e}")

    print("PostgreSQL initialization complete! Everything is ready.")


if __name__ == "__main__":
    init_postgres()
