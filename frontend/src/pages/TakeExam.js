// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";
// import { ToastContainer, toast } from "react-toastify";
// import { Container, Card, Form, Button, Spinner } from "react-bootstrap";
// import Proctoring from "../components/Proctoring";

// const TakeExam = () => {
//   const { examId } = useParams();
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [exam, setExam] = useState(null);
//   const [answers, setAnswers] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [tabSwitchCount, setTabSwitchCount] = useState(0);
//   const [examEnded, setExamEnded] = useState(false);
//   const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:8000";

//   useEffect(() => {
//     const fetchExamDetails = async () => {
//       try {
//         const response = await axios.get(`${backendUrl}/auth/exam/${examId}/`, {
//           headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
//         });
//         setExam(response.data);
//       } catch (error) {
//         toast.error("Failed to load exam details");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchExamDetails();
//   }, [examId, backendUrl]);

//   useEffect(() => {
//     const enterFullscreen = () => {
//       if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
//         document.documentElement.requestFullscreen().catch((err) => {
//           console.warn("Fullscreen request failed", err);
//         });
//       }
//     };

//     enterFullscreen();

//     const handleVisibilityChange = () => {
//       if (document.hidden) {
//         setTabSwitchCount((prev) => prev + 1);
//         toast.warning("Warning! Do not switch tabs or minimize the exam window.");
//       }
//     };

//     document.addEventListener("visibilitychange", handleVisibilityChange);
//     document.addEventListener("fullscreenchange", enterFullscreen);

//     return () => {
//       document.removeEventListener("visibilitychange", handleVisibilityChange);
//       document.removeEventListener("fullscreenchange", enterFullscreen);
//     };
//   }, []);

//   useEffect(() => {
//     if (tabSwitchCount >= 3) {
//       toast.error("You have switched tabs too many times. Your exam is being submitted automatically.");
//       handleSubmit();
//     }
//   }, [tabSwitchCount]);

//   const handleSubmit = async (e) => {
//     if (e) e.preventDefault();
//     try {
//       await axios.post(
//         `${backendUrl}/auth/exam/submit/`,
//         {
//           answers: Object.entries(answers).map(([qId, ans]) => ({
//             exam_id: exam.id,
//             question_id: qId,
//             answer: ans,
//           })),
//         },
//         { headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` } }
//       );
//       toast.success("Exam submitted successfully!");
//       setExamEnded(true); // Stop proctoring
//       document.exitFullscreen(); // Exit fullscreen mode on submit
//       navigate("/exam-submitted");
//     } catch (error) {
//       toast.error("Failed to submit exam");
//     }
//   };

//   const handleChange = (questionId, value) => {
//     setAnswers((prevAnswers) => ({
//       ...prevAnswers,
//       [questionId]: value,
//     }));
//   };

//   if (loading) {
//     return (
//       <Container className="text-center mt-5">
//         <Spinner animation="border" />
//         <p>Loading exam...</p>
//       </Container>
//     );
//   }

//   return (
//     <Container className="mt-5">
//       <Card className="p-4 shadow-lg">
//         <h2 className="text-center">{exam?.title}</h2>
//         <p className="text-muted text-center">{exam?.description}</p>

//         {!examEnded && <Proctoring user={user} examEnded={examEnded} />} 

//         <Form onSubmit={handleSubmit}>
//           {exam?.questions?.map((question, qIndex) => (
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

//working correctly
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";
// import { ToastContainer, toast } from "react-toastify";
// import { Container, Card, Form, Button, Spinner } from "react-bootstrap";
// import Proctoring from "../components/Proctoring";

// const TakeExam = () => {
//   const { examId } = useParams();
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [exam, setExam] = useState(null);
//   const [answers, setAnswers] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [tabSwitchCount, setTabSwitchCount] = useState(0);
//   const [proctoringActive, setProctoringActive] = useState(true);

//   const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:8000";

