import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./PatientDetailPage.css"; // We can re-use the same CSS!

function UpdateDetailPage() {
  const { id } = useParams(); // Gets the :id from the URL
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authorization error. Please log in again.");
          setLoading(false);
          return;
        }
        const config = { headers: { "x-auth-token": token } };

        const res = await axios.get(
          `http://localhost:5001/api/patients/${id}`,
          config
        );
        setPatient(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch patient data.");
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  // --- Action Buttons ---
  const renderActionButtons = () => {
    if (!patient) return null;

    // This is where we'll add the logic later to send
    // prescriptions or schedule appointments.
    const onSendPrescription = () =>
      alert("Prescription sent! (Logic to be added)");
    const onSchedule = () =>
      alert("Appointment scheduled! (Logic to be added)");

    switch (patient.update_type) {
      case "prescription":
        return (
          <button className="action-button-green" onClick={onSendPrescription}>
            Send Prescription
          </button>
        );
      case "appointment":
        return (
          <div className="action-button-group">
            <button className="action-button-blue" onClick={onSchedule}>
              Schedule Appointment
            </button>
            <button
              className="action-button-green"
              onClick={onSendPrescription}
            >
              Send Prescription Instead
            </button>
          </div>
        );
      default:
        return <p>No specific update required for this patient.</p>;
    }
  };

  if (loading) return <h2>Loading patient details...</h2>;
  if (error) return <h2 style={{ color: "red" }}>{error}</h2>;
  if (!patient) return <h2>Patient not found.</h2>;

  return (
    <div className="patient-detail-container">
      <Link to="/dashboard/updates" className="back-link">
        &larr; Back to Updates
      </Link>

      <h2 className="patient-name-header">{patient.name}</h2>
      <p>
        <strong>Update Request:</strong> {patient.update_type}
      </p>

      <div className="detail-grid">
        {/* --- This card shows the final action buttons --- */}
        <div className="detail-card full-width">
          <h3>Doctor's Actions</h3>
          {renderActionButtons()}
        </div>

        <div className="detail-card">
          <h3>Recommended Structure</h3>
          {patient.molecular_structure ? (
            <pre
              style={{
                backgroundColor: "#eafaf1",
                border: "1px solid #27ae60",
              }}
            >
              {patient.molecular_structure}
            </pre>
          ) : (
            <p>
              No structure has been calculated for this patient yet. Please go
              to the main "Patients" list to calculate it.
            </p>
          )}
        </div>

        <div className="detail-card">
          <h3>Medical History (Context)</h3>
          <pre>{JSON.stringify(patient.medical_history, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}

export default UpdateDetailPage;
