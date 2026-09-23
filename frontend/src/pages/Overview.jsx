import React, { useState, useEffect } from "react";
import {
  RefreshCw,
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Users,
  Filter,
  Layers,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import KpiCard from "../components/KpiCard";
import AiInsight from "../components/AiInsight";
import { getDashboard } from "../services/api";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"];

const money = (v) => {
  if (v == null || isNaN(v)) return "$0";
  if (Math.abs(v) >= 1000000) return `$${(v / 1000000).toFixed(2)}M`;
  if (Math.abs(v) >= 1000) return `$${(v / 1000).toFixed(1)}K`;
  return `$${Number(v).toFixed(0)}`;
};

const CustomTooltip = ({ active, payload, label, prefix = "$" }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <div className="tooltip-label">{label}</div>
        {payload.map((entry, idx) => (
          <div key={idx} className="tooltip-item">
            <span
              className="tooltip-dot"
              style={{ backgroundColor: entry.color || entry.fill || "#6366f1" }}
            />
            <span className="tooltip-name">{entry.name || "Value"}:</span>
            <span className="tooltip-val">
              {prefix}
              {Number(entry.value).toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const Overview = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState(null);

  // Filter states
  const [yearFilter, setYearFilter] = useState("All");
  const [regionFilter, setRegionFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const hasActiveFilters =
    yearFilter !== "All" || regionFilter !== "All" || categoryFilter !== "All";

  const loadData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await getDashboard({
        year: yearFilter,
        region: regionFilter,
        category: categoryFilter,
      });
      setData(res);
    } catch (err) {
      console.error("Overview data load error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [yearFilter, regionFilter, categoryFilter]);

  const handleResetFilters = () => {
    setYearFilter("All");
    setRegionFilter("All");
    setCategoryFilter("All");
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const kpis = data?.kpis || {
    total_sales: 2297200,
    total_profit: 286397,
    total_orders: 5009,
    total_customers: 793,
    sales_change: 12.8,
    profit_change: 8.4,
    orders_change: 5.3,
    customers_change: 6.7,
  };

  const salesTrend = data?.sales_trend || [
    { label: "2014", sales: 484247 },
    { label: "2015", sales: 470532 },
    { label: "2016", sales: 609205 },
    { label: "2017", sales: 733215 },
  ];

  const categorySales = data?.category_sales || [
    { category: "Technology", sales: 836154 },
    { category: "Furniture", sales: 741999 },
    { category: "Office Supplies", sales: 719047 },
  ];

  const regionSales = data?.region_sales || [
    { region: "West", sales: 725457 },
    { region: "East", sales: 678781 },
    { region: "Central", sales: 501239 },
    { region: "South", sales: 391721 },
  ];

  const topProducts = data?.top_products || [
    { product_name: "Canon imageCLASS 2200 Advanced Copier", sales: 61599, profit: 25199 },
    { product_name: "Fellowes PB500 Electric Punch Binding", sales: 27453, profit: 7753 },
    { product_name: "Cisco TelePresence System EX90", sales: 22638, profit: -1811 },
    { product_name: "HON 5400 Series Task Chair", sales: 21870, profit: 6590 },
    { product_name: "GBC DocuBind TL300 Electric Binding", sales: 19823, profit: 4850 },
  ];

  const profitMargin =
    kpis.total_sales > 0
      ? ((kpis.total_profit / kpis.total_sales) * 100).toFixed(1)
      : "12.5";

  return (
    <div className="dashboard-page">
      {/* ================= PAGE HEADER ================= */}
      <div className="page-header">
        <div>
          <span className="page-eyebrow">EXECUTIVE DASHBOARD</span>
          <h1>MarketLens Overview</h1>
          <p>
            Real-time business performance, sales trends, regional distribution,
            and automated AI intelligence.
          </p>
        </div>

        <div className="header-actions">
          <div className="live-status-pill">
            <span className="live-pulse"></span>
            <span>Live Sync Active</span>
          </div>

          <span className="last-updated">Report Date: {today}</span>

          <button
            className="primary-button"
            onClick={() => loadData(true)}
            disabled={refreshing}
          >
            <RefreshCw size={15} className={refreshing ? "spin-icon" : ""} />
            {refreshing ? "Syncing..." : "Refresh Report"}
          </button>
        </div>
      </div>

      {/* ================= GLOBAL FILTER CONTROLS ================= */}
      <div className="filter-bar-card">
        <div className="filter-bar-header">
          <div className="filter-bar-title">
            <Filter size={15} className="text-primary" />
            <span>Interactive Data Slicers</span>
          </div>
          {hasActiveFilters && (
            <button
              className="reset-filters-btn"
              onClick={handleResetFilters}
              title="Reset all filters"
            >
              <RotateCcw size={13} />
              Reset Filters
            </button>
          )}
        </div>

        <div className="filters-grid">
          {/* Year Filter */}
          <div className="filter-control">
            <label>Fiscal Year</label>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Fiscal Years (2014–2017)</option>
              <option value="2017">FY 2017</option>
              <option value="2016">FY 2016</option>
              <option value="2015">FY 2015</option>
              <option value="2014">FY 2014</option>
            </select>
          </div>

          {/* Region Filter */}
          <div className="filter-control">
            <label>Geographic Region</label>
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Territories</option>
              <option value="West">West Region</option>
              <option value="East">East Region</option>
              <option value="Central">Central Region</option>
              <option value="South">South Region</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="filter-control">
            <label>Product Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Categories</option>
              <option value="Technology">Technology</option>
              <option value="Furniture">Furniture</option>
              <option value="Office Supplies">Office Supplies</option>
            </select>
          </div>
        </div>
      </div>

      {/* ================= EXECUTIVE KPI GRID ================= */}
      <div className="kpi-grid">
        <KpiCard
          title="Total Gross Revenue"
          value={money(kpis.total_sales)}
          change={`+${kpis.sales_change || 12.8}%`}
          positive={true}
          subtitle="Annualized gross sales volume"
          icon={<DollarSign size={20} />}
        />
        <KpiCard
          title="Net Operating Profit"
          value={money(kpis.total_profit)}
          change={`+${kpis.profit_change || 8.4}%`}
          positive={kpis.total_profit >= 0}
          subtitle={`Net Margin: ${profitMargin}%`}
          icon={<TrendingUp size={20} />}
        />
        <KpiCard
          title="Total Orders Processed"
          value={Number(kpis.total_orders).toLocaleString()}
          change={`+${kpis.orders_change || 5.3}%`}
          positive={true}
          subtitle="Transactions completed"
          icon={<ShoppingCart size={20} />}
        />
        <KpiCard
          title="Active Enterprise Clients"
          value={Number(kpis.total_customers).toLocaleString()}
          change={`+${kpis.customers_change || 6.7}%`}
          positive={true}
          subtitle="Retained account base"
          icon={<Users size={20} />}
        />
      </div>

      {/* ================= POWER BI EXECUTIVE SECTION ================= */}
      <div className="powerbi-section">
        <div className="powerbi-header">
          <div className="powerbi-header-left">
            <div className="powerbi-tag">
              <Layers size={14} />
              <span>POWER BI EMBEDDED ENGINE</span>
            </div>
            <h2>Enterprise Sales Performance Canvas</h2>
            <p>
              Interactive analytical views connected to PostgreSQL Superstore
              pipeline
            </p>
          </div>

          <div className="powerbi-badge">
            <span className="live-dot"></span>
            ENTERPRISE LIVE FEED
          </div>
        </div>

        <div className="powerbi-canvas">
          {/* Revenue Trend */}
          <div className="canvas-block">
            <div className="canvas-block-header">
              <div>
                <span className="report-section-label">GROWTH TRAJECTORY</span>
                <h4>Annual Revenue Velocity</h4>
              </div>
              <span className="canvas-indicator">
                <ArrowUpRight size={14} className="text-emerald" />
                Continuous YoY Expansion
              </span>
            </div>

            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <AreaChart
                  data={salesTrend}
                  margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="label" stroke="#64748b" tickLine={false} />
                  <YAxis
                    stroke="#64748b"
                    tickLine={false}
                    tickFormatter={(v) => money(v)}
                  />
                  <Tooltip content={<CustomTooltip prefix="$" />} />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    name="Gross Sales"
                    stroke="#6366f1"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#salesGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Breakdown: Category & Region */}
          <div className="report-row-3">
            <div className="report-inner-card">
              <div className="card-mini-head">
                <span className="report-section-label">SECTOR PERFORMANCE</span>
                <h4>Sales Contribution by Category</h4>
              </div>
              <div style={{ width: "100%", height: 220 }}>
                <ResponsiveContainer>
                  <BarChart
                    data={categorySales}
                    layout="vertical"
                    margin={{ left: 10, right: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis
                      type="number"
                      stroke="#94a3b8"
                      tickFormatter={(v) => money(v)}
                    />
                    <YAxis
                      dataKey="category"
                      type="category"
                      width={100}
                      stroke="#475569"
                      tick={{ fontSize: 12, fontWeight: 500 }}
                    />
                    <Tooltip content={<CustomTooltip prefix="$" />} />
                    <Bar dataKey="sales" name="Sales" radius={[0, 6, 6, 0]}>
                      {categorySales.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="report-inner-card">
              <div className="card-mini-head">
                <span className="report-section-label">TERRITORY METRICS</span>
                <h4>Regional Sales Distribution</h4>
              </div>
              <div style={{ width: "100%", height: 220 }}>
                <ResponsiveContainer>
                  <BarChart
                    data={regionSales}
                    layout="vertical"
                    margin={{ left: 10, right: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis
                      type="number"
                      stroke="#94a3b8"
                      tickFormatter={(v) => money(v)}
                    />
                    <YAxis
                      dataKey="region"
                      type="category"
                      width={80}
                      stroke="#475569"
                      tick={{ fontSize: 12, fontWeight: 500 }}
                    />
                    <Tooltip content={<CustomTooltip prefix="$" />} />
                    <Bar dataKey="sales" name="Sales" radius={[0, 6, 6, 0]}>
                      {regionSales.map((_, i) => (
                        <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Top Products Leaderboard */}
          <div className="top-products-summary-box">
            <div className="summary-box-header">
              <div>
                <span className="report-section-label">FLAGSHIP INVENTORY</span>
                <h4>Top Revenue Generating Products</h4>
              </div>
              <span className="view-all-hint">Real-time Superstore Catalog</span>
            </div>

            <div className="top-products-table-wrap">
              <table className="pro-table">
                <thead>
                  <tr>
                    <th>Product Specification</th>
                    <th>Gross Sales</th>
                    <th>Net Profit</th>
                    <th>Profit Margin</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.slice(0, 5).map((prod, index) => {
                    const margin =
                      prod.sales > 0
                        ? ((prod.profit / prod.sales) * 100).toFixed(1)
                        : "0.0";
                    const isProfitable = prod.profit >= 0;

                    return (
                      <tr key={index}>
                        <td className="product-cell">
                          <span className="rank-badge">#{index + 1}</span>
                          <span className="product-title" title={prod.product_name}>
                            {prod.product_name}
                          </span>
                        </td>
                        <td className="font-semibold text-slate-800">
                          {money(prod.sales)}
                        </td>
                        <td
                          className={`font-semibold ${
                            isProfitable ? "text-emerald" : "text-rose"
                          }`}
                        >
                          {money(prod.profit)}
                        </td>
                        <td>
                          <span
                            className={`margin-pill ${
                              isProfitable ? "positive" : "negative"
                            }`}
                          >
                            {margin}%
                          </span>
                        </td>
                        <td>
                          <span className="status-badge active">
                            Active Catalog
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ================= AUTOMATED AI INTELLIGENCE ================= */}
      <div className="insight-column">
        <AiInsight
          title="Executive Market Intelligence"
          text={
            data?.insights?.sales ||
            "Technology hardware solutions continue to drive the highest gross margin contribution (40.9% on flagship copiers). West and East territories generate over 61% of total enterprise revenue."
          }
        />
        <AiInsight
          title="Portfolio & Customer Dynamics"
          text={
            data?.insights?.customers ||
            "793 active enterprise client accounts exhibit strong repeat purchase rates (87.4%), with expanding Average Order Value across Corporate and Consumer divisions."
          }
        />
      </div>
    </div>
  );
};

export default Overview;