//   useEffect(() => {
//     const fetchExamDetails = async () => {
//       try {
//         const response = await axios.get(`${backendUrl}/auth/exam/${examId}/`, {
//           headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
//         });
//         setExam(response.data);
//       } catch (error) {
//         toast.error("Failed to load exam details");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchExamDetails();
//   }, [examId, backendUrl]);

//   useEffect(() => {
//     const enterFullscreen = () => {
//       if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
//         document.documentElement.requestFullscreen().catch((err) => {
//           console.warn("Fullscreen request failed", err);
//         });
//       }
//     };

//     enterFullscreen();

//     const handleVisibilityChange = () => {
//       if (document.hidden) {
//         setTabSwitchCount((prev) => prev + 1);
//         toast.warning("Warning! Do not switch tabs or minimize the exam window.");
//       }
//     };

//     document.addEventListener("visibilitychange", handleVisibilityChange);
//     document.addEventListener("fullscreenchange", enterFullscreen);

//     return () => {
//       document.removeEventListener("visibilitychange", handleVisibilityChange);
//       document.removeEventListener("fullscreenchange", enterFullscreen);
//     };
//   }, []);

//   useEffect(() => {
//     if (tabSwitchCount >= 3) {
//       toast.error("You have switched tabs too many times. Your exam is being submitted automatically.");
//       handleSubmit();
//     }
//   }, [tabSwitchCount]);

//   const handleSubmit = async (e) => {
//     if (e) e.preventDefault();
//     try {
//       await axios.post(
//         `${backendUrl}/auth/exam/submit/`,
//         {
//           answers: Object.entries(answers).map(([qId, ans]) => ({
//             exam_id: exam.id,
//             question_id: qId,
//             answer: ans,
//           })),
//         },
//         { headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` } }
//       );
//       toast.success("Exam submitted successfully!");
//       setProctoringActive(false); // Stop proctoring after submission
//       document.exitFullscreen(); // Exit fullscreen mode on submit
//       navigate("/exam-submitted");
//     } catch (error) {
//       toast.error("Failed to submit exam");
//     }
//   };

//   const handleChange = (questionId, value) => {
//     setAnswers((prevAnswers) => ({
//       ...prevAnswers,
//       [questionId]: value,
//     }));
//   };

//   if (loading) {
//     return (
//       <Container className="text-center mt-5">
//         <Spinner animation="border" />
//         <p>Loading exam...</p>
//       </Container>
//     );
//   }

//   return (
//     <Container className="mt-5">
//       <Card className="p-4 shadow-lg">
//         <h2 className="text-center">{exam?.title}</h2>
//         <p className="text-muted text-center">{exam?.description}</p>

//         {proctoringActive && <Proctoring user={user} stopProctoring={!proctoringActive} />} 

//         <Form onSubmit={handleSubmit}>
//           {exam?.questions?.map((question, qIndex) => (
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


// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";
// import { ToastContainer, toast } from "react-toastify";
// import { Container, Card, Form, Button, Spinner } from "react-bootstrap";
// import Proctoring from "../components/Proctoring";

// const TakeExam = () => {
//   const { examId } = useParams();
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [exam, setExam] = useState(null);
//   const [answers, setAnswers] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [tabSwitchCount, setTabSwitchCount] = useState(0);

//   const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:8000";

//   useEffect(() => {
//     const fetchExamDetails = async () => {
//       try {
//         const response = await axios.get(`${backendUrl}/auth/exam/${examId}/`, {
//           headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
//         });
//         setExam(response.data);
//       } catch (error) {
//         toast.error("Failed to load exam details");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchExamDetails();
//   }, [examId, backendUrl]);

//   useEffect(() => {
//     const enterFullscreen = () => {
//       if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
//         document.documentElement.requestFullscreen().catch((err) => {
//           console.warn("Fullscreen request failed", err);
//         });
//       }
//     };

//     const handleExitFullscreen = (event) => {
//       if (event.key === "Escape") {
//         navigate("/student-dashboard");
//       }
//     };

