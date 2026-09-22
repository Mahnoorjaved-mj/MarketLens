import { NavLink } from "react-router-dom";
import React from "react";

import {
  LayoutDashboard,
  ChartNoAxesCombined,
  Users,
  Package,
  Sparkles,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const menuItems = [
    {
      name: "Overview",
      path: "/",
      icon: <LayoutDashboard size={19} />,
    },
    {
      name: "Sales Intelligence",
      path: "/sales",
      icon: <ChartNoAxesCombined size={19} />,
    },
    {
      name: "Customers",
      path: "/customers",
      icon: <Users size={19} />,
    },
    {
      name: "Products",
      path: "/products",
      icon: <Package size={19} />,
    },
    {
      name: "Forecast",
      path: "/forecast",
      icon: <Sparkles size={19} />,
    },
  ];

  const { user, logout } = useAuth();
  const userName = user?.name || "Mahnoor";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <aside className="sidebar">

      <div className="brand">

        <div className="brand-logo">
          M
        </div>

        <div>
          <h2>MarketLens</h2>
          <span>Analytics Platform</span>
        </div>

      </div>

      <div className="sidebar-section-title">
        ANALYTICS
      </div>

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
            {item.icon}
            <span>{item.name}</span>

            {item.name === "Overview" && (
              <div className="active-dot"></div>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">

        <div className="connection-card">

          <div className="connection-dot"></div>

          <div>
            <strong>Data Connected</strong>
            <span>PostgreSQL + Power BI</span>
          </div>

        </div>

        <div className="user-card">
          <div className="user-card-inner">
            <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
              <div className="user-avatar">{userInitial}</div>
              <div style={{ minWidth: 0 }}>
                <strong style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {userName}
                </strong>
                <span style={{ fontSize: "11px", color: "#64748b", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user?.email || "Workspace User"}
                </span>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="user-logout-btn"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>

      </div>

    </aside>
  );
};

export default Sidebar;