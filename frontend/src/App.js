import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Welcome from "./pages/Welcome";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import TakeExam from "./pages/TakeExam";
import ExamSubmitted from "./pages/ExamSubmitted";
import ViewScore from "./pages/ViewScore";
import ForgotPassword from "./pages/ForgotPassword";
import FaceTest from "./pages/FaceTest";
import Disqualified from "./pages/Disqualified";
import { AuthProvider, useAuth } from "./context/AuthContext";

const ProtectedRoute = ({ element, role }) => {
  const { user } = useAuth();
  return user && user.role === role ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <AuthProvider> {/* ✅ Now inside Router */}
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />

          {/* Role-based dashboards */}
          <Route path="/student-dashboard" element={<ProtectedRoute element={<StudentDashboard />} role="student" />} />
          <Route path="/exam/:examId" element={<ProtectedRoute element={<TakeExam />} role="student" />} />
          <Route path="/exam/:examId/score" element={<ViewScore />} />
          <Route path="/teacher-dashboard" element={<ProtectedRoute element={<TeacherDashboard />} role="teacher" />} />
          <Route path="/admin-dashboard" element={<ProtectedRoute element={<AdminDashboard />} role="admin" />} />
          <Route path="/exam-submitted" element={<ExamSubmitted />} />
          <Route path="/face-test" element={<FaceTest />} />
          <Route path="/disqualified" element={<Disqualified />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;