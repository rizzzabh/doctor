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

        // We need to send the token to our protected routes
        // We'll create a special 'auth' middleware next,
        // but for now, the GET route is public.
        const res = await axios.get("http://localhost:5001/api/patients");

        setPatients(res.data); // Store the patient list
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch patients. Please try again.");
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
