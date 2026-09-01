import { useState } from "react";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

import Overview from "./pages/Overview";
import Sales from "./pages/Sales";
import Customers from "./pages/Customers";
import Products from "./pages/Products";
import Forecast from "./pages/Forecast";

import "./index.css";

function App() {
  const [activePage, setActivePage] = useState("Overview");

  const renderPage = () => {
    switch (activePage) {
      case "Overview":
        return <Overview />;

      case "Sales Intelligence":
        return <Sales />;

      case "Customers":
        return <Customers />;

      case "Products":
        return <Products />;

      case "Forecast":
        return <Forecast />;

      default:
        return <Overview />;
    }
  };

  return (
    <div className="app">

      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <main className="main-content">

        <Topbar
          page={activePage}
          userName="Mahnoor"
          role="Data Analyst"
        />

        <section className="page-container">
          {renderPage()}
        </section>

      </main>

    </div>
  );
}

export default App;