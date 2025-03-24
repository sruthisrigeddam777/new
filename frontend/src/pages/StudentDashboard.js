import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchExams } from "../services/examService";
import { useNavigate } from "react-router-dom";
import { Container, Table, Button, Card } from "react-bootstrap";

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

  const handleAttemptExam = (examId) => {
    navigate(`/exam/${examId}`);
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
              {exams.map((exam, index) => (
                <tr key={index}>
                  <td>{exam.id}</td>
                  <td>{exam.title}</td>
                  <td>{exam.description}</td>
                  <td>
                    <Button variant="success" onClick={() => handleAttemptExam(exam.id)}>
                      Attempt Exam
                    </Button>
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

// import React, { useState, useEffect } from "react";
// import { useAuth } from "../context/AuthContext";
// import { fetchExams } from "../services/examService";
// import { useNavigate } from "react-router-dom";

// const StudentDashboard = () => {
//   const { user, logout } = useAuth();
//   const [exams, setExams] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const loadExams = async () => {
//       try {
//         const data = await fetchExams();
//         setExams(data);
//       } catch (error) {
//         console.error("Error fetching exams", error);
//       }
//     };
//     loadExams();
//   }, []);

//   const handleAttemptExam = () => {
//     navigate("/exam/${examId}");
//   };

//   return (
//     <div>
//       <h2>Student Dashboard</h2>
//       <p>Welcome, {user?.username}!</p>
//       <button onClick={logout}>Logout</button>

//       <h3>Available Exams</h3>
//       <ul>
//         {exams.map((exam) => (
//           <li key={exam.id}>
//             <strong>{exam.title}</strong>: {exam.description}
//             <button onClick={() => handleAttemptExam(exam.id)}>Attempt Exam</button> {/* Will be implemented later */}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default StudentDashboard;
