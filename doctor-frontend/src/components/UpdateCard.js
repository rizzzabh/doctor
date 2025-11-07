import React from "react";
import { Link } from "react-router-dom";
import "./UpdateCard.css";

function UpdateCard({ patient }) {
  const getUpdateInfo = () => {
    switch (patient.update_type) {
      case "prescription":
        return { text: "Needs Prescription", className: "prescription" };
      case "appointment":
        return { text: "Wants Appointment", className: "appointment" };
      default:
        return { text: "No Update", className: "none" };
    }
  };

  const updateInfo = getUpdateInfo();

  return (
    <Link to={`/dashboard/updates/${patient._id}`} className="update-card-link">
      <div className="update-card">
        <div className="update-card-body">
          <h3>{patient.name}</h3>
          <p>
            <strong>Age:</strong> {patient.age || "N/A"}
          </p>
        </div>
        <div className={`update-card-footer ${updateInfo.className}`}>
          {updateInfo.text}
        </div>
      </div>
    </Link>
  );
}

export default UpdateCard;
