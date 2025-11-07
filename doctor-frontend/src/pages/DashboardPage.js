import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function DashboardPage() {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        {/* Child routes (Patients, Updates) will be rendered here */}
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardPage;
