import { useEffect, useState } from "react";

import {
  getCustomersData,
  formatPKR,
  formatNumber,
  pct,
} from "../services/api";

export default function Customers() {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {

    setLoading(true);

    try {
      setData(await getCustomersData());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }

  };

  useEffect(() => {
    load();
  }, []);

  const segments = data?.segments || [];

  const maxSegment = Math.max(
    ...segments.map((x) => Number(x.count || 0)),
    1
  );

  return (
    <main className="page">

      <div className="page-head">

        <div>

          <span className="eyebrow">
            CUSTOMER ANALYTICS
          </span>

          <h1>Customer Intelligence</h1>

          <p>
            Understand customer value,
            segmentation and performance.
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
          title="Total Customers"
          value={
            loading
              ? "—"
              : formatNumber(
                  data?.total_customers
                )
          }
          note="Unique customers in dataset"
          icon="♙"
        />

        <Kpi
          title="Active Customers"
          value={
            loading
              ? "—"
              : formatNumber(
                  data?.active_customers
                )
          }
          note="Customers with recorded activity"
          icon="●"
        />

        <Kpi
          title="New Customers"
          value="—"
          note="Requires customer acquisition dates"
          icon="+"
        />

        <Kpi
          title="Customer Value"
          value={
            loading
              ? "—"
              : formatPKR(
                  data?.customer_value
                )
          }
          note="Average revenue per customer"
          icon="Rs"
        />

      </section>


      <section className="two-col">

        <article className="card">

          <div className="card-head">

            <div>

              <span className="eyebrow">
                SEGMENTATION
              </span>

              <h2>Customer Distribution</h2>

              <p>
                Customers grouped by segment.
              </p>

            </div>

          </div>

          <div className="segment-chart">

            {segments.map((segment, index) => {

              const count =
                Number(segment.count || 0);

              return (
                <div
                  className="segment-chart-row"
                  key={index}
                >

                  <div className="segment-label">

                    <strong>
                      {segment.name}
                    </strong>

                    <span>
                      {formatNumber(count)}
                      {" "}customers
                    </span>

                  </div>

                  <div className="segment-track">

                    <div
                      style={{
                        width: `${
                          (count / maxSegment) * 100
                        }%`,
                      }}
                    />

                  </div>

                  <b>
                    {pct(segment.percent)}
                  </b>

                </div>
              );
            })}

          </div>

        </article>


        <article className="card">

          <div className="card-head">

            <div>

              <span className="eyebrow">
                CUSTOMER VALUE
              </span>

              <h2>Segment Revenue</h2>

              <p>
                Revenue contribution from
                each customer segment.
              </p>

            </div>

          </div>

          <div className="segment-revenue">

            {segments.map((segment, index) => (

              <div
                className="segment-revenue-row"
                key={index}
              >

                <div>

                  <strong>
                    {segment.name}
                  </strong>

                  <span>
                    {formatNumber(
                      segment.count
                    )} customers
                  </span>

                </div>

                <b>
                  {formatPKR(
                    segment.revenue
                  )}
                </b>

              </div>

            ))}

          </div>

        </article>

      </section>


      <article className="card table-card">

        <div className="card-head">

          <div>

            <span className="eyebrow">
              CUSTOMER PERFORMANCE
            </span>

            <h2>Top Customers</h2>

            <p>
              Highest-value customers ranked
              by revenue.
            </p>

          </div>

        </div>

        <div className="table-wrap">

          <table>

            <thead>
              <tr>
                <th>CUSTOMER</th>
                <th>ORDERS</th>
                <th>REVENUE</th>
                <th>STATUS</th>
              </tr>
            </thead>

            <tbody>

              {(data?.top_customers || []).map(
                (item, index) => (

                  <tr key={index}>

                    <td>
                      <strong>
                        {item.customer}
                      </strong>
                    </td>

                    <td>
                      {formatNumber(
                        item.orders
                      )}
                    </td>

                    <td className="money">
                      {formatPKR(
                        item.revenue
                      )}
                    </td>

                    <td>
                      <span className="status-pill">
                        Active
                      </span>
                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

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