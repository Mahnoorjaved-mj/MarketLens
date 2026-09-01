import React from "react";

export default function KpiCard({
  title,
  value,
  note,
  icon = "•",
  trend,
  trendType = "neutral",
}) {
  return (
    <article className="kpi-card">

      <div className="kpi-card-top">

        <div className="kpi-title">
          <span>{title}</span>
        </div>

        <div className="kpi-icon">
          {icon}
        </div>

      </div>

      <div className="kpi-value">
        {value ?? "—"}
      </div>

      <div className="kpi-bottom">

        <span className="kpi-note">
          {note}
        </span>

        {trend && (
          <span className={`kpi-trend ${trendType}`}>
            {trendType === "up" && "↗"}
            {trendType === "down" && "↘"}
            {trend}
          </span>
        )}

      </div>

    </article>
  );
}