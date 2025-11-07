import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import PrescriptionModal from "../components/PrescriptionModal"; // <-- IMPORT
import AppointmentModal from "../components/AppointmentModal"; // <-- IMPORT
import "./PatientDetailPage.css"; // Re-use the styles
import "../components/Modal.css"; // <-- IMPORT MODAL CSS

function UpdateDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --- State for our Modals ---
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);

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

  // --- Handle Sending Prescription ---
  const handleSendPrescription = async (prescriptionText) => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { "x-auth-token": token } };

      const body = {
        patientId: patient._id,
        text: prescriptionText,
      };

      await axios.post(
        "http://localhost:5001/api/prescriptions/create",
        body,
        config
      );

      alert("Prescription sent successfully!");
      setShowPrescriptionModal(false);
      // We should also update the patient's status to 'none' here
      // For now, just navigate back to the list
      navigate("/dashboard/updates");
    } catch (err) {
      console.error(err);
      alert("Failed to send prescription.");
    }
  };

  // --- Handle Scheduling Appointment ---
  const handleScheduleAppointment = async (appointmentDate) => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { "x-auth-token": token } };

      const body = {
        patientId: patient._id,
        appointmentDate: appointmentDate,
      };

      await axios.post(
        "http://localhost:5001/api/appointments/create",
        body,
        config
      );

      alert("Appointment scheduled successfully!");
      setShowAppointmentModal(false);
      // We should also update the patient's status to 'none' here
      navigate("/dashboard/updates");
    } catch (err) {
      console.error(err);
      alert("Failed to schedule appointment.");
    }
  };

  // --- Updated Action Buttons ---
  const renderActionButtons = () => {
    if (!patient) return null;

    // "Send Prescription" button now opens the modal
    const onSendPrescription = () => setShowPrescriptionModal(true);
    // "Schedule Appointment" button now opens the modal
    const onSchedule = () => setShowAppointmentModal(true);

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
      {/* --- Render Modals (they are invisible until state is true) --- */}
      {showPrescriptionModal && (
        <PrescriptionModal
          patient={patient}
          onClose={() => setShowPrescriptionModal(false)}
          onSend={handleSendPrescription}
        />
      )}

      {showAppointmentModal && (
        <AppointmentModal
          patient={patient}
          onClose={() => setShowAppointmentModal(false)}
          onSchedule={handleScheduleAppointment}
        />
      )}

      {/* --- Page Content --- */}
      <Link to="/dashboard/updates" className="back-link">
        &larr; Back to Updates
      </Link>

      <h2 className="patient-name-header">{patient.name}</h2>
      <p>
        <strong>Update Request:</strong> {patient.update_type}
      </p>

      <div className="detail-grid">
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
