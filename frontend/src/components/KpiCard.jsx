import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

const KpiCard = ({
  title,
  value,
  change,
  positive = true,
  subtitle,
  icon,
}) => {
  const isPositive = positive && !String(change).includes("-");

  return (
    <div className="kpi-card">
      <div className="kpi-top">
        <div className="kpi-icon-wrapper">{icon}</div>
        {change && (
          <span
            className={`kpi-badge ${
              isPositive ? "kpi-positive" : "kpi-negative"
            }`}
          >
            {isPositive ? (
              <TrendingUp size={12} className="inline mr-1" />
            ) : (
              <TrendingDown size={12} className="inline mr-1" />
            )}
            {change}
          </span>
        )}
      </div>

      <div className="kpi-body">
        <div className="kpi-value">{value}</div>
        <div className="kpi-title">{title}</div>
        {subtitle && <div className="kpi-subtitle">{subtitle}</div>}
      </div>
    </div>
  );
};

export default KpiCard;