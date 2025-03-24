import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchExams } from "../services/examService";
import { useNavigate } from "react-router-dom";
import { Container, Table, Button, Card } from "react-bootstrap";
import axios from "axios";

const StudentDashboard = () => {
  // const { user, logout } = useAuth();
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();
  const logout = () => {
    // Clear authentication data (adjust as needed)
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  
    // Redirect to login page
    navigate("/login");
  };
  

  // useEffect(() => {
  //   const loadExams = async () => {
  //     try {
  //       const data = await fetchExams();
  //       setExams(data);
  //     } catch (error) {
  //       console.error("Error fetching exams", error);
  //     }
  //   };
  //   loadExams();
  // }, []);
  useEffect(() => {
    const loadExams = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/auth/student/exams/", {
          headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        });
        console.log("Fetched Exams:", response.data);  // ✅ Debugging log
        setExams(response.data);
      } catch (error) {
        console.error("Error fetching exams", error);
      }
    };
    loadExams();
  }, []);


  const handleAttemptExam = (examId) => {
    navigate(`/exam/${examId}`);
  };

  const handleViewScore = (examId) => {
    navigate(`/exam/${examId}/score`);
  };

  return (
    <Container className="mt-5">
      <Card className="p-4 shadow-lg">
        <h2 className="text-center">Student Dashboard</h2>


        <div className="d-flex justify-content-end">
          <Button variant="danger" onClick={logout}>Logout</Button>
        </div>

        {/* Available Exams */}
        <h3 className="mt-4">Available Exams</h3>
        {exams.length > 0 ? (
          <Table striped bordered hover responsive className="mt-3">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam) => (
                <tr key={exam.id}>
                  <td>{exam.id}</td>
                  <td>{exam.title}</td>
                  <td>{exam.description}</td>
                  <td>
                    {/* <Button variant="success" onClick={() => handleAttemptExam(exam.id)}>
                      Attempt Exam
                    </Button> */}
                    {!exam.attempted ? (
                      <Button variant="success" onClick={() => handleAttemptExam(exam.id)}>
                        Attempt Exam
                      </Button>
                    ) : (
                      <>
                        <span className="text-success">Attempted</span>
                        <Button variant="info" onClick={() => handleViewScore(exam.id)} className="ms-2">
                          View Score
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p className="text-center text-muted">No exams available</p>
        )}
      </Card>
    </Container>
  );
};

export default StudentDashboard;