//     enterFullscreen();
//     document.addEventListener("keydown", handleExitFullscreen);

//     const handleVisibilityChange = () => {
//       if (document.hidden) {
//         setTabSwitchCount((prev) => prev + 1);
//         toast.warning("Warning! Do not switch tabs or minimize the exam window.");
//       }
//     };

//     document.addEventListener("visibilitychange", handleVisibilityChange);
//     document.addEventListener("fullscreenchange", enterFullscreen);

//     return () => {
//       document.removeEventListener("visibilitychange", handleVisibilityChange);
//       document.removeEventListener("fullscreenchange", enterFullscreen);
//       document.removeEventListener("keydown", handleExitFullscreen);
//     };
//   }, [navigate]);

//   useEffect(() => {
//     const handleFullscreenChange = () => {
//       if (!document.fullscreenElement) {
//         navigate("/student-dashboard");
//       }
//     };
//     document.addEventListener("fullscreenchange", handleFullscreenChange);
//     return () => {
//       document.removeEventListener("fullscreenchange", handleFullscreenChange);
//     };
//   }, [navigate]);

//   const handleSubmit = async (e) => {
//     if (e) e.preventDefault();
//     try {
//       await axios.post(
//         `${backendUrl}/auth/exam/submit/`,
//         {
//           answers: Object.entries(answers).map(([qId, ans]) => ({
//             exam_id: exam.id,
//             question_id: qId,
//             answer: ans,
//           })),
//         },
//         { headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` } }
//       );
//       toast.success("Exam submitted successfully!");
//       document.exitFullscreen(); // Exit fullscreen mode on submit
//       navigate("/exam-submitted");
//     } catch (error) {
//       toast.error("Failed to submit exam");
//     }
//   };

//   useEffect(() => {
//     if (tabSwitchCount >= 3) {
//       toast.error("You have switched tabs too many times. Your exam is being submitted automatically.");
//       handleSubmit();
//     }
//   }, [tabSwitchCount]);

//   const handleChange = (questionId, value) => {
//     setAnswers((prevAnswers) => ({
//       ...prevAnswers,
//       [questionId]: value,
//     }));
//   };

//   if (loading) {
//     return (
//       <Container className="text-center mt-5">
//         <Spinner animation="border" />
//         <p>Loading exam...</p>
//       </Container>
//     );
//   }

//   return (
//     <Container className="mt-5">
//       <Card className="p-4 shadow-lg">
//         <h2 className="text-center">{exam?.title}</h2>
//         <p className="text-muted text-center">{exam?.description}</p>

//         <Proctoring user={user} />

//         <Form onSubmit={handleSubmit}>
//           {exam?.questions?.map((question, qIndex) => (
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
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";
// import { ToastContainer, toast } from "react-toastify";
// import { Container, Card, Form, Button, Spinner } from "react-bootstrap";
// import Proctoring from "../components/Proctoring";

// const TakeExam = () => {
//   const { examId } = useParams();
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [exam, setExam] = useState(null);
//   const [answers, setAnswers] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [tabSwitchCount, setTabSwitchCount] = useState(0);
//   const [proctoringActive, setProctoringActive] = useState(true);

//   const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:8000";

//   useEffect(() => {
//     const fetchExamDetails = async () => {
//       try {
//         const response = await axios.get(`${backendUrl}/auth/exam/${examId}/`, {
//           headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
//         });
//         setExam(response.data);
//       } catch (error) {
//         toast.error("Failed to load exam details");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchExamDetails();
//   }, [examId, backendUrl]);

//   useEffect(() => {
//     const enterFullscreen = () => {
//       if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
//         document.documentElement.requestFullscreen().catch((err) => {
//           console.warn("Fullscreen request failed", err);
//         });
//       }
//     };

//     enterFullscreen();

//     const handleVisibilityChange = () => {
//       if (document.hidden) {
//         setTabSwitchCount((prev) => prev + 1);
//         toast.warning("Warning! Do not switch tabs or minimize the exam window.");
//       }
//     };

