import ChartCard from "../components/ChartCard";

const Forecast = () => {
  return (
    <div className="dashboard-page">

      <div className="page-header">

        <div>
          <span className="page-eyebrow">
            PREDICTIVE ANALYTICS
          </span>

          <h1>Sales Forecast</h1>

          <p>
            AI-powered forecasting for future business performance.
          </p>
        </div>

        <div className="ai-status">
          <span></span>
          AI MODEL ACTIVE
        </div>

      </div>


      <div className="forecast-summary">

        <div>
          <span>Predicted Revenue</span>
          <strong>$3.12M</strong>
        </div>

        <div>
          <span>Forecast Growth</span>
          <strong>+18.6%</strong>
        </div>

        <div>
          <span>Model Accuracy</span>
          <strong>94.2%</strong>
        </div>

      </div>


      <ChartCard
        title="Revenue Forecast"
        subtitle="Historical sales vs AI prediction"
      >

        <div className="forecast-chart">

          <svg viewBox="0 0 900 350">

            <polyline
              points="30,260 150,230 270,210 390,170 510,130"
              fill="none"
              stroke="#4f46e5"
              strokeWidth="6"
            />

            <polyline
              points="510,130 630,100 750,70 870,35"
              fill="none"
              stroke="#22c55e"
              strokeWidth="6"
              strokeDasharray="12 10"
            />

          </svg>

        </div>

      </ChartCard>


      <div className="forecast-insight-card">

        <div className="forecast-icon">
          ✦
        </div>

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