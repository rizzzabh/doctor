import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import PrescriptionModal from "../components/PrescriptionModal";
import AppointmentModal from "../components/AppointmentModal";
import "./PatientDetailPage.css"; // Re-use the new styles
import "../components/Modal.css";

function UpdateDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      navigate("/dashboard/updates");
    } catch (err) {
      console.error(err);
      alert("Failed to send prescription.");
    }
  };

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
      navigate("/dashboard/updates");
    } catch (err) {
      console.error(err);
      alert("Failed to schedule appointment.");
    }
  };

  const renderActionButtons = () => {
    if (!patient) return null;

    const onSendPrescription = () => setShowPrescriptionModal(true);
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

  if (loading) {
    return (
      <div className="patient-detail-container">
        <div className="page-header">
          <h2>Loading Update...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="patient-detail-container">
        <div className="page-header">
          <h2>Error</h2>
        </div>
        <p className="page-error">{error}</p>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="patient-detail-container">
        <div className="page-header">
          <h2>Patient Not Found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="patient-detail-container">
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

      <div className="detail-page-header">
        <Link to="/dashboard/updates" className="back-link">
          &larr; Back to Updates
        </Link>
        <h2 className="patient-name-header">{patient.name}</h2>
        <p style={{ marginTop: "5px", color: "#495057" }}>
          <strong>Update Request:</strong> {patient.update_type}
        </p>
      </div>

      {error && <p className="page-error">{error}</p>}

      <div className="detail-grid">
        <div className="detail-card full-width">
          <h3>Doctor's Actions</h3>
          {renderActionButtons()}
        </div>

        <div className="detail-card">
          <h3>Recommended Structure</h3>
          {patient.molecular_structure ? (
            <div className="structure-display">
              {patient.molecular_structure}
            </div>
          ) : (
            <p style={{ color: "#dc3545", fontWeight: 500 }}>
              No structure has been calculated for this patient. Please go to
              the main "Patients" list, find this patient, and calculate the
              structure first.
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
