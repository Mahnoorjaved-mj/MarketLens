import { Bell, Search } from "lucide-react";

export default function Topbar({
  page = "Overview",
  userName = "Mahnoor",
  role = "Data Analyst"
}) {

  return (
    <header className="topbar">

      <div className="breadcrumb">

        <span className="breadcrumb-muted">
          MarketLens
        </span>

        <span className="breadcrumb-slash">
          /
        </span>

        <strong>
          {page}
        </strong>

      </div>

      <div className="topbar-right">

        <div className="topbar-search">
          <Search size={16}/>
          <span>Business Intelligence</span>
        </div>

        <button
          className="notification-btn"
          aria-label="Notifications"
        >
          <Bell size={18}/>
          <i/>
        </button>

        <div className="topbar-profile">

          <div className="topbar-avatar">
            {userName.charAt(0)}
          </div>

          <div className="topbar-user">
            <strong>{userName}</strong>
            <span>{role}</span>
          </div>

        </div>

      </div>

    </header>
  );
}