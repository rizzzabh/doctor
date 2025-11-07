import React from "react";
import "./PatientCard.css"; // We'll create this CSS
import { Link } from "react-router-dom";
function PatientCard({ patient }) {
  // A function to get an icon for gender
  const getGenderIcon = (sex) => {
    if (sex.toLowerCase() === "male") return "♂";
    if (sex.toLowerCase() === "female") return "♀";
    return "?";
  };

  return (
    <div className="patient-card">
      <div className="patient-card-header">
        <h3>{patient.name}</h3>
        <span className={`gender-icon ${patient.sex?.toLowerCase()}`}>
          {getGenderIcon(patient.sex)}
        </span>
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
