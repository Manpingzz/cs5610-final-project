import React from "react";
import { Link } from "react-router-dom";
import "./index.css";
import "../../styles/main.css";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-custom">
      <Link to="/" className="navbar-brand">
        My Movie
      </Link>

      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavDropdown"
        aria-controls="navbarNavDropdown"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div
        className="collapse navbar-collapse justify-content-end"
        id="navbarNavDropdown"
      >
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/login" className="nav-link">
              Login
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/register" className="nav-link">
              Register
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/profile" className="nav-link">
              Profile
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
