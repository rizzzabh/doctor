import React, { useState } from "react";
import "./Modal.css";

function AppointmentModal({ patient, onClose, onSchedule }) {
  const [date, setDate] = useState("");

  const handleSchedule = () => {
    if (!date) {
      alert("Please select a date and time.");
      return;
    }
    onSchedule(date); // Pass the date up to the parent
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
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSchedule}>
            Schedule
          </button>
        </div>
      </div>
    </div>
  );
}

export default AppointmentModal;
