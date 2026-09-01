import ChartCard from "../components/ChartCard";
import React from "react";

const Products = () => {
  const products = [
    {
      name: "Canon ImageCLASS",
      sales: "$61.6K",
      growth: "+18.4%",
    },
    {
      name: "Fellowes PB500",
      sales: "$27.4K",
      growth: "+14.2%",
    },
    {
      name: "HP LaserJet",
      sales: "$25.8K",
      growth: "+10.8%",
    },
    {
      name: "Cisco Router",
      sales: "$23.6K",
      growth: "+8.9%",
    },
  ];

  return (
    <div className="dashboard-page">

      <div className="page-header">

        <div>
          <span className="page-eyebrow">
            PRODUCT PERFORMANCE
          </span>

          <h1>Products Intelligence</h1>

          <p>
            Track product performance and identify top revenue drivers.
          </p>
        </div>

      </div>


      <ChartCard
        title="Product Performance"
        subtitle="Top products ranked by sales"
      >

        <div className="product-performance-list">

          {products.map((product) => (
            <div
              className="product-performance-item"
              key={product.name}
            >

              <div className="product-rank">
                #
              </div>

              <div className="product-name">
                <strong>{product.name}</strong>
                <span>High Performing Product</span>
              </div>

              <strong>{product.sales}</strong>

              <span className="growth-badge">
                {product.growth}
              </span>

            </div>
          ))}

        </div>

      </ChartCard>


      <div className="two-column-grid">

        <ChartCard
          title="Category Performance"
          subtitle="Sales contribution"
        >

          <div className="category-cards">

            <div>
              <span>Technology</span>
              <strong>$836K</strong>
            </div>

            <div>
              <span>Furniture</span>
              <strong>$742K</strong>
            </div>

            <div>
              <span>Office Supplies</span>
              <strong>$718K</strong>
            </div>

          </div>

        </ChartCard>


        <ChartCard
          title="Product Insights"
          subtitle="AI-generated intelligence"
        >

          <div className="product-insights">
            Technology products continue to generate the strongest
            revenue growth across all business categories.
          </div>

        </ChartCard>

      </div>

    </div>
  );
};

export default Products;