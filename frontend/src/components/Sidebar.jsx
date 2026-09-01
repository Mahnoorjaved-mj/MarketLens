import {
  LayoutDashboard,
  ChartNoAxesCombined,
  Users,
  Package,
  Sparkles
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview" },
  { icon: ChartNoAxesCombined, label: "Sales Intelligence" },
  { icon: Users, label: "Customers" },
  { icon: Package, label: "Products" },
  { icon: Sparkles, label: "Forecast" },
];

function Sidebar({ activePage, setActivePage }) {
  return (
    <aside className="sidebar">

      <div className="brand">

        <div className="brand-logo">
          M
        </div>

        <div className="brand-info">
          <h2>MarketLens</h2>
          <span>Analytics Platform</span>
        </div>

      </div>

      <div className="sidebar-nav">

        <p className="nav-title">
          ANALYTICS
        </p>

        <nav>

          {menuItems.map(
            ({ icon: Icon, label }) => (

              <button
                key={label}
                className={`nav-item ${
                  activePage === label ? "active" : ""
                }`}
                onClick={() => setActivePage(label)}
              >

                <span className="nav-icon">
                  <Icon
                    size={17}
                    strokeWidth={2.2}
                  />
                </span>

                <span className="nav-text">
                  {label}
                </span>

                {activePage === label && (
                  <span className="nav-active-dot">
                    •
                  </span>
                )}

              </button>

            )
          )}

        </nav>

      </div>

      <div className="sidebar-bottom">

        <div className="data-status">

          <span className="status-dot"/>

          <div>
            <strong>Data Connected</strong>
            <small>PostgreSQL + Power BI</small>
          </div>

        </div>

        <div className="sidebar-user">

          <div className="user-avatar">
            M
          </div>

          <div>
            <strong>Mahnoor</strong>
            <small>Data Analyst</small>
          </div>

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;