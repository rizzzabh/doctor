import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./PatientDetailPage.css"; // We'll create this

function PatientDetailPage() {
  const { id } = useParams(); // Gets the :id from the URL
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authorization error");
          setLoading(false);
          return;
        }

        const config = {
          headers: { "x-auth-token": token },
        };

        // Fetch data from our new backend endpoint
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
  }, [id]); // Re-run this if the 'id' in the URL changes

  if (loading) {
    return <h2>Loading patient details...</h2>;
  }

  if (error) {
    return <h2 style={{ color: "red" }}>{error}</h2>;
  }

  if (!patient) {
    return <h2>Patient not found.</h2>;
  }

  // Helper to display object data nicely
  const renderObject = (obj) => {
    return <pre>{JSON.stringify(obj, null, 2)}</pre>;
  };

  return (
    <div className="patient-detail-container">
      <Link to="/dashboard/patients" className="back-link">
        &larr; Back to Patients List
      </Link>

      <h2 className="patient-name-header">{patient.name}</h2>

      <div className="detail-grid">
        <div className="detail-card">
          <h3>Personal Info</h3>
          <p>
            <strong>Email:</strong> {patient.email}
          </p>
          <p>
            <strong>Age:</strong> {patient.age}
          </p>
          <p>
            <strong>Sex:</strong> {patient.sex}
          </p>
        </div>

        <div className="detail-card full-width">
          <h3>Medical History</h3>
          {renderObject(patient.medical_history)}
        </div>

        <div className="detail-card">
          <h3>Calculation Data (Raw)</h3>
          <p>
            <strong>Grade:</strong> {patient.grade}
          </p>
          <p>
            <strong>Code:</strong>
          </p>
          {renderObject(patient.code)}
        </div>

        <div className="detail-card">
          <h3>Molecular Structure</h3>
          {patient.molecular_structure ? (
            renderObject(patient.molecular_structure)
          ) : (
            <p>No structure calculated yet.</p>
          )}
          {/* In the next step, we'll add the calculation logic here */}
        </div>
      </div>
    </div>
  );
}

export default PatientDetailPage;
