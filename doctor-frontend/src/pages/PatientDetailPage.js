import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import DoctorRecommendationService from "../services/DoctorRecommendationService";
import "./PatientDetailPage.css"; // New styles

// Create a single instance of the service
const recommendationService = new DoctorRecommendationService();

function PatientDetailPage() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [isServiceReady, setIsServiceReady] = useState(false);

  // Load the recommendation rules
  useEffect(() => {
    const loadServiceRules = async () => {
      try {
        const success = await recommendationService.loadRules(
          "/Riders_12_March_2025.json"
        );
        if (success) {
          setIsServiceReady(true);
        } else {
          setError("CRITICAL: Failed to load recommendation rules.");
        }
      } catch (err) {
        console.error("Rule Loading Error:", err);
        setError("CRITICAL: Failed to load recommendation rules.");
      }
    };
    loadServiceRules();
  }, []);

  // Fetch the patient data
  useEffect(() => {
    const fetchPatient = async () => {
      setLoading(true);
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
        console.error("Fetch Patient Error:", err);
        setError("Failed to fetch patient data.");
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  const handleCalculateAndSave = async () => {
    if (!patient || !isServiceReady) {
      setError("Service is not ready or no patient data.");
      return;
    }
    setIsCalculating(true);
    setError("");
    try {
      const calculatedStructure = recommendationService.getRecommendation(
        patient.grade,
        patient.code
      );

      if (
        calculatedStructure.includes("Error") ||
        calculatedStructure.includes("No specific recommendation")
      ) {
        setError(calculatedStructure);
        setIsCalculating(false);
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Your session has expired. Please log in again.");
        setIsCalculating(false);
        return;
      }

      const config = { headers: { "x-auth-token": token } };
      const res = await axios.put(
        `http://localhost:5001/api/patients/${id}/structure`,
        { molecular_structure: calculatedStructure },
        config
      );
      setPatient(res.data);
      setIsCalculating(false);
    } catch (err) {
      console.error("Save Structure Error:", err);
      const errorMsg =
        err.response && err.response.data
          ? err.response.data.msg
          : "Failed to save structure.";
      setError(errorMsg);
      setIsCalculating(false);
    }
  };

  if (loading) {
    return (
      <div className="patient-detail-container">
        <div className="page-header">
          <h2>Loading Patient...</h2>
        </div>
      </div>
    );
  }

  if (error && !patient) {
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

  const renderObject = (obj) => {
    return <pre>{JSON.stringify(obj, null, 2)}</pre>;
  };

  return (
    <div className="patient-detail-container">
      <div className="detail-page-header">
        <Link to="/dashboard/patients" className="back-link">
          &larr; Back to Patients List
        </Link>
        <h2 className="patient-name-header">{patient.name}</h2>
      </div>

      {error && <p className="page-error">{error}</p>}

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

        <div className="detail-card full-width">
          <h3>Medical History</h3>
          {renderObject(patient.medical_history)}
        </div>

        <div className="detail-card full-width">
          <h3>Recommended Structure</h3>
          {patient.molecular_structure ? (
            <div className="structure-display">
              {patient.molecular_structure}
            </div>
          ) : (
            <div>
              <p>No structure calculated yet.</p>
              <button
                onClick={handleCalculateAndSave}
                disabled={isCalculating || !isServiceReady}
                className="action-button-green"
              >
                {isCalculating
                  ? "Calculating..."
                  : isServiceReady
                  ? "Calculate & Save"
                  : "Loading Rules..."}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PatientDetailPage;
