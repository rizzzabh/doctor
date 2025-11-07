import React, { useState } from "react";
import "./Modal.css";

function PrescriptionModal({ patient, onClose, onSend }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text) {
      alert("Please write a prescription.");
      return;
    }
    onSend(text); // Pass the text up to the parent
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>
            Send Prescription for{" "}
            <span className="patient-name">{patient.name}</span>
          </h3>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="prescription-text">Prescription Details:</label>
            <textarea
              id="prescription-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g., Amlodipine 5mg, 1 tablet daily..."
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSend}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default PrescriptionModal;
