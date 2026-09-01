import { useState } from "react";

const POWER_BI_URL =
  "https://app.powerbi.com/reportEmbed?reportId=4deba765-9860-4b08-b0a0-0e5e0456250a&autoAuth=true&ctid=12b221b3-0464-4223-89e5-888835778b58";

export default function Overview() {

  const [refreshKey, setRefreshKey] = useState(0);

  const refreshDashboard = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <main className="page">

      <section className="page-head">

        <div>

          <span className="eyebrow">
            POWER BI ANALYTICS
          </span>

          <h1>
            MarketLens Sales Intelligence
          </h1>

          <p>
            Explore interactive business insights,
            sales performance, customer trends and
            profitability analytics.
          </p>

        </div>

        <button
          className="primary-btn"
          onClick={refreshDashboard}
        >
          ↻ Refresh Report
        </button>

      </section>


      <section className="powerbi-section">

        <div className="powerbi-header">

          <div>

            <h2>
              Sales Intelligence Dashboard
            </h2>

            <p>
              Interactive analytics powered by Power BI
            </p>

          </div>

          <div className="powerbi-badge">

            <span className="live-dot"></span>

            LIVE REPORT

          </div>

        </div>


        <div className="powerbi-container">

          <iframe
            key={refreshKey}
            title="MarketLens Sales Intelligence Dashboard"
            src={POWER_BI_URL}
            className="powerbi-frame"
            frameBorder="0"
            allowFullScreen
          />

        </div>

      </section>


      <section className="card forecast-insight">

        <div className="ai-summary insight-summary">

          <div className="ai-summary-icon">
            ✦
          </div>

          <div>

            <span className="eyebrow insight-label">
              MARKETLENS INSIGHT
            </span>

            <h3 className="insight-title">
              Your business intelligence dashboard
              is connected and ready.
            </h3>

            <p>
              Use the interactive Power BI visuals
              to explore sales, profit, customers,
              products and regional performance.
            </p>

          </div>

        </div>

      </section>

    </main>
  );
}