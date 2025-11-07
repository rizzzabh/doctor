import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // ... (imports and state variables are the same) ...
  //   const navigate = useNavigate(); // Make sure this line is here

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5001/api/auth/login",
        formData
      );

      localStorage.setItem("token", res.data.token);

      // --- THIS IS THE CHANGE ---
      // Redirect to the dashboard
      navigate("/dashboard");
      // --- END OF CHANGE ---
    } catch (err) {
      console.error(err.response.data);
      setError(err.response.data.msg || "Invalid Credentials");
    }
  };

  // ... (return statement is the same) ...

  return (
    <div className="form-container">
      <h2>Doctor Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}

export default LoginPage;
