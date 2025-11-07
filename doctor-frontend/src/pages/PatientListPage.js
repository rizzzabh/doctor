import React, { useState, useEffect } from "react";
import axios from "axios";
import PatientCard from "../components/PatientCard";

// We need a wrapper for the cards to display nicely
const PatientListContainer = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "flex-start",
  padding: "0 10px",
};

function PatientListPage() {
  const [patients, setPatients] = useState([]); // To store the list of patients
  const [loading, setLoading] = useState(true); // To show a loading message
  const [error, setError] = useState("");

  // This function will run once when the page loads
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        // Get the token from localStorage
        const token = localStorage.getItem("token");

        if (!token) {
          setError("No token found. Please log in again.");
          setLoading(false);
          return;
        }

        // Create an axios config object to send the token in the header
        const config = {
          headers: {
            "x-auth-token": token,
          },
        };

        // Pass the config object with the GET request
        const res = await axios.get(
          "http://localhost:5001/api/patients",
          config
        );

        setPatients(res.data); // Store the patient list
        setLoading(false);
      } catch (err) {
        console.error(err);
        // Check for auth error
        if (err.response && err.response.status === 401) {
          setError("Authorization failed. Please log in again.");
        } else {
          setError("Failed to fetch patients.");
        }
        setLoading(false);
      }
    };

    fetchPatients();
  }, []); // The empty array [] means this runs only once

  if (loading) {
    return <h2>Loading patients...</h2>;
  }

  if (error) {
    return <h2 style={{ color: "red" }}>{error}</h2>;
  }

  return (
    <div>
      <h2>Patients List ({patients.length})</h2>
      <div style={PatientListContainer}>
        {patients.length > 0 ? (
          patients.map((patient) => (
            <PatientCard key={patient._id} patient={patient} />
          ))
        ) : (
          <p>No patients found.</p>
        )}
      </div>
    </div>
  );
}

export default PatientListPage;
