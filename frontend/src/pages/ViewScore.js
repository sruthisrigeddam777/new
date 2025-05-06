import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, Button } from "react-bootstrap";
import axios from "axios";

const ViewScore = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [score, setScore] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/auth/exam/${examId}/score/`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        });
        console.log("Score Fetched:",response.data);
        setScore(response.data.total_marks);
      } catch (error) {
        console.error("Error fetching score", error);
        setError("Exam not graded yet or no answers found.");
      }
    };
    fetchScore();
  }, [examId]);

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="p-4 text-center shadow-lg" style={{ maxWidth: "500px" }}>
        <h2>Your Score</h2>
        {error ? <p className="text-danger">{error}</p> : <p>{score !== null ? `Total Marks: ${score}` : "Loading..."}</p>}
        <Button variant="primary" onClick={() => navigate("/student-dashboard")}>
          Go to Dashboard
        </Button>
      </Card>
    </Container>
  );
};

export default ViewScore;