import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Package,
  Sparkles,
  Database,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

const Sidebar = () => {
  const menuItems = [
    {
      name: "Overview",
      path: "/",
      icon: <LayoutDashboard size={18} />,
      badge: null,
    },
    {
      name: "Sales Intelligence",
      path: "/sales",
      icon: <BarChart3 size={18} />,
      badge: "Live",
    },
    {
      name: "Customers",
      path: "/customers",
      icon: <Users size={18} />,
      badge: null,
    },
    {
      name: "Products",
      path: "/products",
      icon: <Package size={18} />,
      badge: null,
    },
    {
      name: "AI Forecast",
      path: "/forecast",
      icon: <Sparkles size={18} />,
      badge: "ML",
    },
  ];

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="brand">
        <div className="brand-logo-container">
          <div className="brand-logo">
            <TrendingUp size={20} strokeWidth={2.6} />
          </div>
          <span className="brand-ping"></span>
        </div>
        <div className="brand-text">
          <div className="brand-title-row">
            <h2>MarketLens</h2>
            <span className="brand-pro-tag">PRO</span>
          </div>
          <span className="brand-subtitle">Executive BI & Analytics</span>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="sidebar-section-title">MAIN NAVIGATION</div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <span className="sidebar-link-icon">{item.icon}</span>
            <span className="sidebar-link-text">{item.name}</span>

            {item.badge && (
              <span className={`sidebar-badge ${item.badge.toLowerCase()}`}>
                {item.badge}
              </span>
            )}

            <div className="active-glow-indicator" />
          </NavLink>
        ))}
      </nav>

      {/* Workspace & Connection Info */}
      <div className="sidebar-bottom">
        {/* Data Sync Status */}
        <div className="connection-card">
          <div className="connection-dot-wrap">
            <div className="connection-dot" />
            <div className="connection-ring" />
          </div>
          <div className="connection-info">
            <div className="connection-header">
              <Database size={13} className="text-emerald" />
              <strong>Data Pipeline</strong>
            </div>
            <span>PostgreSQL & Power BI Live</span>
          </div>
        </div>

        {/* Enterprise Workspace Card */}
        <div className="workspace-card">
          <div className="workspace-icon">
            <ShieldCheck size={16} />
          </div>
          <div className="workspace-details">
            <strong>Enterprise Workspace</strong>
            <span>Active Session • Production</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;