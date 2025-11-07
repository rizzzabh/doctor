import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    specialization: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { name, email, password, specialization } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    try {
      // Our backend API endpoint
      const res = await axios.post(
        "http://localhost:5001/api/auth/register",
        formData
      );

      console.log(res.data); // This will log the { token: "..." }

      // Store the token in localStorage
      localStorage.setItem("token", res.data.token);

      // TODO: In the next step, we will redirect to the dashboard
      // navigate('/dashboard');

      alert("Registration Successful! Redirecting to login...");
      navigate("/login");
    } catch (err) {
      console.error(err.response.data);
      setError(err.response.data.msg || "Registration failed");
    }
  };

  return (
    <div className="form-container">
      <h2>Doctor Registration</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={onChange}
            required
          />
        </div>
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
        <div className="form-group">
          <label>Specialization</label>
          <input
            type="text"
            name="specialization"
            value={specialization}
            onChange={onChange}
          />
        </div>
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}

export default RegisterPage;
