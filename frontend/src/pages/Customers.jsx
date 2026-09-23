import React, { useState, useEffect } from "react";
import ChartCard from "../components/ChartCard";
import KpiCard from "../components/KpiCard";
import { getCustomers } from "../services/api";
import {
  Users,
  UserPlus,
  Repeat,
  Star,
  Search,
  MapPin,
  Award,
  RefreshCw,
  Filter,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#6366f1", "#10b981", "#f59e0b"];

const money = (v) => {
  if (v == null || isNaN(v)) return "$0";
  if (Math.abs(v) >= 1000) return `$${Number(v).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return `$${Number(v).toFixed(2)}`;
};

const Customers = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Search and segment filter
  const [search, setSearch] = useState("");
  const [selectedSegment, setSelectedSegment] = useState("All");

  const loadData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await getCustomers();
      setData(res);
    } catch (err) {
      console.error("Customers data error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const kpis = data?.kpis || {
    total_customers: 793,
    avg_spend: 2896.85,
    retention_rate: 87.4,
    satisfaction: 4.8,
  };

  const growthTrend = data?.growth_trend || [
    { month: "Jan", customers: 520 },
    { month: "Feb", customers: 560 },
    { month: "Mar", customers: 600 },
    { month: "Apr", customers: 645 },
    { month: "May", customers: 690 },
    { month: "Jun", customers: 730 },
    { month: "Jul", customers: 760 },
    { month: "Aug", customers: 793 },
  ];

  const segments = data?.segments || [
    { name: "Consumer", value: 52 },
    { name: "Corporate", value: 31 },
    { name: "Home Office", value: 17 },
  ];

  const rawCustomers = data?.customers || [];

  const filteredCustomers = rawCustomers.filter((c) => {
    const matchesSearch =
      !search ||
      c.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      c.customer_id?.toLowerCase().includes(search.toLowerCase()) ||
      c.city?.toLowerCase().includes(search.toLowerCase()) ||
      c.state?.toLowerCase().includes(search.toLowerCase());

    const matchesSegment =
      selectedSegment === "All" || c.segment === selectedSegment;

    return matchesSearch && matchesSegment;
  });

  return (
    <div className="dashboard-page">
      {/* ================= PAGE HEADER ================= */}
      <div className="page-header">
        <div>
          <span className="page-eyebrow">RELATIONSHIP INTELLIGENCE</span>
          <h1>Customer Analytics</h1>
          <p>
            Monitor account retention, acquisition velocity, lifetime value,
            and segment behavior.
          </p>
        </div>

        <div className="header-actions">
          <button
            className="primary-button"
            onClick={() => loadData(true)}
            disabled={refreshing}
          >
            <RefreshCw size={15} className={refreshing ? "spin-icon" : ""} />
            {refreshing ? "Refreshing..." : "Sync Customer Records"}
          </button>
        </div>
      </div>

      {/* ================= KPI GRID ================= */}
      <div className="kpi-grid">
        <KpiCard
          title="Active Client Base"
          value={Number(kpis.total_customers).toLocaleString()}
          change="+6.7%"
          positive={true}
          subtitle="Registered enterprise accounts"
          icon={<Users size={20} />}
        />
        <KpiCard
          title="Average Customer LTV"
          value={`$${Number(kpis.avg_spend || 2896).toFixed(0)}`}
          change="+12.3%"
          positive={true}
          subtitle="Mean lifetime transaction spend"
          icon={<UserPlus size={20} />}
        />
        <KpiCard
          title="Client Retention Rate"
          value={`${kpis.retention_rate || 87.4}%`}
          change="+4.2%"
          positive={true}
          subtitle="Cohort repeat transaction rate"
          icon={<Repeat size={20} />}
        />
        <KpiCard
          title="Customer Satisfaction"
          value={`${kpis.satisfaction || 4.8} / 5.0`}
          change="+0.4%"
          positive={true}
          subtitle="Executive NPS score rating"
          icon={<Star size={20} />}
        />
      </div>

      {/* ================= CHARTS ================= */}
      <div className="two-column-grid">
        <ChartCard
          title="Cumulative Account Acquisition"
          subtitle="Growth trajectory of active customer accounts"
        >
          <div className="chart-box" style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthTrend}>
                <defs>
                  <linearGradient id="custGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#64748b" tickLine={false} />
                <YAxis stroke="#64748b" tickLine={false} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="customers"
                  name="Active Clients"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fill="url(#custGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Client Segment Composition"
          subtitle="Proportional split of client market segments"
        >
          <div className="donut-wrap" style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={segments}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={70}
                  outerRadius={105}
                  paddingAngle={5}
                >
                  {segments.map((_, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                      stroke="#ffffff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* ================= INTERACTIVE HIGH-VALUE CUSTOMER DIRECTORY ================= */}
      <div className="report-card">
        <div className="report-card-header">
          <div>
            <h3>High-Value Client Directory</h3>
            <p>
              Ranked accounts sorted by cumulative lifetime transaction value
            </p>
          </div>
          <span className="report-card-pill">
            Showing {filteredCustomers.length} Accounts
          </span>
        </div>

        {/* Directory Controls */}
        <div className="directory-controls">
          <div className="table-search-box">
            <Search size={15} className="table-search-icon" />
            <input
              type="text"
              placeholder="Search by customer name, account ID, city or state..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="segment-filter-tabs">
            {["All", "Consumer", "Corporate", "Home Office"].map((seg) => (
              <button
                key={seg}
                className={`tab-btn ${selectedSegment === seg ? "active" : ""}`}
                onClick={() => setSelectedSegment(seg)}
              >
                {seg}
              </button>
            ))}
          </div>
        </div>

        {/* Customer Directory Table */}
        <div className="table-responsive">
          <table className="pro-table">
            <thead>
              <tr>
                <th>Client Account</th>
                <th>Segment</th>
                <th>Territory / Location</th>
                <th>Total Orders</th>
                <th>Lifetime Spend (LTV)</th>
                <th>Account Tier</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-500">
                    No client accounts match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust, idx) => {
                  const spend = cust.total_spent || 0;
                  const tier =
                    cust.tier ||
                    (spend > 10000
                      ? "Platinum"
                      : spend > 7000
                      ? "Gold"
                      : "Silver");

                  return (
                    <tr key={cust.customer_id || idx}>
                      <td>
                        <div className="client-info-cell">
                          <div className="client-avatar">
                            {cust.customer_name?.charAt(0) || "C"}
                          </div>
                          <div>
                            <strong className="client-name">
                              {cust.customer_name}
                            </strong>
                            <span className="client-id">
                              ID: {cust.customer_id}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="segment-tag">{cust.segment}</span>
                      </td>
                      <td>
                        <div className="location-cell">
                          <MapPin size={13} className="text-slate-400" />
                          <span>
                            {cust.city}, {cust.state}
                          </span>
                        </div>
                      </td>
                      <td className="font-semibold text-slate-700">
                        {cust.total_orders || 1} orders
                      </td>
                      <td className="font-bold text-slate-900">
                        {money(spend)}
                      </td>
                      <td>
                        <span
                          className={`tier-badge ${tier.toLowerCase()}`}
                        >
                          <Award size={12} className="inline mr-1" />
                          {tier}
                        </span>
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

export default Customers;