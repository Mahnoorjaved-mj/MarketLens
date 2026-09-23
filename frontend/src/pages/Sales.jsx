import React, { useState, useEffect } from "react";
import ChartCard from "../components/ChartCard";
import KpiCard from "../components/KpiCard";
import { getSales } from "../services/api";
import {
  DollarSign,
  TrendingUp,
  Receipt,
  BarChart3,
  Calendar,
  Layers,
  ArrowUpRight,
  RefreshCw,
} from "lucide-react";

import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"];

const money = (v) => {
  if (v == null || isNaN(v)) return "$0";
  if (Math.abs(v) >= 1000000) return `$${(v / 1000000).toFixed(2)}M`;
  if (Math.abs(v) >= 1000) return `$${(v / 1000).toFixed(1)}K`;
  return `$${Number(v).toFixed(0)}`;
};

const CustomTooltip = ({ active, payload, label }) => {
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
            <span className="tooltip-name">{entry.name}:</span>
            <span className="tooltip-val">
              ${Number(entry.value).toLocaleString(undefined, {
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

const Sales = () => {
  const [salesData, setSalesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const data = await getSales();
      setSalesData(data);
    } catch (err) {
      console.error("Sales data error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const kpis = salesData?.kpis || {
    total_revenue: 2297200,
    gross_profit: 286397,
    avg_order_value: 458,
    sales_growth: 18.2,
  };

  const revenueTrend = salesData?.revenue_trend || [
    { month: "Jan", revenue: 142000, profit: 16500 },
    { month: "Feb", revenue: 130000, profit: 14800 },
    { month: "Mar", revenue: 205000, profit: 26000 },
    { month: "Apr", revenue: 182000, profit: 21500 },
    { month: "May", revenue: 218000, profit: 27800 },
    { month: "Jun", revenue: 245000, profit: 32000 },
    { month: "Jul", revenue: 232000, profit: 28500 },
    { month: "Aug", revenue: 268000, profit: 34200 },
    { month: "Sep", revenue: 312000, profit: 41000 },
    { month: "Oct", revenue: 275000, profit: 36200 },
    { month: "Nov", revenue: 356000, profit: 45800 },
    { month: "Dec", revenue: 384000, profit: 51200 },
  ];

  const distribution = salesData?.distribution || [
    { name: "Consumer", value: 51.5, revenue: 1183261 },
    { name: "Corporate", value: 30.2, revenue: 694082 },
    { name: "Home Office", value: 18.3, revenue: 419857 },
  ];

  return (
    <div className="dashboard-page">
      {/* ================= PAGE HEADER ================= */}
      <div className="page-header">
        <div>
          <span className="page-eyebrow">COMMERCIAL INTELLIGENCE</span>
          <h1>Sales Intelligence</h1>
          <p>
            Track revenue velocity, margin trajectories, and segment breakdown
            across all sales channels.
          </p>
        </div>

        <div className="header-actions">
          <button
            className="primary-button"
            onClick={() => loadData(true)}
            disabled={refreshing}
          >
            <RefreshCw size={15} className={refreshing ? "spin-icon" : ""} />
            {refreshing ? "Refreshing..." : "Sync Sales Data"}
          </button>
        </div>
      </div>

      {/* ================= KPI GRID ================= */}
      <div className="kpi-grid">
        <KpiCard
          title="Total Sales Revenue"
          value={money(kpis.total_revenue)}
          change="+12.8%"
          positive={true}
          subtitle="Cumulative sales pipeline"
          icon={<DollarSign size={20} />}
        />
        <KpiCard
          title="Gross Operating Profit"
          value={money(kpis.gross_profit)}
          change="+8.4%"
          positive={true}
          subtitle="12.5% gross profit margin"
          icon={<TrendingUp size={20} />}
        />
        <KpiCard
          title="Average Order Value (AOV)"
          value={`$${Number(kpis.avg_order_value || 458).toFixed(0)}`}
          change="+5.3%"
          positive={true}
          subtitle="Revenue per distinct order"
          icon={<Receipt size={20} />}
        />
        <KpiCard
          title="Annualized Sales Growth"
          value={`${kpis.sales_growth || 18.2}%`}
          change="+3.4%"
          positive={true}
          subtitle="Year-over-year expansion rate"
          icon={<BarChart3 size={20} />}
        />
      </div>

      {/* ================= TWO COLUMN CHARTS ================= */}
      <div className="two-column-grid">
        {/* Monthly Trend with Revenue & Profit */}
        <ChartCard
          title="Monthly Revenue & Profit Velocity"
          subtitle="Monthly gross sales volume vs operating profit"
          action={
            <div className="chart-legend-pills">
              <span className="pill-dot revenue"></span> Revenue
              <span className="pill-dot profit"></span> Profit
            </div>
          }
        >
          <div className="chart-box" style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#64748b" tickLine={false} />
                <YAxis
                  yAxisId="left"
                  stroke="#64748b"
                  tickLine={false}
                  tickFormatter={(v) => money(v)}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  yAxisId="left"
                  dataKey="revenue"
                  name="Gross Revenue"
                  fill="#6366f1"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={40}
                />
                {revenueTrend[0]?.profit !== undefined && (
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="profit"
                    name="Operating Profit"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#10b981" }}
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Customer Segment Distribution */}
        <ChartCard
          title="Market Segment Distribution"
          subtitle="Revenue contribution by client sector"
        >
          <div className="donut-wrap" style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={75}
                  outerRadius={115}
                  paddingAngle={5}
                >
                  {distribution.map((_, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                      stroke="#ffffff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${Number(v).toFixed(1)}%`} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
            <div className="donut-center-label">
              <strong>{money(kpis.total_revenue)}</strong>
              <span>Total Volume</span>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* ================= DETAILED MONTHLY BREAKDOWN TABLE ================= */}
      <div className="report-card">
        <div className="report-card-header">
          <div>
            <h3>Monthly Sales & Margin Matrix</h3>
            <p>Comprehensive transaction and performance ledger</p>
          </div>
          <span className="report-card-pill">Superstore Ledger</span>
        </div>

        <div className="table-responsive">
          <table className="pro-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Gross Revenue</th>
                <th>Estimated Profit</th>
                <th>Profit Margin</th>
                <th>Target Performance</th>
              </tr>
            </thead>
            <tbody>
              {revenueTrend.map((row, idx) => {
                const profitVal = row.profit || row.revenue * 0.125;
                const margin = ((profitVal / row.revenue) * 100).toFixed(1);
                const isTargetExceeded = row.revenue >= 200000;

                return (
                  <tr key={idx}>
                    <td className="font-semibold text-slate-800">
                      <div className="flex items-center gap-2">
                        <Calendar size={13} className="text-slate-400" />
                        {row.month}
                      </div>
                    </td>
                    <td className="font-semibold text-slate-800">
                      {money(row.revenue)}
                    </td>
                    <td className="font-semibold text-emerald">
                      {money(profitVal)}
                    </td>
                    <td>
                      <span className="margin-pill positive">{margin}%</span>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${
                          isTargetExceeded ? "active" : "pending"
                        }`}
                      >
                        {isTargetExceeded ? "Exceeded Target" : "On Track"}
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
  );
};

export default Sales;