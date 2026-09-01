import React from "react";
import { Sparkles } from "lucide-react";

const Topbar = () => {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <header className="topbar">
      <div className="breadcrumb">
        MarketLens
        <span>/</span>
        <strong>Analytics Workspace</strong>
      </div>

      <div className="topbar-meta">
        <span className="topbar-date">{today}</span>
        <div className="topbar-sync">
          <Sparkles size={14} />
          Synced with Power BI
        </div>
      </div>
    </header>
  );
};

export default Topbar;