import ChartCard from "../components/ChartCard";
import KpiCard from "../components/KpiCard";
import React from "react";
import { Users, UserPlus, Repeat, Star } from "lucide-react";

import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend,
} from "recharts";

const COLORS = ["#6C63FF", "#00C49F", "#FFB547"];

const growthData = [
  { month: "Jan", customers: 520 },
  { month: "Feb", customers: 560 },
  { month: "Mar", customers: 600 },
  { month: "Apr", customers: 645 },
  { month: "May", customers: 690 },
  { month: "Jun", customers: 730 },
  { month: "Jul", customers: 760 },
  { month: "Aug", customers: 793 },
];

const segments = [
  { name: "Consumer", value: 52 },
  { name: "Corporate", value: 31 },
  { name: "Home Office", value: 17 },
];

const Customers = () => {
  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <span className="page-eyebrow">CUSTOMER INTELLIGENCE</span>
          <h1>Customer Analytics</h1>
          <p>Understand customer behavior, retention and value.</p>
        </div>
      </div>

      <div className="kpi-grid">
        <KpiCard title="Total Customers" value="793" change="+6.7%" icon={<Users />} />
        <KpiCard title="New Customers" value="142" change="+12.3%" icon={<UserPlus />} />
        <KpiCard title="Retention Rate" value="87.4%" change="+4.2%" icon={<Repeat />} />
        <KpiCard title="Customer Satisfaction" value="4.8" change="+0.4%" icon={<Star />} />
      </div>

      <div className="two-column-grid">
        <ChartCard title="Customer Growth" subtitle="Customer acquisition over time">
          <div className="chart-box">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone" dataKey="customers" stroke="#6C63FF"
                  strokeWidth={4} dot={{ r: 5 }} activeDot={{ r: 9 }}
                  animationDuration={1200}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Customer Segments" subtitle="Distribution by segment">
          <div className="donut-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={segments} dataKey="value" nameKey="name"
                  innerRadius={70} outerRadius={110} paddingAngle={4}
                  animationDuration={1200}
                >
                  {segments.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default Customers;