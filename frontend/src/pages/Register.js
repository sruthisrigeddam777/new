import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FaUser, FaUserTag } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { Container, Card, Button, Form, Alert } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Register = () => {
  const [step, setStep] = useState(1); // Step 1: Send OTP, Step 2: Verify OTP, Step 3: Register
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "student",
    otp: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/auth/send-otp/", { email: formData.email });
      toast.success(response.data.message);
      setStep(2); // Move to Step 2 (Verify OTP)
    } catch (error) {
      setError(error.response?.data?.error || "Error sending OTP.");
    }
  };

  // ✅ Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/auth/verify-otp/", { email: formData.email, otp: formData.otp });
      toast.success(response.data.message);
      setStep(3); // Move to Step 3 (Register)
    } catch (error) {
      setError(error.response?.data?.error || "Invalid OTP.");
    }
  };

  // ✅ Step 3: Register User
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/auth/register/", formData);
      toast.success(response.data.message);
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.error || "Registration failed");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="p-4 shadow-lg text-center" style={{ maxWidth: "420px", width: "100%" }}>
        <h2 className="text-primary fw-bold">Register</h2>
        {error && <Alert variant="danger">{error}</Alert>}

        {step === 1 && (
          <Form onSubmit={handleSendOtp}>
            <Form.Group className="mb-3 input-group">
              <span className="input-group-text"><MdEmail /></span>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </Form.Group>
            <Button type="submit" className="w-100 fw-bold" variant="primary">
              Send OTP
            </Button>
          </Form>
        )}

        {step === 2 && (
          <Form onSubmit={handleVerifyOtp}>
            <Form.Group className="mb-3 input-group">
              <span className="input-group-text">🔢</span>
              <Form.Control
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                placeholder="Enter OTP"
                required
              />
            </Form.Group>
            <Button type="submit" className="w-100 fw-bold" variant="success">
              Verify OTP
            </Button>
          </Form>
        )}

        {step === 3 && (
          <Form onSubmit={handleRegister}>
            <Form.Group className="mb-3 input-group">
              <span className="input-group-text"><FaUser /></span>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3 input-group">
              <span className="input-group-text"><RiLockPasswordFill /></span>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3 input-group">
              <span className="input-group-text"><FaUserTag /></span>
              <Form.Select name="role" value={formData.role} onChange={handleChange}>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>

            <Button type="submit" className="w-100 fw-bold" variant="success">
              Register
            </Button>
          </Form>
        )}

        {/* ✅ Already Registered? Login Link */}
        <p className="mt-3 text-muted">
          Already have an account?{" "}
          <a href="/login" className="text-decoration-none text-primary fw-bold">
            Login here
          </a>
        </p>
      </Card>
      <ToastContainer />
    </Container>
  );
};

export default Register;


// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import { FaUser, FaUserTag } from "react-icons/fa";
// import { MdEmail } from "react-icons/md";
// import { RiLockPasswordFill } from "react-icons/ri";
// import "react-toastify/dist/ReactToastify.css";
// import "bootstrap/dist/css/bootstrap.min.css";

// const Register = () => {
//   const [step, setStep] = useState(1); // Step 1: Send OTP, Step 2: Verify OTP, Step 3: Register
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//     role: "student",
//     otp: "",
//   });
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // ✅ Step 1: Send OTP
//   const handleSendOtp = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post("http://127.0.0.1:8000/auth/send-otp/", { email: formData.email });
//       toast.success(response.data.message);
//       setStep(2); // Move to Step 2 (Verify OTP)
//     } catch (error) {
//       toast.error(error.response?.data?.error || "Error sending OTP.");
//     }
//   };

//   // ✅ Step 2: Verify OTP
//   const handleVerifyOtp = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post("http://127.0.0.1:8000/auth/verify-otp/", { email: formData.email, otp: formData.otp });
//       toast.success(response.data.message);
//       setStep(3); // Move to Step 3 (Register)
//     } catch (error) {
//       toast.error(error.response?.data?.error || "Invalid OTP.");
//     }
//   };

//   // ✅ Step 3: Register User
//   const handleRegister = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post("http://127.0.0.1:8000/auth/register/", formData);
//       toast.success(response.data.message);
//       navigate("/login");
//     } catch (error) {
//       toast.error(error.response?.data?.error || "Registration failed");
//     }
//   };

//   return (
//     <div className="container d-flex justify-content-center align-items-center vh-100">
//       <div className="card shadow p-4" style={{ maxWidth: "400px", width: "100%" }}>
//         <h2 className="text-center mb-4">Register</h2>

//         {step === 1 && (
//           <form onSubmit={handleSendOtp}>
//             <div className="mb-3 input-group">
//               <span className="input-group-text"><MdEmail /></span>
//               <input
//                 type="email"
//                 name="email"
//                 className="form-control"
//                 placeholder="Enter your email"
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <button type="submit" className="btn btn-primary w-100">Send OTP</button>
//           </form>
//         )}

//         {step === 2 && (
//           <form onSubmit={handleVerifyOtp}>
//             <div className="mb-3 input-group">
//               <span className="input-group-text">🔢</span>
//               <input
//                 type="text"
//                 name="otp"
//                 className="form-control"
//                 placeholder="Enter OTP"
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <button type="submit" className="btn btn-success w-100">Verify OTP</button>
//           </form>
//         )}

//         {step === 3 && (
//           <form onSubmit={handleRegister}>
//             <div className="mb-3 input-group">
//               <span className="input-group-text"><FaUser /></span>
//               <input type="text" name="username" className="form-control" placeholder="Username" onChange={handleChange} required />
//             </div>

//             <div className="mb-3 input-group">
//               <span className="input-group-text"><RiLockPasswordFill /></span>
//               <input type="password" name="password" className="form-control" placeholder="Password" onChange={handleChange} required />
//             </div>

//             <div className="mb-3 input-group">
//               <span className="input-group-text"><FaUserTag /></span>
//               <select name="role" className="form-select" onChange={handleChange}>
//                 <option value="student">Student</option>
//                 <option value="teacher">Teacher</option>
//                 <option value="admin">Admin</option>
//               </select>
//             </div>

//             <button type="submit" className="btn btn-success w-100">Register</button>
//           </form>
//         )}
//       </div>
//       <ToastContainer />
//     </div>
//   );
// };

// export default Register;