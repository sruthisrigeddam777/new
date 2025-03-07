import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import { Container, Card, Form, Button, Spinner } from "react-bootstrap";

const TakeExam = () => {
  const { examId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExamDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/auth/exam/${examId}/`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        });
        setExam(response.data);
      } catch (error) {
        toast.error("Failed to load exam details");
      } finally {
        setLoading(false);
      }
    };
    fetchExamDetails();
  }, [examId]);

  const handleChange = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://127.0.0.1:8000/auth/exam/submit/",
        { answers: Object.entries(answers).map(([qId, ans]) => ({ exam_id: exam.id, question_id: qId, answer: ans })) },
        { headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` } }
      );
      toast.success("Exam submitted successfully!");
      navigate("/exam-submitted");
    } catch (error) {
      toast.error("Failed to submit exam");
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p>Loading exam...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Card className="p-4 shadow-lg">
        <h2 className="text-center">{exam?.title}</h2>
        <p className="text-muted text-center">{exam?.description}</p>

        <Form onSubmit={handleSubmit}>
          {exam.questions.map((question, qIndex) => (
            <Card key={question.id} className="p-3 mb-3 shadow-sm">
              <Form.Group>
                <Form.Label>
                  <strong>Q{qIndex + 1}: {question.text}</strong>
                </Form.Label>
                {question.question_type === "MCQ" ? (
                  question.options.map((option, index) => (
                    <Form.Check
                      type="radio"
                      key={index}
                      label={option}
                      name={`question-${question.id}`}
                      value={option}
                      onChange={(e) => handleChange(question.id, e.target.value)}
                    />
                  ))
                ) : (
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter your answer here..."
                    onChange={(e) => handleChange(question.id, e.target.value)}
                    required
                  />
                )}
              </Form.Group>
            </Card>
          ))}

          <div className="text-center">
            <Button variant="success" type="submit">
              Submit Exam
            </Button>
          </div>
        </Form>
      </Card>

      <ToastContainer />
    </Container>
  );
};

export default TakeExam;

// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";
// import { ToastContainer, toast } from "react-toastify";
// import { Container, Card, Form, Button, Spinner } from "react-bootstrap";

// const TakeExam = () => {
//   const { examId } = useParams();
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [exam, setExam] = useState(null);
//   const [answers, setAnswers] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchExamDetails = async () => {
//       try {
//         const response = await axios.get(`http://127.0.0.1:8000/auth/exam/${examId}/`, {
//           headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
//         });
//         if(!response.ok){
//           throw new Error("Failed to fetch exam details");
//         }
//         const data = await response.json();
//         setExam(data);
//       } catch (error) {
//         toast.error("Failed to load exam details");
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchExamDetails();
//   }, [examId]);

//   const handleChange = (questionId, value) => {
//     setAnswers({ ...answers, [questionId]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(
//         "http://127.0.0.1:8000/auth/exam/submit/",
//         { answers: Object.entries(answers).map(([qId, ans]) => ({ exam_id: exam.id, question_id: qId, answer: ans })) },
//         { headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` } }
//       );
//       toast.success("Exam submitted successfully!");
//       navigate("/exam-submitted");
//     } catch (error) {
//       toast.error("Failed to submit exam");
//     }
//   };

//   if (loading) {
//     return (
//       <Container className="text-center mt-5">
//         <Spinner animation="border" />
//         <p>Loading exam...</p>
//       </Container>
//     );
//   }
//   if(error) return <p>Error: {error}</p>;
//   if(!exam) return <p>No exam data available.</p>;

//   return (
//     <Container className="mt-5">
//       <Card className="p-4 shadow-lg">
//         <h2 className="text-center">{exam?.title}</h2>
//         <p className="text-muted text-center">{exam?.description}</p>

//         <Form onSubmit={handleSubmit}>
//           {exam.questions.map((question, qIndex) => (
//             <Card key={question.id} className="p-3 mb-3 shadow-sm">
//               <Form.Group>
//                 <Form.Label>
//                   <strong>Q{qIndex + 1}: {question.text}</strong>
//                 </Form.Label>
//                 {question.question_type === "MCQ" ? (
//                   question.options.map((option, index) => (
//                     <Form.Check
//                       type="radio"
//                       key={index}
//                       label={option}
//                       name={`question-${question.id}`}
//                       value={option}
//                       onChange={(e) => handleChange(question.id, e.target.value)}
//                     />
//                   ))
//                 ) : (
//                   <Form.Control
//                     as="textarea"
//                     rows={3}
//                     placeholder="Enter your answer here..."
//                     onChange={(e) => handleChange(question.id, e.target.value)}
//                     required
//                   />
//                 )}
//               </Form.Group>
//             </Card>
//           ))}

//           <div className="text-center">
//             <Button variant="success" type="submit">
//               Submit Exam
//             </Button>
//           </div>
//         </Form>
//       </Card>

//       <ToastContainer />
//     </Container>
//   );
// };

// export default TakeExam;
