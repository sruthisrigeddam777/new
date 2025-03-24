import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/AuthContext";
import { Container, Card, Button, Form, Alert } from "react-bootstrap";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuth();  // ✅ Use setUser from AuthContext

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    try {
      const response = await axios.post("http://127.0.0.1:8000/auth/token/", formData);
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);

      console.log("New Access Token:", response.data.access);
      console.log("New Refresh Token:", response.data.refresh);

      const decodedUser = jwtDecode(response.data.access);
      setUser(decodedUser);  // ✅ Update user state

      toast.success("Login successful!");

      setTimeout(() => {
        if (decodedUser.role === "student") {
          navigate("/student-dashboard");
        } else if (decodedUser.role === "teacher") {
          navigate("/teacher-dashboard");
        } else if (decodedUser.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          console.error("Unknown Role:", decodedUser.role);
        }
      }, 500);
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      setError("Invalid username or password.");
      toast.error(error.response?.data?.error || "Login failed");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="p-4 shadow-lg text-center" style={{ maxWidth: "400px" }}>
        <h2>Login</h2>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </Form.Group>

          <Button type="submit" className="w-100" variant="primary">
            Login
          </Button>
        </Form>

        {/* ✅ Forgot Password Link */}
        <p className="mt-3">
          <a href="/forgot-password" className="text-decoration-none text-primary">Forgot Password?</a>
        </p>
      </Card>
      <ToastContainer />
    </Container>
  );
};

export default Login;
