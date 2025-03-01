import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
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
      toast.error(error.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input type="text" name="username" className="form-control" placeholder="Username" onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <input type="password" name="password" className="form-control" placeholder="Password" onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Login;


// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import { jwtDecode } from "jwt-decode";
// import "react-toastify/dist/ReactToastify.css";
// import { useAuth } from "../context/AuthContext";

// const Login = () => {
//   const [formData, setFormData] = useState({ username: "", password: "" });
//   const navigate = useNavigate();
//   const { setUser } = useAuth();  // ✅ Use setUser from AuthContext

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     localStorage.removeItem("access_token");
//     localStorage.removeItem("refresh_token");

//     try {
//       const response = await axios.post("http://127.0.0.1:8000/auth/token/", formData);
//       localStorage.setItem("access_token", response.data.access);
//       localStorage.setItem("refresh_token", response.data.refresh);

//       const decodedUser = jwtDecode(response.data.access);
//       setUser(decodedUser);  // ✅ Update user state

//       toast.success("Login successful!");

//       setTimeout(() => {
//         if (decodedUser.role === "student") {
//           navigate("/student-dashboard");
//         } else if (decodedUser.role === "teacher") {
//           navigate("/teacher-dashboard");
//         } else if (decodedUser.role === "admin") {
//           navigate("/admin-dashboard");
//         } else {
//           console.error("Unknown Role:", decodedUser.role);
//         }
//       }, 500);
//     } catch (error) {
//       console.error("Login Error:", error.response?.data || error.message);
//       toast.error(error.response?.data?.error || "Login failed");
//     }
//   };

//   return (
//     <div>
//       <center>
//         <h2>Login</h2>
//         <form onSubmit={handleSubmit}>
//           <input type="text" name="username" placeholder="Username" onChange={handleChange} required /><br /><br />
//           <input type="password" name="password" placeholder="Password" onChange={handleChange} required /><br /><br />
//           <button type="submit">Login</button>
//         </form>
//         <ToastContainer />
//       </center>
//     </div>
//   );
// };

// export default Login;
