import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./index.css";
import * as client from "../client";

function Register() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
    role: "USER",
  });
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await client.signup({
        username: credentials.username,
        email: credentials.email,
        password: credentials.password,
        firstName: credentials.firstName,
        lastName: credentials.lastName,
      });
      navigate("/login");
    } catch (err) {
      setError(err.message || "Signup failed.");
    }
  };

  return (
    <div className="register-container">
      <h2>Create Your Account</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="register-form">
        <input
          type="text"
          name="username"
          value={credentials.username}
          onChange={handleInputChange}
          placeholder="Username"
          required
        />

        <input
          type="password"
          name="password"
          value={credentials.password}
          onChange={handleInputChange}
          placeholder="Password"
          required
        />
        <input
          type="email"
          name="email"
          value={credentials.email}
          onChange={handleInputChange}
          placeholder="Email"
          required
        />

        <input
          type="text"
          name="firstName"
          value={credentials.firstName}
          onChange={handleInputChange}
          placeholder="First Name"
          required
        />

        <input
          type="text"
          name="lastName"
          value={credentials.lastName}
          onChange={handleInputChange}
          placeholder="Last Name"
          required
        />

        <div className="role-selection">
          <label>
            <input
              type="radio"
              name="role"
              value="USER"
              checked={credentials.role === "USER"}
              onChange={handleInputChange}
            />
            User
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="CRITIC"
              checked={credentials.role === "CRITIC"}
              onChange={handleInputChange}
            />
            Critic
          </label>
        </div>
        <button type="submit" className="register-btn">
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default Register;
