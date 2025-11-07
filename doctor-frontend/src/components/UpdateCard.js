import React from "react";
import "./UpdateCard.css"; // We'll create this

function UpdateCard({ patient }) {
  const getUpdateInfo = () => {
    switch (patient.update_type) {
      case "prescription":
        return { text: "Needs Prescription", color: "#e67e22" }; // Orange
      case "appointment":
        return { text: "Wants Appointment", color: "#3498db" }; // Blue
      default:
        return { text: "No Update", color: "#95a5a6" }; // Gray
    }
  };

  const updateInfo = getUpdateInfo();

  return (
    <div className="update-card">
      <div className="update-card-body">
        <h3>{patient.name}</h3>
        <p>
          <strong>Age:</strong> {patient.age || "N/A"}
        </p>
      </div>
      <div
        className="update-card-footer"
        style={{ backgroundColor: updateInfo.color }}
      >
        {updateInfo.text}
      </div>
    </div>
  );
}

export default UpdateCard;
