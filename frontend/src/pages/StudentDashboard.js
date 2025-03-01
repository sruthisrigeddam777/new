import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchExams } from "../services/examService";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadExams = async () => {
      try {
        const data = await fetchExams();
        setExams(data);
      } catch (error) {
        console.error("Error fetching exams", error);
      }
    };
    loadExams();
  }, []);

  const handleAttemptExam = () => {
    navigate("/exam/${examId}");
  };

  return (
    <div>
      <h2>Student Dashboard</h2>
      <p>Welcome, {user?.username}!</p>
      <button onClick={logout}>Logout</button>

      <h3>Available Exams</h3>
      <ul>
        {exams.map((exam) => (
          <li key={exam.id}>
            <strong>{exam.title}</strong>: {exam.description}
            <button onClick={() => handleAttemptExam(exam.id)}>Attempt Exam</button> {/* Will be implemented later */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentDashboard;
