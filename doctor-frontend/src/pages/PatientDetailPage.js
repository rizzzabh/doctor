import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import DoctorRecommendationService from "../services/DoctorRecommendationService";
import "./PatientDetailPage.css";

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

  /**
   * This function handles the "Calculate & Save" button click.
   * It now includes the all-important check for the token.
   */
  const handleCalculateAndSave = async () => {
    if (!patient || !isServiceReady) {
      setError("Service is not ready or no patient data.");
      return;
    }

    setIsCalculating(true);
    setError(""); // Clear previous errors

    try {
      // --- THIS IS THE FIX ---
      // 1. Get token and set headers
      const token = localStorage.getItem("token");

      // 2. CHECK FOR THE TOKEN
      if (!token) {
        setError("Your session has expired. Please log in again.");
        setIsCalculating(false);
        return; // Stop execution
      }

      // If we have a token, create the config
      const config = {
        headers: {
          "x-auth-token": token,
        },
      };
      // --- END OF FIX ---

      // 3. Run the REAL calculation
      const calculatedStructure = recommendationService.getRecommendation(
        patient.grade,
        patient.code
      );

      // 4. Send the new structure to the backend
      const res = await axios.put(
        `http://localhost:5001/api/patients/${id}/structure`,
        { molecular_structure: calculatedStructure },
        config // Pass the config with the token
      );

      // 5. Update the page with the new patient data
      setPatient(res.data);
      setIsCalculating(false);
    } catch (err) {
      console.error("Save Structure Error:", err);
      // Get the specific error message from the backend
      const errorMsg =
        err.response && err.response.data
          ? err.response.data.msg
          : "Failed to save structure.";
      setError(errorMsg); // This will show "No token, authorization denied" if it fails
      setIsCalculating(false);
    }
  };

  if (loading) {
    return <h2>Loading patient details...</h2>;
  }

  if (error && !patient) {
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

      {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}

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
            <div>
              <p>No structure calculated yet.</p>
              <button
                onClick={handleCalculateAndSave}
                disabled={isCalculating || !isServiceReady}
                className="calculate-button"
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
