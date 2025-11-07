import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import PatientListPage from "./pages/PatientListPage";
import UpdatesPage from "./pages/UpdatesPage";
import PatientDetailPage from "./pages/PatientDetailPage";
import UpdateDetailPage from "./pages/UpdateDetailPage";
import MRUpdatesPage from "./pages/MRUpdatesPage"; // <-- 1. IMPORT
import PrivateRoute from "./components/PrivateRoute";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          >
            {/* Default dashboard page */}
            <Route index element={<Navigate to="patients" />} />

            {/* Child routes of /dashboard */}
            <Route path="patients" element={<PatientListPage />} />
            <Route path="patients/:id" element={<PatientDetailPage />} />
            <Route path="updates" element={<UpdatesPage />} />
            <Route path="updates/:id" element={<UpdateDetailPage />} />

            {/* 👇 2. ADD THIS NEW ROUTE 👇 */}
            <Route path="mr-updates" element={<MRUpdatesPage />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
