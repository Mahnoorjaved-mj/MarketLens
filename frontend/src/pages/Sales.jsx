import { useEffect, useState } from "react";

import {
  getSalesData,
  formatPKR,
  formatNumber,
  pct,
} from "../services/api";

export default function Sales() {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {

    setLoading(true);

    try {
      setData(await getSalesData());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }

  };

  useEffect(() => {
    load();
  }, []);

  const trend = data?.monthly_sales || [];

  const max = Math.max(
    ...trend.map((x) => Number(x.value || 0)),
    1
  );

  return (
    <main className="page">

      <div className="page-head">

        <div>

          <span className="eyebrow">
            SALES ANALYTICS
          </span>

          <h1>Sales Intelligence</h1>

          <p>
            Understand revenue movement,
            category performance and growth.
          </p>

        </div>

        <button
          className="primary-btn"
          onClick={load}
        >
          ↻ Refresh Data
        </button>

      </div>


      <section className="kpi-grid">

        <Kpi
          title="Total Revenue"
          value={
            loading
              ? "—"
              : formatPKR(data?.total_revenue)
          }
          note="Recorded sales revenue"
          icon="$"
        />

        <Kpi
          title="Total Orders"
          value={
            loading
              ? "—"
              : formatNumber(data?.total_orders)
          }
          note="Completed transactions"
          icon="↗"
        />

        <Kpi
          title="Average Order Value"
          value={
            loading
              ? "—"
              : formatPKR(
                  data?.average_order_value
                )
          }
          note="Revenue generated per order"
          icon="A"
        />

        <Kpi
          title="Growth Rate"
          value={
            loading
              ? "—"
              : pct(data?.growth_rate)
          }
          note="Latest month vs previous month"
          icon="%"
        />

      </section>


      <section className="two-col">

        <article className="card">

          <div className="card-head">

            <div>

              <span className="eyebrow">
                SALES PERFORMANCE
              </span>

              <h2>Monthly Revenue</h2>

              <p>
                Last 12 available months.
              </p>

            </div>

          </div>

          <div className="bar-chart tall">

            {trend.map((item, index) => {

              const value =
                Number(item.value || 0);

              return (
                <div
                  className="bar-wrap"
                  key={index}
                >

                  <div className="bar-value">
                    {formatPKR(value)}
                  </div>

                  <div
                    className="bar"
                    style={{
                      height: `${Math.max(
                        8,
                        (value / max) * 210
                      )}px`,
                    }}
                  />

                  <small>
                    {item.label}
                  </small>

                </div>
              );
            })}

          </div>

        </article>


        <article className="card">

          <div className="card-head">

            <div>

              <span className="eyebrow">
                BREAKDOWN
              </span>

              <h2>Sales by Category</h2>

              <p>
                Revenue contribution by category.
              </p>

            </div>

          </div>

          <div className="category-list">

            {(data?.categories || []).map(
              (item, index) => (

                <div
                  className="category-row"
                  key={index}
                >

                  <div className="category-info">

                    <strong>
                      {item.category}
                    </strong>

                    <span>
                      {formatPKR(item.revenue)}
                    </span>

                  </div>

                  <div className="meter">

                    <i
                      style={{
                        width: `${Math.min(
                          100,
                          Number(item.percent || 0)
                        )}%`,
                      }}
                    />

                  </div>

                  <b>
                    {pct(item.percent)}
                  </b>

                </div>

              )
            )}

          </div>

        </article>

      </section>


      <article className="card">

        <div className="card-head">

          <div>

            <span className="eyebrow">
              REGIONAL PERFORMANCE
            </span>

            <h2>Revenue by Region</h2>

            <p>
              Compare revenue and profit across
              business regions.
            </p>

          </div>

        </div>

        <div className="region-grid">

          {(data?.regions || []).map(
            (region, index) => (

              <div
                className="region-card"
                key={index}
              >

                <span>
                  {region.region}
                </span>

                <strong>
                  {formatPKR(region.revenue)}
                </strong>

                <small>
                  Profit{" "}
                  {formatPKR(region.profit)}
                </small>

                <div className="meter">

                  <i
                    style={{
                      width: `${Math.min(
                        100,
                        (
                          Number(region.revenue || 0) /
                          Math.max(
                            ...(data?.regions || []).map(
                              (x) =>
                                Number(x.revenue || 0)
                            ),
                            1
                          )
                        ) * 100
                      )}%`,
                    }}
                  />

                </div>

              </div>

            )
          )}

        </div>

      </article>

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