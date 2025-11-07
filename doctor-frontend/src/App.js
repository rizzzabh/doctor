import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import "./App.css"; // We will create this file for basic styling

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* By default, show the login page */}
          <Route path="/" element={<Navigate to="/login" />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* We will add the /dashboard route in the next step */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
