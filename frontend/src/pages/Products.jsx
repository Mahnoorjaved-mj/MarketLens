import { useEffect, useState } from "react";

import {
  getProductsData,
  formatPKR,
  formatNumber,
  pct,
} from "../services/api";

export default function Products() {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {

    setLoading(true);

    try {
      setData(await getProductsData());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }

  };

  useEffect(() => {
    load();
  }, []);

  const products = data?.products || [];

  return (
    <main className="page">

      <div className="page-head">

        <div>

          <span className="eyebrow">
            PRODUCT ANALYTICS
          </span>

          <h1>Product Performance</h1>

          <p>
            Discover the products driving
            revenue and business growth.
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
          title="Total Products"
          value={
            loading
              ? "—"
              : formatNumber(
                  data?.total_products
                )
          }
          note="Products in connected dataset"
          icon="▦"
        />

        <Kpi
          title="Best Seller"
          value={
            loading
              ? "—"
              : data?.best_seller || "—"
          }
          note="Highest revenue product"
          icon="★"
        />

        <Kpi
          title="Top Product Revenue"
          value={
            loading
              ? "—"
              : formatPKR(
                  data?.top_product_revenue
                )
          }
          note="Revenue from leading product"
          icon="Rs"
        />

        <Kpi
          title="Product Contribution"
          value={
            loading
              ? "—"
              : pct(
                  data?.top_product_share
                )
          }
          note="Share of total revenue"
          icon="%"
        />

      </section>


      <article className="card product-leaderboard">

        <div className="card-head">

          <div>

            <span className="eyebrow">
              PRODUCT LEADERBOARD
            </span>

            <h2>Top Revenue Products</h2>

            <p>
              Products ranked by actual
              PostgreSQL revenue.
            </p>

          </div>

          <span className="ai-badge">
            LIVE DATA
          </span>

        </div>

        <div className="rank-list">

          {products.slice(0, 8).map(
            (product, index) => (

              <div
                className="rank-row"
                key={index}
              >

                <div className="rank-number">
                  {String(index + 1).padStart(
                    2,
                    "0"
                  )}
                </div>

                <div className="rank-content">

                  <div className="rank-title">

                    <strong>
                      {product.product}
                    </strong>

                    <span>
                      {product.category}
                    </span>

                  </div>

                  <div className="meter">

                    <i
                      style={{
                        width: `${Math.min(
                          100,
                          product.percent * 4
                        )}%`,
                      }}
                    />

                  </div>

                </div>

                <strong className="rank-money">
                  {formatPKR(
                    product.revenue
                  )}
                </strong>

              </div>

            )
          )}

        </div>

      </article>


      <article className="card table-card">

        <div className="card-head">

          <div>

            <span className="eyebrow">
              CATALOG PERFORMANCE
            </span>

            <h2>Product Details</h2>

            <p>
              Detailed product-level sales
              performance.
            </p>

          </div>

        </div>

        <div className="table-wrap">

          <table>

            <thead>
              <tr>
                <th>PRODUCT</th>
                <th>CATEGORY</th>
                <th>UNITS</th>
                <th>REVENUE</th>
                <th>PROFIT</th>
              </tr>
            </thead>

            <tbody>

              {products.slice(0, 15).map(
                (product, index) => (

                  <tr key={index}>

                    <td>
                      <strong>
                        {product.product}
                      </strong>
                    </td>

                    <td>
                      {product.category}
                    </td>

                    <td>
                      {formatNumber(
                        product.units_sold
                      )}
                    </td>

                    <td className="money">
                      {formatPKR(
                        product.revenue
                      )}
                    </td>

                    <td className="profit">
                      {formatPKR(
                        product.profit
                      )}
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