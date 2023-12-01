import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./index.css";
import * as client from "../client.js";
import { AuthContext } from "../../context/AuthContext.js";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const credentials = { username, password };
      const response = await client.signin(credentials);
      console.log("user666:", response);
      if (response && response.token) {
        const { user, token } = response;
        setAuth({ user, token });
        navigate("/");
      } else {
        setError("Invalid login credentials.");
      }
    } catch (error) {
      console.log("Login Error:", error);
      setError(error.message || "An error occurred while logging in.");
    }
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
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="login-button">
            Log In
          </button>
        </form>
        <p className="signup-text">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
