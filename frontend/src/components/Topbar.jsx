import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Sparkles,
  Search,
  Download,
  Bell,
  CheckCircle2,
  Calendar,
  Layers,
} from "lucide-react";

const routeTitles = {
  "/": { title: "Overview", subtitle: "Executive Dashboard" },
  "/sales": { title: "Sales Intelligence", subtitle: "Revenue & Segment Analytics" },
  "/customers": { title: "Customer Intelligence", subtitle: "Acquisition & LTV Analytics" },
  "/products": { title: "Products & Inventory", subtitle: "Catalog Performance & Margins" },
  "/forecast": { title: "Predictive Forecast", subtitle: "Machine Learning Horizon" },
};

const Topbar = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const currentRoute = routeTitles[location.pathname] || {
    title: "Analytics",
    subtitle: "Enterprise Suite",
  };

  const today = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleExport = () => {
    setDownloadSuccess(true);
    setTimeout(() => {
      setDownloadSuccess(false);
    }, 2500);
  };

  return (
    <header className="topbar">
      {/* Breadcrumb & Context */}
      <div className="topbar-left">
        <div className="breadcrumb">
          <span className="breadcrumb-root">MarketLens</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{currentRoute.title}</span>
        </div>
      </div>

      {/* Global Quick Search */}
      <div className="topbar-center">
        <div className="global-search-bar">
          <Search size={15} className="search-icon" />
          <input
            type="text"
            placeholder="Search metrics, reports, customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <kbd className="search-shortcut">⌘K</kbd>
        </div>
      </div>

      {/* Meta & Actions */}
      <div className="topbar-right">
        {/* Live sync badge */}
        <div className="topbar-sync-badge">
          <span className="sync-pulse"></span>
          <Sparkles size={13} className="sync-sparkle" />
          <span>Synced with Power BI</span>
        </div>

        {/* Calendar date */}
        <div className="topbar-date-pill">
          <Calendar size={13} />
          <span>{today}</span>
        </div>

        {/* Export Button */}
        <button
          className={`topbar-action-btn ${downloadSuccess ? "success" : ""}`}
          onClick={handleExport}
          title="Export current dashboard snapshot"
        >
          {downloadSuccess ? (
            <>
              <CheckCircle2 size={14} className="text-emerald" />
              <span>Exported!</span>
            </>
          ) : (
            <>
              <Download size={14} />
              <span>Export</span>
            </>
          )}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            className="topbar-icon-btn"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            title="System Notifications"
          >
            <Bell size={16} />
            <span className="notification-dot" />
          </button>

          {notificationsOpen && (
            <div className="notifications-popover">
              <div className="popover-header">
                <strong>System Notifications</strong>
                <span>2 unread</span>
              </div>
              <div className="popover-item">
                <div className="popover-item-dot" />
                <div>
                  <p>Database ETL sync completed for Q4 data.</p>
                  <span>10 mins ago</span>
                </div>
              </div>
              <div className="popover-item">
                <div className="popover-item-dot" />
                <div>
                  <p>Random Forest forecast model re-calibrated.</p>
                  <span>1 hour ago</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;