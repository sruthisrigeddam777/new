import React, { useState } from "react";
import axios from "axios";
import { Container, Card, Button, Form, Alert, Row, Col } from "react-bootstrap";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaKey } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Step 1: Send OTP
  const handleSendOtp = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/auth/send-reset-otp/", { email });
      setMessage(response.data.message);
      setError("");
      setStep(2);
    } catch (error) {
      setMessage("");
      setError(error.response?.data?.error || "Error sending OTP.");
    }
  };

  // ✅ Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/auth/verify-reset-otp/", { email, otp });
      setMessage(response.data.message);
      setError("");
      setStep(3);
    } catch (error) {
      setMessage("");
      setError(error.response?.data?.error || "Invalid OTP.");
    }
  };

  // ✅ Step 3: Reset Password
  const handleResetPassword = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/auth/reset-password/", {
        email,
        new_password: newPassword,
      });
      setMessage(response.data.message);
      setError("");
      setStep(4);
    } catch (error) {
      setMessage("");
      setError(error.response?.data?.error || "Error resetting password.");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="p-4 shadow-lg text-center" style={{ maxWidth: "450px", width: "100%", borderRadius: "10px" }}>
        <h2 className="text-primary fw-bold mb-3">Reset Password</h2>

        {message && <Alert variant="success" className="text-center">{message}</Alert>}
        {error && <Alert variant="danger" className="text-center">{error}</Alert>}

        <Form>
          {step === 1 && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>
                  <MdEmail className="me-2" /> Email
                </Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="p-2"
                />
              </Form.Group>
              <Button className="w-100 fw-bold" variant="primary" onClick={handleSendOtp}>
                Send OTP
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>
                  <FaKey className="me-2" /> Enter OTP
                </Form.Label>
                <Form.Control
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  required
                  className="p-2"
                />
              </Form.Group>
              <Button className="w-100 fw-bold" variant="success" onClick={handleVerifyOtp}>
                Verify OTP
              </Button>
            </>
          )}

          {step === 3 && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>
                  <RiLockPasswordFill className="me-2" /> New Password
                </Form.Label>
                <Form.Control
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  className="p-2"
                />
              </Form.Group>
              <Button className="w-100 fw-bold" variant="success" onClick={handleResetPassword}>
                Reset Password
              </Button>
            </>
          )}

          {step === 4 && (
            <>
              <h3 className="text-success">✅ Password Reset Successful!</h3>
              <Button className="mt-3 w-100 fw-bold" variant="primary" onClick={() => navigate("/login")}>
                Go to Login
              </Button>
            </>
          )}
        </Form>

        <Row className="mt-3 text-center">
          <Col>
            <a href="/login" className="text-decoration-none text-danger fw-bold">Back to Login</a>
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default ForgotPassword;

// import React, { useState } from "react";
// import axios from "axios";
// import { Container, Card, Button, Form, Alert } from "react-bootstrap";

// const ForgotPassword = () => {
//   const [step, setStep] = useState(1);
//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   // ✅ Step 1: Send OTP
//   const handleSendOtp = async () => {
//     try {
//       const response = await axios.post("http://127.0.0.1:8000/auth/send-reset-otp/", { email });
//       setMessage(response.data.message);
//       setStep(2);
//     } catch (error) {
//       setError(error.response?.data?.error || "Error sending OTP.");
//     }
//   };

//   // ✅ Step 2: Verify OTP
//   const handleVerifyOtp = async () => {
//     try {
//       const response = await axios.post("http://127.0.0.1:8000/auth/verify-reset-otp/", { email, otp });
//       setMessage(response.data.message);
//       setStep(3);
//     } catch (error) {
//       setError(error.response?.data?.error || "Invalid OTP.");
//     }
//   };

//   // ✅ Step 3: Reset Password
//   const handleResetPassword = async () => {
//     try {
//       const response = await axios.post("http://127.0.0.1:8000/auth/reset-password/", { email, new_password: newPassword });
//       setMessage(response.data.message);
//       setStep(4);
//     } catch (error) {
//       setError(error.response?.data?.error || "Error resetting password.");
//     }
//   };

//   return (
//     <Container className="d-flex justify-content-center align-items-center vh-100">
//       <Card className="p-4 shadow-lg text-center" style={{ maxWidth: "400px" }}>
//         <h2>Reset Password</h2>
//         {message && <Alert variant="success">{message}</Alert>}
//         {error && <Alert variant="danger">{error}</Alert>}

//         {step === 1 && (
//           <>
//             <Form.Group>
//               <Form.Label>Email</Form.Label>
//               <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required />
//             </Form.Group>
//             <Button className="mt-3" variant="primary" onClick={handleSendOtp}>
//               Send OTP
//             </Button>
//           </>
//         )}

//         {step === 2 && (
//           <>
//             <Form.Group>
//               <Form.Label>Enter OTP</Form.Label>
//               <Form.Control type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" required />
//             </Form.Group>
//             <Button className="mt-3" variant="success" onClick={handleVerifyOtp}>
//               Verify OTP
//             </Button>
//           </>
//         )}

//         {step === 3 && (
//           <>
//             <Form.Group>
//               <Form.Label>New Password</Form.Label>
//               <Form.Control type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password" required />
//             </Form.Group>
//             <Button className="mt-3" variant="success" onClick={handleResetPassword}>
//               Reset Password
//             </Button>
//           </>
//         )}

//         {step === 4 && (
//           <>
//             <h3 className="text-success">✅ Password Reset Successful!</h3>
//             <Button className="mt-3" variant="primary" href="/login">
//               Go to Login
//             </Button>
//           </>
//         )}
//       </Card>
//     </Container>
//   );
// };

// export default ForgotPassword;