import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.css"; // We'll create this CSS file

function Sidebar() {
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.removeItem("token"); // Clear the token
    navigate("/login"); // Redirect to login
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Doctor's Panel</h3>
      </div>
      <ul className="sidebar-links">
        <li>
          {/* Link to the 'Patients' page */}
          <Link to="/dashboard/patients">Patients</Link>
        </li>
        <li>
          {/* Link to the 'Updates' page */}
          <Link to="/dashboard/updates">Updates</Link>
        </li>
      </ul>
      <div className="sidebar-footer">
        <button onClick={onLogout} className="logout-button">
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
