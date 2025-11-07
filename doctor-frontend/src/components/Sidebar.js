import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";

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
            <NavLink to="/dashboard/patients">
              {/* We can add icons or emojis for better UI */}
              🧑‍⚕️ Patients
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/updates">🔔 Updates</NavLink>
          </li>
          {/* 👇 3. ADD THIS NEW LIST ITEM 👇 */}
          <li>
            <NavLink to="/dashboard/mr-updates">💊 MR Updates</NavLink>
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
