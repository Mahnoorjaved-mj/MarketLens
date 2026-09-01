import { useEffect, useState } from "react";

import {
  getForecastData,
  formatPKR,
  pct,
} from "../services/api";

export default function Forecast() {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {

    setLoading(true);

    try {
      setData(await getForecastData());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }

  };

  useEffect(() => {
    load();
  }, []);

  const actual = data?.actual || [];
  const forecast = data?.forecast || [];

  const allValues = [
    ...actual.map(
      (x) => Number(x.value || 0)
    ),
    ...forecast.map(
      (x) => Number(x.value || 0)
    ),
  ];

  const max = Math.max(...allValues, 1);

  return (
    <main className="page">

      <div className="page-head">

        <div>

          <span className="eyebrow">
            PREDICTIVE ANALYTICS
          </span>

          <h1>AI Sales Forecast</h1>

          <p>
            Forecast future revenue from
            historical business performance.
          </p>

        </div>

        <button
          className="primary-btn"
          onClick={load}
        >
          ↗ Run Forecast
        </button>

      </div>


      <section className="kpi-grid">

        <Kpi
          title="Forecast Accuracy"
          value={
            data?.accuracy
              ? pct(data.accuracy)
              : "Baseline"
          }
          note="Model evaluation"
          icon="◎"
        />

        <Kpi
          title="Predicted Revenue"
          value={
            loading
              ? "—"
              : formatPKR(
                  data?.predicted_revenue
                )
          }
          note="Average expected revenue"
          icon="↗"
        />

        <Kpi
          title="Expected Growth"
          value={
            loading
              ? "—"
              : pct(
                  data?.expected_growth
                )
          }
          note="Forecast vs latest actual"
          icon="%"
        />

        <Kpi
          title="Forecast Horizon"
          value={
            `${data?.horizon || 0} Months`
          }
          note="Prediction window"
          icon="◷"
        />

      </section>


      <article className="card forecast-main">

        <div className="card-head">

          <div>

            <span className="eyebrow">
              PREDICTION MODEL
            </span>

            <h2>
              Historical vs Forecast Revenue
            </h2>

            <p>
              Actual monthly revenue followed
              by model-generated predictions.
            </p>

          </div>

          <span className="ai-badge">
            AI FORECAST
          </span>

        </div>


        <div className="forecast-bars">

          {actual.map((item, index) => (

            <div
              className="forecast-column actual-column"
              key={`a-${index}`}
            >

              <div
                className="forecast-bar actual-bar"
                style={{
                  height: `${Math.max(
                    8,
                    (item.value / max) * 230
                  )}px`,
                }}
              />

              <small>
                {item.label}
              </small>

            </div>

          ))}


          {forecast.map((item, index) => (

            <div
              className="forecast-column predicted-column"
              key={`p-${index}`}
            >

              <div
                className="forecast-bar predicted-bar"
                style={{
                  height: `${Math.max(
                    8,
                    (item.value / max) * 230
                  )}px`,
                }}
              />

              <small>
                {item.label}
              </small>

            </div>

          ))}

        </div>


        <div className="legend">

          <span>
            <i className="legend-dot actual-dot" />
            Historical
          </span>

          <span>
            <i className="legend-dot predicted-dot" />
            Forecast
          </span>

        </div>

      </article>


      <section className="two-col">

        <article className="card">

          <div className="card-head">

            <div>

              <span className="eyebrow">
                MODEL INFORMATION
              </span>

              <h2>Forecast Model</h2>

            </div>

          </div>

          <div className="model-grid">

            <ModelStat
              label="Method"
              value={data?.model}
            />

            <ModelStat
              label="Training Records"
              value={data?.training_records}
            />

            <ModelStat
              label="MAE"
              value={data?.mae}
            />

            <ModelStat
              label="R² Score"
              value={data?.r2}
            />

          </div>

        </article>


        <article className="card forecast-insight">

          <span className="eyebrow">
            AI INSIGHT
          </span>

          <h2>Forecast Summary</h2>

          <div className="ai-summary">

            <div className="ai-summary-icon">
              ✦
            </div>

            <p>
              {data?.insight ||
                "Forecast generated from historical sales data."}
            </p>

          </div>

        </article>

      </section>

    </main>
  );
}


function Kpi({
  title,
  value,
  note,
  icon,
}) {
  return (
    <article className="card kpi">

      <div className="kpi-top">
        <span>{title}</span>

        <div className="kpi-icon">
          {icon}
        </div>
      </div>

      <h2>{value}</h2>

      <p>{note}</p>

    </article>
  );
}


function ModelStat({
  label,
  value,
}) {
  return (
    <div className="model-stat">

      <span>{label}</span>

      <strong>
        {value || "—"}
      </strong>

    </div>
  );
}