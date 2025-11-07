import React, { useState, useEffect } from "react";
import axios from "axios";
import PatientCard from "../components/PatientCard";
import "./ListPage.css"; // New shared CSS for list pages

function PatientListPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authorization failed.");
          setLoading(false);
          return;
        }
        const config = { headers: { "x-auth-token": token } };
        const res = await axios.get(
          "http://localhost:5001/api/patients",
          config
        );

        setPatients(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        if (err.response && err.response.status === 401) {
          setError("Authorization failed. Please log in again.");
        } else {
          setError("Failed to fetch patients.");
        }
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h2>Patients List</h2>
        </div>
        <p>Loading patients...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h2>Patients List</h2>
        </div>
        <p className="page-error">{error}</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Patients List</h2>
        <span className="count-badge">{patients.length}</span>
      </div>
      <div className="card-list-container">
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
