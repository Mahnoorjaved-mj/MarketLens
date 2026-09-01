import ChartCard from "../components/ChartCard";
import KpiCard from "../components/KpiCard";
import React from "react";
import {
  Users,
  UserPlus,
  Repeat,
  Star,
} from "lucide-react";

const Customers = () => {
  return (
    <div className="dashboard-page">

      <div className="page-header">

        <div>
          <span className="page-eyebrow">
            CUSTOMER INTELLIGENCE
          </span>

          <h1>Customer Analytics</h1>

          <p>
            Understand customer behavior, retention and value.
          </p>
        </div>

      </div>


      <div className="kpi-grid">

        <KpiCard
          title="Total Customers"
          value="793"
          change="+6.7%"
          icon={<Users />}
        />

        <KpiCard
          title="New Customers"
          value="142"
          change="+12.3%"
          icon={<UserPlus />}
        />

        <KpiCard
          title="Retention Rate"
          value="87.4%"
          change="+4.2%"
          icon={<Repeat />}
        />

        <KpiCard
          title="Customer Satisfaction"
          value="4.8"
          change="+0.4%"
          icon={<Star />}
        />

      </div>


      <div className="two-column-grid">

        <ChartCard
          title="Customer Growth"
          subtitle="Customer acquisition over time"
        >
          <div className="customer-growth-chart">
            <div className="growth-line"></div>
          </div>
        </ChartCard>


        <ChartCard
          title="Customer Segments"
          subtitle="Distribution by segment"
        >

          <div className="segment-list">

            <div>
              <span>Consumer</span>
              <strong>52%</strong>
            </div>

            <div>
              <span>Corporate</span>
              <strong>31%</strong>
            </div>

            <div>
              <span>Home Office</span>
              <strong>17%</strong>
            </div>

          </div>

        </ChartCard>

      </div>

    </div>
  );
};

export default Customers;