//     document.addEventListener("visibilitychange", handleVisibilityChange);
//     document.addEventListener("fullscreenchange", enterFullscreen);

//     return () => {
//       document.removeEventListener("visibilitychange", handleVisibilityChange);
//       document.removeEventListener("fullscreenchange", enterFullscreen);
//     };
//   }, []);

//   useEffect(() => {
//     if (tabSwitchCount >= 3) {
//       toast.error("You have switched tabs too many times. Your exam is being submitted automatically.");
//       handleSubmit();
//     }
//   }, [tabSwitchCount]);

//   const handleSubmit = async (e) => {
//     if (e) e.preventDefault();
//     try {
//       await axios.post(
//         `${backendUrl}/auth/exam/submit/`,
//         {
//           answers: Object.entries(answers).map(([qId, ans]) => ({
//             exam_id: exam.id,
//             question_id: qId,
//             answer: ans,
//           })),
//         },
//         { headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` } }
//       );
//       toast.success("Exam submitted successfully!");
//       setProctoringActive(false); // Stop proctoring after submission
//       document.exitFullscreen(); // Exit fullscreen mode on submit
//       navigate("/exam-submitted");
//     } catch (error) {
//       toast.error("Failed to submit exam");
//     }
//   };

//   const handleChange = (questionId, value) => {
//     setAnswers((prevAnswers) => ({
//       ...prevAnswers,
//       [questionId]: value,
//     }));
//   };

//   if (loading) {
//     return (
//       <Container className="text-center mt-5">
//         <Spinner animation="border" />
//         <p>Loading exam...</p>
//       </Container>
//     );
//   }

//   return (
//     <Container className="mt-5">
//       <Card className="p-4 shadow-lg">
//         <h2 className="text-center">{exam?.title}</h2>
//         <p className="text-muted text-center">{exam?.description}</p>

//         {proctoringActive && <Proctoring user={user} />} 

//         <Form onSubmit={handleSubmit}>
//           {exam?.questions?.map((question, qIndex) => (
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



import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import { Container, Card, Form, Button, Spinner } from "react-bootstrap";
import Proctoring from "../components/Proctoring";

const TakeExam = () => {
  const { examId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [examEnded, setExamEnded] = useState(false);
  const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:8000";

  useEffect(() => {
    const fetchExamDetails = async () => {
      try {
        const response = await axios.get(`${backendUrl}/auth/exam/${examId}/`, {
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
  }, [examId, backendUrl]);

  useEffect(() => {
    const enterFullscreen = () => {
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch((err) => {
          console.warn("Fullscreen request failed", err);
        });
      }
    };

    enterFullscreen();

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount((prev) => prev + 1);
        toast.warning("Warning! Do not switch tabs or minimize the exam window.");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", enterFullscreen);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", enterFullscreen);
    };
  }, []);

  useEffect(() => {
    if (tabSwitchCount >= 3) {
      toast.error("You have switched tabs too many times. Your exam is being submitted automatically.");
      handleSubmit();
    }
  }, [tabSwitchCount]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    try {
      await axios.post(
        `${backendUrl}/auth/exam/submit/`,
        {
          answers: Object.entries(answers).map(([qId, ans]) => ({
            exam_id: exam.id,
            question_id: qId,
            answer: ans,
          })),
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` } }
      );
      toast.success("Exam submitted successfully!");
      setExamEnded(true); // Stop proctoring
      document.exitFullscreen(); // Exit fullscreen mode on submit
      navigate("/exam-submitted");
    } catch (error) {
      toast.error("Failed to submit exam");
    }
  };

  const handleChange = (questionId, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: value,
    }));
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

        {!examEnded && <Proctoring user={user} onExamEnd={setExamEnded} />} 

        <Form onSubmit={handleSubmit}>
          {exam?.questions?.map((question, qIndex) => (
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
