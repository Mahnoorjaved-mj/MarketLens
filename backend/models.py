from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func

try:
    from backend.database import Base
except ImportError:
    from database import Base


# =========================
# USERS
# =========================
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


# =========================
# CUSTOMERS
# =========================
class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    status = Column(String(20), default="active")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


# =========================
# SALES
# =========================

class Sale(Base):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"))
    amount = Column(Float, nullable=False)
    sale_date = Column(DateTime(timezone=True), server_default=func.now())


# =========================
# FORECAST METRICS
# =========================
class ForecastMetric(Base):
    __tablename__ = "forecast_metrics"

    id = Column(Integer, primary_key=True, index=True)
    accuracy = Column(Float, nullable=False)
    forecast_revenue = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())