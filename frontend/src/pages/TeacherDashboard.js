import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Container, Table, Form, Button, Card } from "react-bootstrap";

const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  const [exams, setExams] = useState([]);
  const [newExam, setNewExam] = useState({ title: "", description: "" });
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/auth/exams/", {
          headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        });
        // Filter unique exams by exam ID
        // const uniqueExams = [];
        // const seenExamIds = new Set();

        // response.data.forEach((exam) => {
        //   if (!seenExamIds.has(exam.id)) {
        //     uniqueExams.push(exam);
        //     seenExamIds.add(exam.id);
        //   }
        // });
        // setExams(response.data);
        // Create a unique list of exams based on `exam.id`
        const uniqueExams = response.data.reduce((acc, exam) => {
          if (!acc.some((e) => e.id === exam.id)) {
            acc.push(exam);
          }
          return acc;
        }, []);

        setExams(uniqueExams);
      } catch (error) {
        toast.error("Error loading exams");
      }
    };
    fetchExams();
  }, []);

  const addQuestion = () => {
    setQuestions([...questions, { text: "", question_type: "MCQ", options: [], correct_answer: "" }]);
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleCreateExam = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://127.0.0.1:8000/auth/exams/create/",
        { ...newExam, questions },
        { headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` } }
      );
      toast.success("Exam created successfully!");
      setNewExam({ title: "", description: "" });
      setQuestions([]);
      setExams(await (await axios.get("http://127.0.0.1:8000/auth/exams/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      })).data);
    } catch (error) {
      toast.error("Error creating exam");
    }
  };
  const gradeAnswer = async (answerId, marks) => {
    try {
      await axios.post(
        "http://127.0.0.1:8000/auth/exam/grade/",
        { answer_id: answerId, marks: marks },
        { headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` } }
      );
      toast.success("Answer graded successfully!");
    } catch (error) {
      toast.error("Error grading answer");
    }
  };

  return (
    <Container className="mt-5">
      <Card className="p-4 shadow-lg">
        <h2 className="text-center">Teacher Dashboard</h2>
        <p className="text-center text-muted">Welcome, <strong>{user?.username}</strong>!</p>

        <div className="d-flex justify-content-end">
          <Button variant="danger" onClick={logout}>Logout</Button>
        </div>

        {/* Create Exam Section */}
        <Card className="p-3 mt-4 shadow-sm">
          <h3>Create Exam</h3>
          <Form onSubmit={handleCreateExam}>
            <Form.Group className="mb-3">
              <Form.Label>Exam Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter exam title"
                value={newExam.title}
                onChange={(e) => setNewExam({ ...newExam, title: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Exam Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter exam description"
                value={newExam.description}
                onChange={(e) => setNewExam({ ...newExam, description: e.target.value })}
                required
              />
            </Form.Group>

            {/* Add Questions */}
            <h4>Questions</h4>
            {questions.map((q, index) => (
              <Card key={index} className="p-3 mb-3 shadow-sm">
                <Form.Group className="mb-2">
                  <Form.Label>Question {index + 1}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter question"
                    value={q.text}
                    onChange={(e) => handleQuestionChange(index, "text", e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Question Type</Form.Label>
                  <Form.Select
                    value={q.question_type}
                    onChange={(e) => handleQuestionChange(index, "question_type", e.target.value)}
                  >
                    <option value="MCQ">MCQ</option>
                    <option value="Subjective">Subjective</option>
                  </Form.Select>
                </Form.Group>

                {q.question_type === "MCQ" && (
                  <Form.Group className="mb-2">
                    <Form.Label>Options (comma-separated)</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter options"
                      onChange={(e) => handleQuestionChange(index, "options", e.target.value.split(","))}
                    />
                  </Form.Group>
                )}

                <Form.Group className="mb-2">
                  <Form.Label>Correct Answer</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter correct answer"
                    value={q.correct_answer}
                    onChange={(e) => handleQuestionChange(index, "correct_answer", e.target.value)}
                    required
                  />
                </Form.Group>
              </Card>
            ))}

            <Button variant="secondary" type="button" onClick={addQuestion} className="mt-2">
              Add Question
            </Button>
            <Button variant="primary" type="submit" className="mt-2 mx-2">
              Create Exam
            </Button>
          </Form>
        </Card>

        {/* List of Exams */}
        <h3 className="mt-4">All Exams</h3>
        {exams.length > 0 ? (
          <Table striped bordered hover responsive className="mt-3">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam, index) => (
                <tr key={index}>
                  <td>{exam.id}</td>
                  <td>{exam.title}</td>
                  <td>{exam.description}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p className="text-center text-muted">No exams found</p>
        )}
      </Card>

      <ToastContainer />
    </Container>
  );
};

export default TeacherDashboard;
