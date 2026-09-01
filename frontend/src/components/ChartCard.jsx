import React from "react";

export default function ChartCard({
  eyebrow,
  title,
  description,
  children,
  action,
  className = "",
}) {
  return (
    <article className={`chart-card ${className}`}>

      <div className="chart-card-header">

        <div>

          {eyebrow && (
            <span className="chart-eyebrow">
              {eyebrow}
            </span>
          )}

          <h2>{title}</h2>

          {description && (
            <p>{description}</p>
          )}

        </div>

        {action && (
          <div className="chart-action">
            {action}
          </div>
        )}

      </div>

      <div className="chart-content">
        {children}
      </div>

    </article>
  );
}