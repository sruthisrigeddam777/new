import React from "react";

const AboutUs = () => {
  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4">
        <h2 className="text-center fw-bold">About Us</h2>
        <p className="text-center text-muted">
          Welcome to the Online Exam System! We provide a secure and seamless online assessment platform.
        </p>

        <div className="row mt-4">
          <div className="col-md-6">
            <h4 className="fw-semibold">Our Mission</h4>
            <p>
              We aim to revolutionize online examinations by ensuring fairness, security, and ease of use for all users.
            </p>
          </div>
          <div className="col-md-6">
            <h4 className="fw-semibold">Why Choose Us?</h4>
            <ul className="list-unstyled">
              <li>✅ Secure and reliable platform</li>
              <li>✅ AI-powered proctoring & monitoring</li>
              <li>✅ Instant result generation for MCQs</li>
              <li>✅ User-friendly interface for students & admins</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;