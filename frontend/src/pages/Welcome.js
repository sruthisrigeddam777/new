import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Welcome.css"; // Import CSS file for custom styles

const Welcome = () => {
  return (
    <div className="welcome-container">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow">
        <div className="container">
          <a className="navbar-brand fw-bold text-primary" href="/">Online Exam System</a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link to="/" className="nav-link">Home</Link>
              </li>
              <li className="nav-item">
                <Link to="/about" className="nav-link">About Us</Link>
              </li>
              <li className="nav-item">
                <Link to="/contact" className="nav-link">Contact Us</Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="btn btn-outline-light mx-2">Sign Up</Link>
              </li>
              <li className="nav-item">
                <Link to="/login" className="btn btn-outline-light">Login</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="welcome-content">
        <div className="overlay">
          <h1 className="fw-bold text-light">Welcome to Online Exam System</h1>
          <p className="text-light">Your one-stop solution for secure and seamless online examinations.</p>
          <div className="d-flex justify-content-center">
            <Link to="/register" className="btn btn-primary mx-2">Get Started</Link>
            <Link to="/login" className="btn btn-success">Login</Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="features py-5 bg-light text-center">
        <div className="container">
          <h2 className="fw-bold text-dark mb-4">Why Choose Us?</h2>
          <div className="row">
            <div className="col-md-4">
              <h4>📚 Easy-to-Use</h4>
              <p>Intuitive platform with a simple interface for students and teachers.</p>
            </div>
            <div className="col-md-4">
              <h4>🔒 Secure Exams</h4>
              <p>Advanced proctoring and authentication ensure exam integrity.</p>
            </div>
            <div className="col-md-4">
              <h4>📊 Instant Results</h4>
              <p>Get real-time feedback and analytics for your exam performance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer bg-dark text-light text-center py-3">
        <div className="container">
          <p>© 2025 Online Exam System. All rights reserved.</p>
          <div>
            <Link to="/terms" className="text-light mx-2">Terms & Conditions</Link> |
            <Link to="/privacy" className="text-light mx-2">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;

// import React from "react";
// import { Link } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "../styles/Welcome.css"; // Import CSS file for custom styles

// const Welcome = () => {
//   return (
//     <div className="welcome-container">
//       {/* Navbar */}
//       <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
//         <div className="container">
//           <a className="navbar-brand" href="/">Online Exam System</a>
//           <div className="ml-auto">
//             <Link to="/register" className="btn btn-outline-light mx-2">Sign Up</Link>
//             <Link to="/login" className="btn btn-outline-light">Login</Link>
//           </div>
//         </div>
//       </nav>

//       {/* Main Section */}
//       <div className="welcome-content">
//         <h1>Welcome to Online Exam System</h1>
//         <p>Your one-stop solution for secure and seamless online examinations.</p>
//         <Link to="/register" className="btn btn-primary mx-2">Sign Up</Link>
//         <Link to="/login" className="btn btn-success">Login</Link>
//       </div>

//       {/* Footer */}
//       <footer className="footer bg-dark text-light text-center py-3">
//         <p>© 2025 Online Exam System. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// };

// export default Welcome;