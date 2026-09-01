import React from "react";

export default function AIInsight({
  title = "AI Business Insight",
  text,
  label = "AI INSIGHT",
  icon = "✦",
  action,
}) {
  return (
    <section className="ai-insight-card">

      <div className="ai-insight-icon">
        {icon}
      </div>

      <div className="ai-insight-content">

        <span className="ai-insight-label">
          {label}
        </span>

        <h3>{title}</h3>

        <p>
          {text ||
            "AI analysis will appear here based on the connected business data."}
        </p>

      </div>

      {action && (
        <button
          className="ai-insight-action"
          onClick={action.onClick}
        >
          {action.label}
        </button>
      )}

    </section>
  );
}