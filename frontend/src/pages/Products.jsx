import React, { useState, useEffect } from "react";
import ChartCard from "../components/ChartCard";
import KpiCard from "../components/KpiCard";
import { getProducts } from "../services/api";
import {
  Package,
  Layers,
  Sparkles,
  TrendingUp,
  Search,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  BarChart3,
} from "lucide-react";

import {
  ResponsiveContainer,
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
  if (Math.abs(v) >= 1000) return `$${(v / 1000).toFixed(1)}K`;
  return `$${Number(v).toFixed(0)}`;
};

const Products = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const loadData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await getProducts();
      setData(res);
    } catch (err) {
      console.error("Products error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const kpis = data?.kpis || {
    total_products: 1850,
    top_category: "Technology",
    best_seller_sales: "$61.6K",
    avg_margin: "12.4%",
  };

  const categories = data?.categories || [
    { category: "Technology", sales: 836154, margin: "17.4%" },
    { category: "Furniture", sales: 741999, margin: "2.5%" },
    { category: "Office Supplies", sales: 719047, margin: "16.8%" },
  ];

  const rawProducts = data?.products || [];

  const filteredProducts = rawProducts.filter((p) => {
    const matchesSearch =
      !search ||
      p.product_name?.toLowerCase().includes(search.toLowerCase()) ||
      p.sub_category?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="dashboard-page">
      {/* ================= PAGE HEADER ================= */}
      <div className="page-header">
        <div>
          <span className="page-eyebrow">PORTFOLIO INTELLIGENCE</span>
          <h1>Products & Inventory</h1>
          <p>
            Assess product performance, profit contributions, margin health,
            and catalog velocity.
          </p>
        </div>

        <div className="header-actions">
          <button
            className="primary-button"
            onClick={() => loadData(true)}
            disabled={refreshing}
          >
            <RefreshCw size={15} className={refreshing ? "spin-icon" : ""} />
            {refreshing ? "Refreshing..." : "Sync Catalog"}
          </button>
        </div>
      </div>

      {/* ================= KPI GRID ================= */}
      <div className="kpi-grid">
        <KpiCard
          title="Active Catalog SKUs"
          value={Number(kpis.total_products).toLocaleString()}
          change="+8.2%"
          positive={true}
          subtitle="Monitored commercial items"
          icon={<Package size={20} />}
        />
        <KpiCard
          title="Highest Volume Category"
          value={kpis.top_category || "Technology"}
          change="+18.4%"
          positive={true}
          subtitle="41.2% total sales share"
          icon={<Layers size={20} />}
        />
        <KpiCard
          title="Top Flagship Item Sales"
          value={kpis.best_seller_sales || "$61.6K"}
          change="+14.2%"
          positive={true}
          subtitle="Canon imageCLASS Copier"
          icon={<Sparkles size={20} />}
        />
        <KpiCard
          title="Average Portfolio Margin"
          value={kpis.avg_margin || "12.4%"}
          change="+2.1%"
          positive={true}
          subtitle="Overall net product margin"
          icon={<TrendingUp size={20} />}
        />
      </div>

      {/* ================= LEADERBOARD & CATEGORY ================= */}
      <div className="two-column-grid">
        {/* Top Products Leaderboard */}
        <ChartCard
          title="Flagship Revenue Drivers"
          subtitle="Top generating product lines ranked by cumulative sales"
        >
          <div className="product-performance-list">
            {rawProducts.slice(0, 5).map((product, index) => {
              const salesNum = product.sales || product.total_sales || 50000;
              const maxSales = 65000;
              const pct = Math.min(100, Math.round((salesNum / maxSales) * 100));

              return (
                <div
                  className="product-performance-item"
                  key={product.product_name || index}
                >
                  <div className="product-rank">#{index + 1}</div>
                  <div className="product-info-wrap">
                    <strong className="product-title" title={product.product_name}>
                      {product.product_name}
                    </strong>
                    <div className="product-meta-row">
                      <span className="product-subcat">
                        {product.category} • {product.sub_category}
                      </span>
                      <span className="product-progress-track">
                        <span
                          className="product-progress-bar"
                          style={{ width: `${pct}%` }}
                        />
                      </span>
                    </div>
                  </div>
                  <div className="product-sales-col">
                    <strong className="product-sales-val">
                      {money(salesNum)}
                    </strong>
                    <span className="growth-badge">{product.growth || "+12%"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </ChartCard>

        {/* Category Contribution Chart */}
        <ChartCard
          title="Category Sales Performance"
          subtitle="Revenue distribution by primary merchandise department"
        >
          <div className="chart-box" style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categories}
                layout="vertical"
                margin={{ left: 15, right: 20 }}
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
                  width={110}
                  stroke="#475569"
                  tick={{ fontSize: 12, fontWeight: 600 }}
                />
                <Tooltip formatter={(v) => `$${Number(v).toLocaleString()}`} />
                <Bar dataKey="sales" name="Sales" radius={[0, 8, 8, 0]}>
                  {categories.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* ================= COMPREHENSIVE PRODUCT CATALOG TABLE ================= */}
      <div className="report-card">
        <div className="report-card-header">
          <div>
            <h3>Comprehensive Product Catalog</h3>
            <p>
              Detailed view of sales volume, margins, and operational profitability
            </p>
          </div>
          <span className="report-card-pill">
            {filteredProducts.length} Items Listed
          </span>
        </div>

        {/* Controls */}
        <div className="directory-controls">
          <div className="table-search-box">
            <Search size={15} className="table-search-icon" />
            <input
              type="text"
              placeholder="Search product title, category or sub-category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="segment-filter-tabs">
            {["All", "Technology", "Furniture", "Office Supplies"].map((cat) => (
              <button
                key={cat}
                className={`tab-btn ${selectedCategory === cat ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="pro-table">
            <thead>
              <tr>
                <th>Product Information</th>
                <th>Category</th>
                <th>Sub-Category</th>
                <th>Gross Sales</th>
                <th>Profit Margin</th>
                <th>Profitability</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-500">
                    No products matched your search filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p, idx) => {
                  const sales = p.sales || p.total_sales || 0;
                  const profit = p.profit || p.total_profit || sales * 0.15;
                  const marginPct =
                    sales > 0 ? ((profit / sales) * 100).toFixed(1) : "0.0";
                  const isProfitable = profit >= 0;

                  return (
                    <tr key={p.product_id || idx}>
                      <td>
                        <strong className="product-table-title" title={p.product_name}>
                          {p.product_name}
                        </strong>
                      </td>
                      <td>
                        <span className="category-pill">{p.category}</span>
                      </td>
                      <td className="text-slate-600 font-medium">
                        {p.sub_category || "General"}
                      </td>
                      <td className="font-bold text-slate-900">
                        {money(sales)}
                      </td>
                      <td>
                        <span
                          className={`margin-pill ${
                            isProfitable ? "positive" : "negative"
                          }`}
                        >
                          {marginPct}%
                        </span>
                      </td>
                      <td>
                        {isProfitable ? (
                          <span className="status-badge active">
                            <CheckCircle size={12} className="inline mr-1" />
                            Profitable
                          </span>
                        ) : (
                          <span className="status-badge negative">
                            <AlertTriangle size={12} className="inline mr-1" />
                            Loss Leader
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Products;