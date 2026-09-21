import React from "react";

const KpiCard = ({
  title,
  value,
  change,
  positive = true,
  icon,
}) => {
  return (
    <div className="kpi-card">
      <div className="kpi-top">
        <div className="kpi-icon-wrapper">
          {icon}
        </div>
        {change && (
          <span className={`kpi-badge ${positive ? "kpi-positive" : "kpi-negative"}`}>
            {change}
          </span>
        )}
      </div>

      <div className="kpi-value">{value}</div>
      <div className="kpi-title">{title}</div>
    </div>
  );
};

export default KpiCard;