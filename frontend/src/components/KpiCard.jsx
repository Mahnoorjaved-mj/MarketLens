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

        <div className="kpi-icon">
          {icon}
        </div>

        <span
          className={`kpi-change ${
            positive ? "positive" : "negative"
          }`}
        >
          {change}
        </span>

      </div>

      <div className="kpi-value">
        {value}
      </div>

      <div className="kpi-title">
        {title}
      </div>

    </div>
  );
};

export default KpiCard;