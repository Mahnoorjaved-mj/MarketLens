import ChartCard from "../components/ChartCard";
import KpiCard from "../components/KpiCard";
import React from "react";

import {
  DollarSign,
  TrendingUp,
  Receipt,
  BarChart3,
} from "lucide-react";

const Sales = () => {
  return (
    <div className="dashboard-page">

      <div className="page-header">

        <div>
          <span className="page-eyebrow">
            SALES ANALYTICS
          </span>

          <h1>Sales Intelligence</h1>

          <p>
            Analyze revenue, profit trends and sales performance.
          </p>
        </div>

      </div>


      <div className="kpi-grid">

        <KpiCard
          title="Total Revenue"
          value="$2.30M"
          change="+12.8%"
          icon={<DollarSign />}
        />

        <KpiCard
          title="Gross Profit"
          value="$286K"
          change="+8.4%"
          icon={<TrendingUp />}
        />

        <KpiCard
          title="Average Order Value"
          value="$458"
          change="+5.3%"
          icon={<Receipt />}
        />

        <KpiCard
          title="Sales Growth"
          value="18.2%"
          change="+3.4%"
          icon={<BarChart3 />}
        />

      </div>


      <div className="two-column-grid">

        <ChartCard
          title="Revenue Trend"
          subtitle="Monthly sales performance"
        >
          <div className="big-chart">
            <div className="fake-chart-bars">
              {[45, 60, 52, 70, 78, 92, 84, 100].map(
                (height, index) => (
                  <div
                    key={index}
                    style={{ height: `${height}%` }}
                  ></div>
                )
              )}
            </div>
          </div>
        </ChartCard>


        <ChartCard
          title="Sales Distribution"
          subtitle="Performance by segment"
        >

          <div className="donut-placeholder">
            <div className="donut-center">
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