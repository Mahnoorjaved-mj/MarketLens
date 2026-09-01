import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

import Overview from "./pages/Overview";
import Sales from "./pages/Sales";
import Customers from "./pages/Customers";
import Products from "./pages/Products";
import Forecast from "./pages/Forecast";

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">

        <Sidebar />

        <main className="main-content">
          <Topbar />

          <div className="page-content">
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/products" element={<Products />} />
              <Route path="/forecast" element={<Forecast />} />
            </Routes>
          </div>

        </main>

      </div>
    </BrowserRouter>
  );
}

export default App;