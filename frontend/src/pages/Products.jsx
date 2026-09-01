import ChartCard from "../components/ChartCard";
import React from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Cell,
} from "recharts";

const COLORS = ["#6C63FF", "#00C49F", "#FFB547", "#FF6B81"];

const products = [
  { name: "Canon ImageCLASS", sales: "$61.6K", growth: "+18.4%" },
  { name: "Fellowes PB500", sales: "$27.4K", growth: "+14.2%" },
  { name: "HP LaserJet", sales: "$25.8K", growth: "+10.8%" },
  { name: "Cisco Router", sales: "$23.6K", growth: "+8.9%" },
];

const categoryData = [
  { category: "Technology", sales: 836000 },
  { category: "Furniture", sales: 742000 },
  { category: "Office Supplies", sales: 718000 },
];

const Products = () => {
  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <span className="page-eyebrow">PRODUCT PERFORMANCE</span>
          <h1>Products Intelligence</h1>
          <p>Track product performance and identify top revenue drivers.</p>
        </div>
      </div>

      <ChartCard title="Product Performance" subtitle="Top products ranked by sales">
        <div className="product-performance-list">
          {products.map((product, index) => (
            <div
              className="product-performance-item"
              key={product.name}
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <div className="product-rank">{index + 1}</div>
              <div className="product-name">
                <strong>{product.name}</strong>
                <span>High Performing Product</span>
              </div>
              <strong>{product.sales}</strong>
              <span className="growth-badge">{product.growth}</span>
            </div>
          ))}
        </div>
      </ChartCard>

      <div className="two-column-grid">
        <ChartCard title="Category Performance" subtitle="Sales contribution">
          <div className="chart-box">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                <YAxis dataKey="category" type="category" width={110} />
                <Tooltip formatter={(v) => `$${v.toLocaleString()}`} />
                <Bar dataKey="sales" radius={[0, 10, 10, 0]} animationDuration={1200}>
                  {categoryData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Product Insights" subtitle="AI-generated intelligence">
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