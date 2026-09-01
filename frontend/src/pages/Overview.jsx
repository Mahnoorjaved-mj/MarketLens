import React, { useState } from "react";
import { RefreshCw, DollarSign, TrendingUp, ShoppingCart, Users } from "lucide-react";
import KpiCard from "../components/KpiCard";
import ChartCard from "../components/ChartCard";
import AiInsight from "../components/AiInsight";

import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Cell,
} from "recharts";

const COLORS = ["#6C63FF", "#00C49F", "#FFB547", "#FF6B81"];

const salesByYear = [
  { year: "2014", sales: 505000 },
  { year: "2015", sales: 490000 },
  { year: "2016", sales: 610000 },
  { year: "2017", sales: 700000 },
];

const salesByCategory = [
  { category: "Technology", sales: 836000 },
  { category: "Furniture", sales: 742000 },
  { category: "Office Supplies", sales: 718000 },
];

const salesByRegion = [
  { region: "West", sales: 725000 },
  { region: "East", sales: 678000 },
  { region: "Central", sales: 501000 },
  { region: "South", sales: 391000 },
];

const salesByProduct = [
  { product: "Canon imageCLASS 220...", sales: 61600 },
  { product: "Fellowes PB500 Electric", sales: 27400 },
  { product: "Cisco TelePresence Syst", sales: 25200 },
  { product: "HON 5400 Series Task C", sales: 21300 },
  { product: "GBC DocuBind TL300 El", sales: 19800 },
  { product: "GBC Ibimaster 500 Man", sales: 18100 },
  { product: "Hewlett Packard LaserJe", sales: 16900 },
  { product: "HP Designjet T520 Inkje", sales: 15400 },
];

const profitByYear = [
  { year: "2014", profit: 51000 },
  { year: "2015", profit: 62000 },
  { year: "2016", profit: 78000 },
  { year: "2017", profit: 95400 },
];

const money = (v) =>
  v >= 1000000 ? `$${(v / 1000000).toFixed(2)}M` : `$${(v / 1000).toFixed(0)}K`;

const Overview = () => {
  const [refreshing, setRefreshing] = useState(false);

  const refreshDashboard = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 900);
  };

  return (
    <div className="dashboard-page">

      {/* ================= HEADER ================= */}

      <div className="page-header">
        <div>
          <span className="page-eyebrow">BUSINESS INTELLIGENCE</span>
          <h1>MarketLens Overview</h1>
          <p>
            Monitor business performance, sales trends,
            customers and intelligent insights from one workspace.
          </p>
        </div>

        <button className="primary-button" onClick={refreshDashboard} disabled={refreshing}>
          <RefreshCw size={17} className={refreshing ? "spin-icon" : ""} />
          {refreshing ? "Refreshing..." : "Refresh Report"}
        </button>
      </div>

      {/* ================= KPI ================= */}

      <div className="kpi-grid">
        <KpiCard title="Total Sales" value="$2.30M" change="+12.8%" icon={<DollarSign size={20} />} />
        <KpiCard title="Total Profit" value="$286.40K" change="+8.4%" icon={<TrendingUp size={20} />} />
        <KpiCard title="Total Orders" value="5K" change="+5.3%" icon={<ShoppingCart size={20} />} />
        <KpiCard title="Total Customers" value="793" change="+6.7%" icon={<Users size={20} />} />
      </div>

      {/* ================= MAIN REPORT CARD ================= */}

      <div className="powerbi-section">

        <div className="powerbi-header">
          <div>
            <h2>Sales Intelligence Dashboard</h2>
            <p>Interactive analytics built from your business data</p>
          </div>
          <div className="powerbi-badge">
            <span className="live-dot"></span>
            LIVE REPORT
          </div>
        </div>

        {/* Sales by Year - full width */}
        <div className="report-inner-card">
          <h4>Total Sales by Year</h4>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={salesByYear}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="year" />
                <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                <Tooltip formatter={(v) => money(v)} />
                <Line
                  type="monotone" dataKey="sales" stroke="#6C63FF"
                  strokeWidth={4} dot={{ r: 5 }} activeDot={{ r: 8 }}
                  animationDuration={1100}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="report-row-3">
          <div className="report-inner-card">
            <h4>Total Sales by Category</h4>
            <div style={{ width: "100%", height: 220 }}>
              <ResponsiveContainer>
                <BarChart data={salesByCategory} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                  <YAxis dataKey="category" type="category" width={90} />
                  <Tooltip formatter={(v) => money(v)} />
                  <Bar dataKey="sales" radius={[0, 8, 8, 0]} animationDuration={1100}>
                    {salesByCategory.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="report-inner-card">
            <h4>Total Sales by Region</h4>
            <div style={{ width: "100%", height: 220 }}>
              <ResponsiveContainer>
                <BarChart data={salesByRegion} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                  <YAxis dataKey="region" type="category" width={70} />
                  <Tooltip formatter={(v) => money(v)} />
                  <Bar dataKey="sales" radius={[0, 8, 8, 0]} animationDuration={1100}>
                    {salesByRegion.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="report-row-2">
          <div className="report-inner-card">
            <h4>Total Sales by Product Name</h4>
            <div style={{ width: "100%", height: 280 }}>
              <ResponsiveContainer>
                <BarChart data={salesByProduct} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                  <YAxis dataKey="product" type="category" width={140} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(v) => money(v)} />
                  <Bar dataKey="sales" radius={[0, 8, 8, 0]} fill="#6C63FF" animationDuration={1100} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="report-inner-card">
            <h4>Sum of Profit by Year</h4>
            <div style={{ width: "100%", height: 280 }}>
              <ResponsiveContainer>
                <BarChart data={profitByYear}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                  <Tooltip formatter={(v) => money(v)} />
                  <Bar dataKey="profit" radius={[8, 8, 0, 0]} animationDuration={1100}>
                    {profitByYear.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>

      {/* ================= AI INSIGHTS ================= */}

      <div className="insight-column">
        <AiInsight
          title="AI Sales Insight"
          text="Technology continues to lead category performance, with total sales climbing steadily since 2015 and a sharp acceleration into 2016–2017."
        />
        <AiInsight
          title="Customer Intelligence"
          text="793 active customers are driving consistent order volume, with the West and East regions contributing the largest share of revenue."
        />
      </div>

    </div>
  );
};

export default Overview;