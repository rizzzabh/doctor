import React, { useState } from "react";
import "./Modal.css";

function AppointmentModal({ patient, onClose, onSchedule }) {
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  // Get current datetime in a format the input accepts
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const handleSchedule = () => {
    if (!date) {
      alert("Please select a date and time.");
      return;
    }
    setLoading(true);
    onSchedule(date);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>
            Schedule Appointment for{" "}
            <span className="patient-name">{patient.name}</span>
          </h3>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="appointment-date">Select Date & Time:</label>
            <input
              type="datetime-local"
              id="appointment-date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={getMinDateTime()} // Prevents scheduling in the past
            />
          </div>
        </div>
        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSchedule}
            disabled={loading}
          >
            {loading ? "Scheduling..." : "Schedule"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AppointmentModal;
