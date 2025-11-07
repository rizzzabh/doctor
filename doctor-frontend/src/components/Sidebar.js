import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";
// We'll use react-router-dom's NavLink for active styling

function Sidebar() {
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Doctor's Panel</h3>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            {/* NavLink adds an 'active' class automatically */}
            <NavLink to="/dashboard/patients">Patients</NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/updates">Updates</NavLink>
          </li>
        </ul>
      </nav>
      <div className="sidebar-footer">
        <button onClick={onLogout} className="logout-button">
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
