import React from 'react';
import { Link } from 'react-router-dom';
const Navbar = () => {
  return (
    <nav className="navbar  navbar-expand-lg navbar-light bg-white py-3 fixed-top">
      <div className="container">
        <a className="navbar-brand" href="/">
          <i className="bi bi-lightning-fill brand-icon"></i>
          EnergyMinds AI
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav align-items-center">
            <li className="nav-item">
              <a className="nav-link" href="#features">Features</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#about">About Us</a>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/login">Log in</Link>
            </li>
            <li className="nav-item ms-lg-3">
              <a className="btn btn-primary btn-signup" href="/signup">Sign Up Free</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;