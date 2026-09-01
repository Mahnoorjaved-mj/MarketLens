import {
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Users,
} from "lucide-react";

import KpiCard from "../components/KpiCard";
import ChartCard from "../components/ChartCard";
import AiInsight from "../components/AiInsight";

const Overview = () => {
  return (
    <div className="dashboard-page">

      {/* PAGE HEADER */}

      <div className="page-header">

        <div>
          <span className="page-eyebrow">
            BUSINESS INTELLIGENCE
          </span>

          <h1>MarketLens Overview</h1>

          <p>
            Monitor business performance, sales trends,
            customers and intelligent insights from one workspace.
          </p>
        </div>

        <button className="primary-button">
          ↻ Refresh Report
        </button>

      </div>


      {/* FILTER BAR */}

      <div className="filter-bar">

        <div className="filter-info">
          <span className="live-dot"></span>
          LIVE BUSINESS REPORT
        </div>

        <div className="filters">

          <select>
            <option>All Years</option>
            <option>2014</option>
            <option>2015</option>
            <option>2016</option>
            <option>2017</option>
          </select>

          <select>
            <option>All Regions</option>
            <option>West</option>
            <option>East</option>
            <option>Central</option>
            <option>South</option>
          </select>

          <select>
            <option>All Categories</option>
            <option>Technology</option>
            <option>Furniture</option>
            <option>Office Supplies</option>
          </select>

        </div>

      </div>


      {/* KPI CARDS */}

      <div className="kpi-grid">

        <KpiCard
          title="Total Sales"
          value="2.30M"
          change="+12.8%"
          icon={<DollarSign size={20} />}
        />

        <KpiCard
          title="Total Profit"
          value="286.40K"
          change="+8.4%"
          icon={<TrendingUp size={20} />}
        />

        <KpiCard
          title="Total Orders"
          value="5K"
          change="+14.2%"
          icon={<ShoppingCart size={20} />}
        />

        <KpiCard
          title="Total Customers"
          value="793"
          change="+6.7%"
          icon={<Users size={20} />}
        />

      </div>


      {/* ANALYTICS */}

      <div className="analytics-grid">

        <ChartCard
          title="Sales Performance"
          subtitle="Revenue trend across business years"
          className="large-chart"
        >

          <div className="line-chart-placeholder">

            <div className="chart-stats">
              <span>2014</span>
              <span>2015</span>
              <span>2016</span>
              <span>2017</span>
            </div>

            <svg
              viewBox="0 0 600 240"
              className="line-chart"
            >

              <polyline
                points="30,170 190,180 380,95 570,25"
                fill="none"
                stroke="#5b4fcf"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <circle cx="30" cy="170" r="6" />
              <circle cx="190" cy="180" r="6" />
              <circle cx="380" cy="95" r="6" />
              <circle cx="570" cy="25" r="6" />

            </svg>

          </div>

        </ChartCard>


        <ChartCard
          title="Sales by Category"
          subtitle="Category contribution"
        >

          <div className="bar-list">

            <div className="bar-item">
              <span>Technology</span>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{ width: "92%" }}
                ></div>
              </div>
              <strong>0.84M</strong>
            </div>

            <div className="bar-item">
              <span>Furniture</span>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{ width: "80%" }}
                ></div>
              </div>
              <strong>0.74M</strong>
            </div>

            <div className="bar-item">
              <span>Office Supplies</span>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{ width: "74%" }}
                ></div>
              </div>
              <strong>0.69M</strong>
            </div>

          </div>

        </ChartCard>


        <ChartCard
          title="Sales by Region"
          subtitle="Regional performance"
        >

          <div className="region-chart">

            <div>
              <span>West</span>
              <div className="region-bar west"></div>
            </div>

            <div>
              <span>East</span>
              <div className="region-bar east"></div>
            </div>

            <div>
              <span>Central</span>
              <div className="region-bar central"></div>
            </div>

            <div>
              <span>South</span>
              <div className="region-bar south"></div>
            </div>

          </div>

        </ChartCard>

      </div>


      {/* BOTTOM */}

      <div className="bottom-grid">

        <ChartCard
          title="Top Performing Products"
          subtitle="Products generating the highest sales"
        >

          <div className="product-table">

            <div className="table-row table-header">
              <span>Product</span>
              <span>Sales</span>
              <span>Profit</span>
            </div>

            <div className="table-row">
              <span>Canon ImageCLASS 2200</span>
              <strong>$61.6K</strong>
              <strong className="profit">+18.2K</strong>
            </div>

            <div className="table-row">
              <span>Fellowes PB500</span>
              <strong>$27.4K</strong>
              <strong className="profit">+9.6K</strong>
            </div>

            <div className="table-row">
              <span>HP LaserJet Printer</span>
              <strong>$25.8K</strong>
              <strong className="profit">+7.8K</strong>
            </div>

          </div>

        </ChartCard>


        <div className="insight-column">

          <AiInsight
            title="AI Sales Insight"
            text="Sales are showing strong growth momentum, with Technology continuing to be the highest-performing category."
          />

          <AiInsight
            title="Customer Intelligence"
            text="Customer activity increased compared with the previous period, indicating healthy retention and engagement."
          />

        </div>

      </div>

    </div>
  );
};

export default Overview;