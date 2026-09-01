import { NavLink } from "react-router-dom";
import React from "react";

import {
  LayoutDashboard,
  ChartNoAxesCombined,
  Users,
  Package,
  Sparkles,
} from "lucide-react";

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

          <div className="user-avatar">
            M
          </div>

          <div>
            <strong>Mahnoor</strong>
            <span>Data Analyst</span>
          </div>

        </div>

      </div>

    </aside>
  );
};

export default Sidebar;