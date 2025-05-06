import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Container, Card, Form, Button, Spinner } from "react-bootstrap";
import Webcam from "react-webcam";
import ProctoringWebcam from "../components/ProctoringWebcam";

const TakeExam = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  const webcamRef = React.useRef(null);
  const [proctoringWarning, setProctoringWarning] = useState(false);
  const [unauthorizedItems, setUnauthorizedItems] = useState([]);
  const [noFaceDetected, setNoFaceDetected] = useState(false);

  const startExam = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
    setExamStarted(true);
  };

  const captureAndSendImage = useCallback(async () => {
    if(!webcamRef.current || !webcamRef.current.getScreenshot){
      console.warn("Webcam or getScreenshot  not ready yet");
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();

    if(!imageSrc || !imageSrc.startsWith("data:image")){
      console.error("Invalid or empty imageSrc",imageSrc);
      return;
    }
    console.log("Captured image preview:", imageSrc?.slice(0, 100));

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/auth/proctoring/verify-face/",
        { image: imageSrc,
          exam_id: examId,
         },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );


      const status = res.data.status;

      if (status === "multiple_faces") {
        setProctoringWarning(true);
        toast.error("⚠️ Multiple faces detected!");
        setUnauthorizedItems([]);
        setNoFaceDetected(false);

      } else if (status === "unauthorized_object") {
        setUnauthorizedItems(res.data.items || []);
        toast.error(`⚠️ Unauthorized object(s) detected: ${res.data.items.join(", ")}`);
        setProctoringWarning(false);
        setNoFaceDetected(false);

      } else if (status === "no_person") {
        setNoFaceDetected(true);
        toast.warning("⚠️ No person detected in the camera.");
        setProctoringWarning(false);
        setUnauthorizedItems([]);

      } else {
        // Everything OK
        setProctoringWarning(false);
        setUnauthorizedItems([]);
        setNoFaceDetected(false);
      }
      if (status === "disqualified") {
        toast.error("You have been disqualified: " + res.data.reason);
        setTimeout(() => navigate("/disqualified"), 3000);
        return;
      }

    } catch (error) {
      console.error("Error during face verification", error);
    }
  }, [navigate]);

  useEffect(() => {
    if (!examStarted) return;

    let interval;
    const waitForReady = setInterval(() => {
      const video= webcamRef.current?.video;
    if (video && video.readyState === 4) {
      console.log("Webcam video is ready");
      clearInterval(waitForReady);
      interval = setInterval(captureAndSendImage, 5000);
    }
  }, 500);

  return () => {
    clearInterval(waitForReady);
    clearInterval(interval);
  };
  }, [captureAndSendImage, examStarted]);

  // ⏳ Fetch Exam Details & Set Timer
  useEffect(() => {
    const fetchExamDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/auth/exam/${examId}/`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        });

        if (!response.data.questions) {
          throw new Error("Invalid response: 'questions' field is missing");
        }

        console.log("Exam Data:", response.data);
        setExam(response.data);
        setTimeLeft(response.data.duration * 60); // Convert minutes to seconds
      } catch (error) {
        toast.error("Failed to load exam details");
      } finally {
        setLoading(false);
      }
    };

    fetchExamDetails();
  }, [examId]);

  // 📝 Collect User Answers
  const handleChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  // ✅ Submit Exam Answers (Auto or Manual)
  const handleAutoSubmit = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const formattedAnswers = Object.entries(answers).map(([qId, ans]) => ({
        exam_id: exam.id,
        question_id: qId,
        answer: ans,
      }));

      await axios.post("http://127.0.0.1:8000/auth/exam/submit/", { answers: formattedAnswers }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      });

      navigate("/exam-submitted"); // ✅ Redirect after submission
    } catch (error) {
      toast.error("Error submitting exam");
    }
  }, [exam, answers, isSubmitting, navigate]);

  // ⏳ Timer Logic (Auto-Submit when time expires)
  useEffect(() => {
    if (!examStarted || timeLeft === null) return;

    if (timeLeft === 60) {
      toast.warning("Only 1 minute left! Submit your answers soon.");
    }

    if (timeLeft === 0) {
      handleAutoSubmit(); // ⏳ Auto-submit when time expires
      toast.error("Time is over! Auto-submitting the exam.");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, handleAutoSubmit, examStarted]);

  useEffect(() => {
    if (!examStarted) return;

    const handleFullscreenExit = () => {
      if (!document.fullscreenElement) {
        toast.error("❌ You exited fullscreen. You are disqualified.");
        navigate("/disqualified");
      }
    };

    const handleTabSwitch = () => {
      toast.error("❌ You switched tabs or minimized. You are disqualified.");
      navigate("/disqualified");
    };

    document.addEventListener("fullscreenchange", handleFullscreenExit);
    window.addEventListener("blur", handleTabSwitch);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenExit);
      window.removeEventListener("blur", handleTabSwitch);
    };
  }, [navigate, examStarted]);

  // ⏲️ Format Time (MM:SS)
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };



  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-5" />;

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      {!examStarted ? (
        <div className="text-center">
          <h2>Click below to start your exam</h2>
          <Card className="mb-4 p-3 border border-warning">
            <h5 className="text-warning">⚠️ Proctoring Instructions</h5>
            <ul>
              <li>📸 Stay visible to the webcam at all times.</li>
              <li>👤 Only one person should be visible in the camera.</li>
              <li>🚫 No unauthorized objects like phones, books, or laptops.</li>
              <li>🖥️ Do not exit full-screen mode or switch tabs/windows.</li>
              <li>⚠️ Violating these rules 3 times will lead to <strong>automatic disqualification</strong>.</li>
            </ul>
            <p className="text-danger mb-0">
              By clicking "Start Exam", you agree to follow the proctoring rules.
            </p>
          </Card>

          <Button variant="success" onClick={startExam}>
            Start Exam
          </Button>
        </div>
      ) : (
        <>
      <ProctoringWebcam  webcamRef={webcamRef} />
    {proctoringWarning && (
      <div className="alert alert-danger">
        ⚠️ Multiple faces detected! Please stay alone during the exam.
      </div>
    )}
    {unauthorizedItems.length > 0 && (
      <div className="alert alert-warning">
        ⚠️ Unauthorized objects detected: {unauthorizedItems.join(", ")}
      </div>
    )}

    {noFaceDetected && (
      <div className="alert alert-warning">
        ⚠️ No face/person detected! Please ensure you're visible to the camera.
      </div>
    )}

      <ToastContainer />
      <Card className="p-4 shadow-lg" style={{ maxWidth: "600px" }}>
        {exam ? (
          <>
            <h2>{exam.title}</h2>
            <p>{exam.description}</p>
            <h3 className="text-danger">⏳ Time Left: {formatTime(timeLeft)}</h3>

            <Form>
              {exam.questions.map((question) => (
                <Form.Group key={question.id} className="mb-3">
                  <Form.Label>{question.text}</Form.Label>
                  {question.question_type === "MCQ" ? (
                    <Form.Control
                      as="select"
                      onChange={(e) => handleChange(question.id, e.target.value)}
                    >
                      <option value="">Select an answer</option>
                      {Array.isArray(question.options) ? (
                        question.options.map((option, index) => (
                          <option key={index} value={option.text}>{option.text}</option>
                        ))
                      ) : (
                        <option disabled>No options available</option>
                      )}
                    </Form.Control>
                  ) : (
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Type your answer here..."
                      value={answers[question.id] || ""}
                      onChange={(e) => handleChange(question.id, e.target.value)}
                    />
                  )}

                </Form.Group>
              ))}
            </Form>

            <Button variant="danger" onClick={handleAutoSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Exam"}
            </Button>
          </>
        ) : (
          <p>Loading exam...</p>
        )}
      </Card>
      </>
      )}
    </Container>
  );
};

export default TakeExam;