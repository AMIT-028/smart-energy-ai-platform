import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
// We reuse the Login.css because it has all the styles we need
import "../Login.css"; 
// You can use a different image for Signup here
import signupImage from '../utils/hero.png'; 

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      // Changed endpoint to /api/signup based on your previous code
      const res = await axios.post("http://localhost:5000/api/signup", {
        name,
        email,
        password
      });

      setMessage("Signup successful! Redirecting...");
      setTimeout(() => navigate("/login"), 1200); // Redirect to Login, not root
    } catch (err) {
      setMessage("Signup failed — try different email");
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-container">
        
        {/* Left Side: Branding (Reusing Login CSS) */}
        <div className="login-branding">
          <h1 className="branding-title">EnergyMinds AI</h1>
          <p className="branding-subtitle">Join the revolution. Monitor energy smarter.</p>
          <img src={signupImage} alt="Signup Visual" className="branding-image" />
        </div>

        {/* Right Side: Signup Form */}
        <div className="login-form-section">
          <h2 className="form-title">Create Account</h2>
          
          {message && <p className="error-message">{message}</p>}

          <form onSubmit={handleSignup} className="login-form">
            
            {/* Name Input */}
            <div className="form-group">
              <label htmlFor="name" className="form-label">Full Name</label>
              <input
                type="text"
                id="name"
                className="form-input"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Email Input */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                type="email"
                id="email"
                className="form-input"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Input */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="password-input-wrapper">
                <input
                  type="password"
                  id="password"
                  className="form-input"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <i className="bi bi-eye-slash password-toggle-icon"></i>
              </div>
            </div>

            <button type="submit" className="login-button">Sign Up</button>
          </form>

          {/* Footer Links */}
          <div className="form-footer">
            <span style={{ color: '#666' }}>Already have an account? </span>
            <Link to="/login" className="signup-link">Log In</Link>
          </div>
          
          <div className="back-to-home-wrapper">
            <Link to="/" className="back-to-home-link">Back to Home</Link>
          </div>
        </div>

      </div>
    </div>
  );
}