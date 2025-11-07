import React from "react";
import { Link } from "react-router-dom";
import "./PatientCard.css";

function PatientCard({ patient }) {
  const getGenderIcon = (sex) => {
    if (!sex) return "🧑";
    if (sex.toLowerCase() === "male") return "👨";
    if (sex.toLowerCase() === "female") return "👩";
    return "🧑"; // Default
  };

  return (
    <div className="patient-card">
      <div className="patient-card-header">
        <span className="gender-icon">{getGenderIcon(patient.sex)}</span>
        <h3 className="patient-name">{patient.name}</h3>
      </div>
      <div className="patient-card-body">
        <p>
          <strong>Age:</strong> {patient.age || "N/A"}
        </p>
        <p>
          <strong>Email:</strong> {patient.email}
        </p>
      </div>
      <div className="patient-card-footer">
        <Link
          to={`/dashboard/patients/${patient._id}`}
          className="details-button"
        >
          View Full Details
        </Link>
      </div>
    </div>
  );
}

export default PatientCard;
