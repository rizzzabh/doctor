import React, { useState, useEffect } from "react";
import axios from "axios";
import UpdateCard from "../components/UpdateCard";
import "./ListPage.css"; // Re-use the same CSS

function UpdatesPage() {
  const [updatePatients, setUpdatePatients] = useState([]);
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

        const updates = res.data.filter(
          (patient) =>
            patient.update_type === "prescription" ||
            patient.update_type === "appointment"
        );

        setUpdatePatients(updates);
        setLoading(false);
      } catch (err) {
        console.error(err);
        if (err.response && err.response.status === 401) {
          setError("Authorization failed. Please log in again.");
        } else {
          setError("Failed to fetch updates.");
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
          <h2>Patient Updates</h2>
        </div>
        <p>Loading updates...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h2>Patient Updates</h2>
        </div>
        <p className="page-error">{error}</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Patient Updates</h2>
        <span className="count-badge blue">{updatePatients.length}</span>
      </div>
      <div className="card-list-container">
        {updatePatients.length > 0 ? (
          updatePatients.map((patient) => (
            <UpdateCard key={patient._id} patient={patient} />
          ))
        ) : (
          <p>No patient updates at this time.</p>
        )}
      </div>
    </div>
  );
}

export default UpdatesPage;
