import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card, Button } from "react-bootstrap";

const ExamSubmitted = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }, []);

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="p-4 text-center shadow-lg" style={{ maxWidth: "500px" }}>
        <h2 className="text-success">✅ Exam Submitted Successfully!</h2>
        <p className="text-muted">
          Your responses have been recorded.</p>
        <Button variant="primary" onClick={() => navigate("/student-dashboard")}>
          Go to Dashboard
        </Button>
      </Card>
    </Container>
  );
};

export default ExamSubmitted;