import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    // TODO: Add login logic and error handling
    navigate("/"); // Redirect to home page on successful login
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Login to your account</h1>
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-field">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">
            Log In
          </button>
        </form>
        <p className="signup-text">
          Don't have an account? <a href="/register">Sign up</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
