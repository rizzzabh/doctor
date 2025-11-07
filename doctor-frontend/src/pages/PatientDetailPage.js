import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import DoctorRecommendationService from "../services/DoctorRecommendationService";
import "./PatientDetailPage.css";

const recommendationService = new DoctorRecommendationService();

function PatientDetailPage() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [isServiceReady, setIsServiceReady] = useState(false);

  useEffect(() => {
    const loadServiceRules = async () => {
      try {
        console.log("DEBUG: 1. Loading rules..."); // Log 1
        const success = await recommendationService.loadRules(
          "/Riders_12_March_2025.json"
        );
        if (success) {
          setIsServiceReady(true);
          console.log("DEBUG: 2. Rules loaded successfully."); // Log 2
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
        console.log("DEBUG: 3. Patient data fetched:", res.data); // Log 3
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
      // --- START OF DEBUG BLOCK ---
      console.log("DEBUG: 4. handleCalculateAndSave triggered.");
      console.log("DEBUG: 5. Service Ready?", isServiceReady);
      console.log("DEBUG: 6. Using Grade:", patient.grade);
      console.log("DEBUG: 7. Using Code:", JSON.stringify(patient.code));
      // --- END OF DEBUG BLOCK ---

      const calculatedStructure = recommendationService.getRecommendation(
        patient.grade,
        patient.code
      );

      // --- THIS IS THE MOST IMPORTANT LOG ---
      console.log("DEBUG: 8. Calculated Structure:", calculatedStructure);
      // ---

      if (
        calculatedStructure.includes("Error") ||
        calculatedStructure.includes("No specific recommendation")
      ) {
        setError(calculatedStructure);
        setIsCalculating(false);
        return; // Stop if calculation failed
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

      console.log(
        "DEBUG: 9. Save successful. Server responded with:",
        res.data
      ); // Log 9
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

  // ... (rest of the file (JSX) is the same) ...

  if (loading) {
    return <h2>Loading patient details...</h2>;
  }

  if (error && !patient) {
    return <h2 style={{ color: "red" }}>{error}</h2>;
  }

  if (!patient) {
    return <h2>Patient not found.</h2>;
  }

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
