import ChartCard from "../components/ChartCard";
import KpiCard from "../components/KpiCard";
import React from "react";
import { DollarSign, TrendingUp, Receipt, BarChart3 } from "lucide-react";

import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Cell, PieChart, Pie, Legend,
} from "recharts";

const COLORS = ["#6C63FF", "#00C49F", "#FFB547", "#FF6B81"];

const revenueTrend = [
  { month: "Jan", revenue: 210000 },
  { month: "Feb", revenue: 245000 },
  { month: "Mar", revenue: 198000 },
  { month: "Apr", revenue: 268000 },
  { month: "May", revenue: 302000 },
  { month: "Jun", revenue: 356000 },
  { month: "Jul", revenue: 318000 },
  { month: "Aug", revenue: 384000 },
];

const distribution = [
  { name: "Consumer", value: 52 },
  { name: "Corporate", value: 31 },
  { name: "Home Office", value: 17 },
];

const Sales = () => {
  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <span className="page-eyebrow">SALES ANALYTICS</span>
          <h1>Sales Intelligence</h1>
          <p>Analyze revenue, profit trends and sales performance.</p>
        </div>
      </div>

      <div className="kpi-grid">
        <KpiCard title="Total Revenue" value="$2.30M" change="+12.8%" icon={<DollarSign />} />
        <KpiCard title="Gross Profit" value="$286K" change="+8.4%" icon={<TrendingUp />} />
        <KpiCard title="Average Order Value" value="$458" change="+5.3%" icon={<Receipt />} />
        <KpiCard title="Sales Growth" value="18.2%" change="+3.4%" icon={<BarChart3 />} />
      </div>

      <div className="two-column-grid">
        <ChartCard title="Revenue Trend" subtitle="Monthly sales performance">
          <div className="chart-box">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                <Tooltip formatter={(v) => `$${v.toLocaleString()}`} />
                <Bar dataKey="revenue" radius={[10, 10, 0, 0]} animationDuration={1200}>
                  {revenueTrend.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Sales Distribution" subtitle="Performance by segment">
          <div className="donut-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={4}
                  animationDuration={1200}
                >
                  {distribution.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
            <div className="donut-center-label">
              <strong>2.30M</strong>
              <span>Total Sales</span>
            </div>
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default Sales;