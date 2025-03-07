import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card, Button } from "react-bootstrap";

const ExamSubmitted = () => {
  const navigate = useNavigate();

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="p-4 text-center shadow-lg" style={{ maxWidth: "500px" }}>
        <h2 className="text-success">✅ Exam Submitted Successfully!</h2>
        <p className="text-muted">
          Your responses have been recorded. You will be notified once the results are available.
        </p>
        <Button variant="primary" onClick={() => navigate("/student-dashboard")}>
          Go to Dashboard
        </Button>
      </Card>
    </Container>
  );
};

export default ExamSubmitted;

// import React from "react";
// import { useNavigate } from "react-router-dom";

// const ExamSubmitted = () => {
//   const navigate = useNavigate();

//   return (
//     <div>
//       <h2>Exam Submitted Successfully!</h2>
//       <p>Your responses have been recorded. You will be notified once the results are available.</p>
//       <button onClick={() => navigate("/student-dashboard")}>Go to Dashboard</button>
//     </div>
//   );
// };

// export default ExamSubmitted;
