import {
  Search,
  Bell,
} from "lucide-react";

const Topbar = () => {
  return (
    <header className="topbar">

      <div className="breadcrumb">
        MarketLens
        <span>/</span>
        <strong>Analytics Workspace</strong>
      </div>

      <div className="topbar-right">

        <div className="search-box">
          <Search size={18} />
          <span>Business Intelligence</span>
        </div>

        <button className="notification-btn">
          <Bell size={19} />
          <span></span>
        </button>

        <div className="profile">

          <div className="profile-avatar">
            M
          </div>

          <div>
            <strong>Mahnoor</strong>
            <small>Data Analyst</small>
          </div>

        </div>

      </div>

    </header>
  );
};

export default Topbar;