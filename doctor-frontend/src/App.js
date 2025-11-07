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
import PrivateRoute from "./components/PrivateRoute";
import PatientDetailPage from "./pages/PatientDetailPage";
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
            <Route path="updates" element={<UpdatesPage />} />

            <Route path="patients/:id" element={<PatientDetailPage />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
