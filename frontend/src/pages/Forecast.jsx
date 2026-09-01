import ChartCard from "../components/ChartCard";
import React from "react";
import {
  ResponsiveContainer, ComposedChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
} from "recharts";

const forecastData = [
  { month: "Mar", actual: 210000, predicted: null },
  { month: "Apr", actual: 245000, predicted: null },
  { month: "May", actual: 268000, predicted: null },
  { month: "Jun", actual: 302000, predicted: null },
  { month: "Jul", actual: 356000, predicted: 356000 },
  { month: "Aug", actual: null, predicted: 392000 },
  { month: "Sep", actual: null, predicted: 428000 },
  { month: "Oct", actual: null, predicted: 468000 },
];

const Forecast = () => {
  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <span className="page-eyebrow">PREDICTIVE ANALYTICS</span>
          <h1>Sales Forecast</h1>
          <p>AI-powered forecasting for future business performance.</p>
        </div>
        <div className="ai-status">
          <span></span>
          AI MODEL ACTIVE
        </div>
      </div>

      <div className="forecast-summary">
        <div><span>Predicted Revenue</span><strong>$3.12M</strong></div>
        <div><span>Forecast Growth</span><strong>+18.6%</strong></div>
        <div><span>Model Accuracy</span><strong>94.2%</strong></div>
      </div>

      <ChartCard title="Revenue Forecast" subtitle="Historical sales vs AI prediction">
        <div className="chart-box">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(v) => (v ? `$${v.toLocaleString()}` : "-")} />
              <Legend />
              <Line
                type="monotone" dataKey="actual" name="Actual" stroke="#6C63FF"
                strokeWidth={4} dot={{ r: 5 }} connectNulls animationDuration={1200}
              />
              <Line
                type="monotone" dataKey="predicted" name="Predicted" stroke="#00C49F"
                strokeWidth={4} strokeDasharray="8 6" dot={{ r: 5 }} connectNulls
                animationDuration={1200} animationBegin={300}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <div className="forecast-insight-card">
        <div className="forecast-icon">✦</div>
        <div>
          <h3>AI Forecast Insight</h3>
          <p>
            The predictive model indicates continued revenue growth,
            with Technology expected to remain the strongest category.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Forecast;