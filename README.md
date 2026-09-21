# MarketLens 📊

> **AI-Powered Business & Sales Intelligence Platform**  
> Interactive analytics, ML-driven forecasting, anomaly detection, and enterprise Power BI reporting.

---

## 🌟 Key Features
- **Predictive Sales Forecasting:** Integrated machine learning models for trend and revenue projections.
- **Anomaly Detection:** Automatic identification of abnormal sales spikes and drops.
- **Dual Visual Intelligence:** 
  - Interactive custom web dashboard built with **React, Vite, Tailwind CSS & Recharts**.
  - Enterprise **Power BI** dashboard (`.pbix`) for executive decision-making.
- **Automated Data Pipeline:** ETL scripts for cleaning, transformation, and ingestion.

---

## 🏗️ Architecture & Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React, Vite, Tailwind CSS, Recharts, Lucide Icons |
| **Backend API** | FastAPI, Uvicorn, SQLAlchemy |
| **Data & ML** | Pandas, Scikit-Learn, NumPy |
| **BI & Reporting** | Microsoft Power BI (`MarketLens_Sales_Dashboard.pbix`) |
| **Database** | PostgreSQL / MongoDB supported |

---

## 🚀 Quickstart

### 1. Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Power BI Dashboard
Open `powerbi/MarketLens_Sales_Dashboard.pbix` in **Power BI Desktop** to view and interact with the enterprise reports.
