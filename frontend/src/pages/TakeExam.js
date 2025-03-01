import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";

const TakeExam = () => {
  const { examId } = useParams();
  console.log("Received examId: ",examId);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const fetchExamDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/auth/exam/${examId}/`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        });
        console.log("Raw API Response: ",response);
        console.log("Exam Data: ",response.data);

        setExam(response.data);
      } catch (error) {
        if (error.response) {
          console.error("API Error:", error.response.status, error.response.data);
          console.log("Full Error:", error);
        } else {
          console.error("Request Failed:", error.message);
        }
        toast.error("Failed to load exam details",error);
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
      navigate("/student-dashboard");
    } catch (error) {
      toast.error("Failed to submit exam");
    }
  };

  if (!exam) return <h2>Loading exam...</h2>;

  return (
    <div>
      <h2>{exam.title}</h2>
      <p>{exam.description}</p>
      <form onSubmit={handleSubmit}>
        {exam.questions.map((question) => (
          <div key={question.id}>
            <p>{question.text}</p>
            {question.question_type === "MCQ" ? (
              <select onChange={(e) => handleChange(question.id, e.target.value)}>
                {question.options.map((option, index) => (
                  <option key={index} value={option}>{option}</option>
                ))}
              </select>
            ) : (
              <textarea onChange={(e) => handleChange(question.id, e.target.value)} />
            )}
          </div>
        ))}
        <button type="submit">Submit Exam</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default TakeExam;
