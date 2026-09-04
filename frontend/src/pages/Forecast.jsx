import ChartCard from "../components/ChartCard";
import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";


const Forecast = () => {

  const [forecastData, setForecastData] = useState([]);

  const [summary, setSummary] = useState({
    predicted_revenue: 0,
    forecast_growth: 0,
    model_accuracy: 0,
  });

  const [insight, setInsight] = useState(
    "Loading AI forecast insight..."
  );

  const [loading, setLoading] = useState(true);


  useEffect(() => {

    const fetchForecast = async () => {

      try {

        const response = await fetch(
          "http://127.0.0.1:8000/api/forecast"
        );

        const data = await response.json();

        console.log("Forecast API:", data);

        if (data.error) {
          throw new Error(data.error);
        }

        setForecastData(data.forecast_data);

        setSummary(data.summary);

        setInsight(data.insight);

      } catch (error) {

        console.error(
          "Forecast loading error:",
          error
        );

        setInsight(
          "Unable to load the AI forecast. Please check the backend connection."
        );

      } finally {

        setLoading(false);

      }

    };


    fetchForecast();

  }, []);


  return (

    <div className="dashboard-page">

      {/* ================= HEADER ================= */}

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


      {/* ================= SUMMARY ================= */}

      <div className="forecast-summary">

        <div>

          <span>Predicted Revenue</span>

          <strong>

            $
            {summary.predicted_revenue.toLocaleString(
              undefined,
              {
                maximumFractionDigits: 0,
              }
            )}

          </strong>

        </div>


        <div>

          <span>Forecast Growth</span>

          <strong>

            {summary.forecast_growth >= 0
              ? "+"
              : ""}

            {summary.forecast_growth}%

          </strong>

        </div>


        <div>

          <span>Model Accuracy</span>

          <strong>

            {summary.model_accuracy}%

          </strong>

        </div>

      </div>


      {/* ================= FORECAST CHART ================= */}

      <ChartCard
        title="Revenue Forecast"
        subtitle="Historical sales vs AI prediction"
      >

        <div className="chart-box">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <ComposedChart
              data={forecastData}
            >

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
              />


              <XAxis
                dataKey="month"
              />


              <YAxis
                tickFormatter={(v) =>
                  `$${(v / 1000).toFixed(0)}K`
                }
              />


              <Tooltip
                formatter={(v) =>
                  v
                    ? `$${Number(v).toLocaleString()}`
                    : "-"
                }
              />


              <Legend />


              {/* ACTUAL SALES */}

              <Line
                type="monotone"
                dataKey="actual"
                name="Actual"
                stroke="#6C63FF"
                strokeWidth={4}
                dot={{ r: 5 }}
                connectNulls
                animationDuration={1200}
              />


              {/* AI PREDICTION */}

              <Line
                type="monotone"
                dataKey="predicted"
                name="Predicted"
                stroke="#00C49F"
                strokeWidth={4}
                strokeDasharray="8 6"
                dot={{ r: 5 }}
                connectNulls
                animationDuration={1200}
                animationBegin={300}
              />

            </ComposedChart>

          </ResponsiveContainer>

        </div>

      </ChartCard>


      {/* ================= AI INSIGHT ================= */}

      <div className="forecast-insight-card">

        <div className="forecast-icon">
          ✦
        </div>


        <div>

          <h3>
            AI Forecast Insight
          </h3>


          <p>
            {loading
              ? "Loading AI forecast..."
              : insight}
          </p>

        </div>

      </div>

    </div>

  );

};


export default Forecast;