import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../Login.css";
// Adjust the path if your hero.png is in a different location
import heroImage from '../utils/hero.png';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch {
      setMessage("Invalid email or password");
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-container">
        {/* Left Side: Branding */}
        <div className="login-branding">
          <h1 className="branding-title">EnergyMinds AI</h1>
          <p className="branding-subtitle">Smarter Energy. Powered by AI.</p>
          <img src={heroImage} alt="Dashboard Preview" className="branding-image" />
        </div>

        {/* Right Side: Login Form */}
        <div className="login-form-section">
          <h2 className="form-title">Welcome Back!</h2>
          {message && <p className="error-message">{message}</p>}
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                className="form-input"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="password-input-wrapper">
                <input
                  type="password"
                  id="password"
                  className="form-input"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <i className="bi bi-eye-slash password-toggle-icon"></i>
              </div>
            </div>

            <button type="submit" className="login-button">Log In</button>
          </form>

          <div className="form-footer">
            <Link to="/signup" className="signup-link">Sign Up Free</Link>
          </div>
          <div className="back-to-home-wrapper">
            <Link to="/" className="back-to-home-link">Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}