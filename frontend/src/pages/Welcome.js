import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Welcome.css"; // Import CSS file for custom styles

const Welcome = () => {
  return (
    <div className="welcome-container">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <a className="navbar-brand" href="/">Online Exam System</a>
          <div className="ml-auto">
            <Link to="/register" className="btn btn-outline-light mx-2">Sign Up</Link>
            <Link to="/login" className="btn btn-outline-light">Login</Link>
          </div>
        </div>
      </nav>

      {/* Main Section */}
      <div className="welcome-content">
        <h1>Welcome to Online Exam System</h1>
        <p>Your one-stop solution for secure and seamless online examinations.</p>
        <Link to="/register" className="btn btn-primary mx-2">Sign Up</Link>
        <Link to="/login" className="btn btn-success">Login</Link>
      </div>

      {/* Footer */}
      <footer className="footer bg-dark text-light text-center py-3">
        <p>© 2025 Online Exam System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Welcome;


