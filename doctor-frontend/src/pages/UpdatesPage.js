import React, { useState, useEffect } from "react";
import axios from "axios";
import UpdateCard from "../components/UpdateCard";

const UpdateListContainer = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "flex-start",
  padding: "0 10px",
};

function UpdatesPage() {
  const [updatePatients, setUpdatePatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found. Please log in again.");
          setLoading(false);
          return;
        }

        const config = {
          headers: { "x-auth-token": token },
        };

        // We fetch ALL patients from the same endpoint
        const res = await axios.get(
          "http://localhost:5001/api/patients",
          config
        );

        // --- THIS IS THE KEY ---
        // We filter the results on the frontend
        const updates = res.data.filter(
          (patient) =>
            patient.update_type === "prescription" ||
            patient.update_type === "appointment"
        );
        // --- END OF KEY ---

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
    return <h2>Loading updates...</h2>;
  }

  if (error) {
    return <h2 style={{ color: "red" }}>{error}</h2>;
  }

  return (
    <div>
      <h2>Patient Updates ({updatePatients.length})</h2>
      <div style={UpdateListContainer}>
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
