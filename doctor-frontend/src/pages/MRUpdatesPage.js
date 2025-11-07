import React, { useState } from "react";
import "./ListPage.css"; // We'll re-use this
import "./MRUpdatesPage.css"; // And add our new styles

// --- This is your sample data ---
// You can replace this with an API call later
const mockMRData = [
  {
    id: 1,
    mrName: "Mr. James Chen (Bayer)",
    brandName: "Kerendia",
    molecule: "Finerenone",
    use: "To reduce the risk of kidney function loss, kidney failure, and cardiovascular events in adults with chronic kidney disease associated with type 2 diabetes.",
    date: "2025-11-06",
  },
  {
    id: 2,
    mrName: "Dr. Evelyn Reed (Pfizer)",
    brandName: "Paxlovid",
    molecule: "Nirmatrelvir & Ritonavir",
    use: "For the treatment of mild-to-moderate COVID-19 in adults and pediatric patients at high risk for progression to severe COVID-19.",
    date: "2025-11-05",
  },
  {
    id: 3,
    mrName: "Ms. Anita Brown (Novo Nordisk)",
    brandName: "Wegovy",
    molecule: "Semaglutide",
    use: "An adjunct to a reduced-calorie diet and increased physical activity for chronic weight management in adults with obesity.",
    date: "2025-11-03",
  },
  {
    id: 4,
    mrName: "Mr. David Lee (Lilly)",
    brandName: "Mounjaro",
    molecule: "Tirzepatide",
    use: "To improve blood sugar (glucose) in adults with type 2 diabetes mellitus, as an addition to diet and exercise.",
    date: "2025-11-01",
  },
];

function MRUpdatesPage() {
  // We use useState to hold the data, just like a real API call
  const [updates, setUpdates] = useState(mockMRData);
  const [loading, setLoading] = useState(false); // For future API use

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h2>Loading MR Updates...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>MR Updates</h2>
        <span className="count-badge blue">{updates.length}</span>
      </div>

      <div className="mr-updates-list">
        {updates.map((update) => (
          <div key={update.id} className="mr-update-card">
            <div className="mr-update-header">
              From: <strong>{update.mrName}</strong>
              <span className="mr-update-date">
                {new Date(update.date).toLocaleDateString()}
              </span>
            </div>
            <div className="mr-update-body">
              <h3 className="mr-medicine-name">{update.brandName}</h3>
              <p className="mr-molecule">{update.molecule}</p>
              <p className="mr-use">
                <strong>Use:</strong> {update.use}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MRUpdatesPage;
