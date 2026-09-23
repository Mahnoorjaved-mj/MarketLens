import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

import Overview from "./pages/Overview";
import Sales from "./pages/Sales";
import Customers from "./pages/Customers";
import Products from "./pages/Products";
import Forecast from "./pages/Forecast";

function DashboardLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Topbar />
        <div className="page-content">{children}</div>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Core Analytics Platform Pages */}
        <Route
          path="/"
          element={
            <DashboardLayout>
              <Overview />
            </DashboardLayout>
          }
        />
        <Route
          path="/sales"
          element={
            <DashboardLayout>
              <Sales />
            </DashboardLayout>
          }
        />
        <Route
          path="/customers"
          element={
            <DashboardLayout>
              <Customers />
            </DashboardLayout>
          }
        />
        <Route
          path="/products"
          element={
            <DashboardLayout>
              <Products />
            </DashboardLayout>
          }
        />
        <Route
          path="/forecast"
          element={
            <DashboardLayout>
              <Forecast />
            </DashboardLayout>
          }
        />

        {/* Removed login/register - seamlessly redirect to main dashboard */}
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/register" element={<Navigate to="/" replace />} />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;