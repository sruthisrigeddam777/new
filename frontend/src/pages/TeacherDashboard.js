import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchExams, createExam } from "../services/examService";
import { ToastContainer, toast } from "react-toastify";

const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  const [exams, setExams] = useState([]);
  const [newExam, setNewExam] = useState({ title: "", description: "" });

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

  const handleCreateExam = async (e) => {
    e.preventDefault();
    try {
      await createExam(newExam);
      toast.success("Exam created successfully!");
      setNewExam({ title: "", description: "" });
      setExams(await fetchExams()); // Reload exams
    } catch (error) {
      toast.error("Error creating exam");
    }
  };

  return (
    <div>
      <h2>Teacher Dashboard</h2>
      <p>Welcome, {user?.username}!</p>
      <button onClick={logout}>Logout</button>

      <h3>Create Exam</h3>
      <form onSubmit={handleCreateExam}>
        <input type="text" placeholder="Exam Title" value={newExam.title} onChange={(e) => setNewExam({ ...newExam, title: e.target.value })} required />
        <textarea placeholder="Exam Description" value={newExam.description} onChange={(e) => setNewExam({ ...newExam, description: e.target.value })} required />
        <button type="submit">Create Exam</button>
      </form>

      <h3>All Exams</h3>
      <ul>
        {exams.map((exam) => (
          <li key={exam.id}>
            <strong>{exam.title}</strong>: {exam.description}
          </li>
        ))}
      </ul>

      <ToastContainer />
    </div>
  );
};

export default TeacherDashboard;
