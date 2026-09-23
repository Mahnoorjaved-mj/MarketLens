import React from "react";

const ChartCard = ({
  title,
  subtitle,
  children,
  action,
  className = "",
}) => {
  return (
    <div className={`report-card ${className}`}>
      <div className="report-card-header">
        <div>
          <h3>{title}</h3>
          {subtitle && <p>{subtitle}</p>}
        </div>

        {action ? (
          action
        ) : (
          <span className="report-card-pill">Active View</span>
        )}
      </div>

      <div className="chart-content">{children}</div>
    </div>
  );
};

export default ChartCard;