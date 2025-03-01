import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FaUser, FaUserTag } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "student",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
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
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3 input-group">
            <span className="input-group-text"><FaUser /></span>
            <input type="text" name="username" className="form-control" placeholder="Username" onChange={handleChange} required />
          </div>

          <div className="mb-3 input-group">
            <span className="input-group-text"><MdEmail /></span>
            <input type="email" name="email" className="form-control" placeholder="Email" onChange={handleChange} required />
          </div>

          <div className="mb-3 input-group">
            <span className="input-group-text"><RiLockPasswordFill /></span>
            <input type="password" name="password" className="form-control" placeholder="Password" onChange={handleChange} required />
          </div>

          <div className="mb-3 input-group">
            <span className="input-group-text"><FaUserTag /></span>
            <select name="role" className="form-select" onChange={handleChange}>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-100">Register</button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;

// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const Register = () => {
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//     role: "student",
//   });
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post("http://127.0.0.1:8000/auth/register/", formData);
//       toast.success(response.data.message);
//       navigate("/login"); // Redirect to login page after successful registration
//     } catch (error) {
//       toast.error(error.response?.data?.error || "Registration failed");
//     }
//   };

//   return (
//     <div>
//       <h2>Register</h2>
//       <form onSubmit={handleSubmit}>
//         <center>
//         <input type="text" name="username" placeholder="Username" onChange={handleChange} required /><br /><br />
//         <input type="email" name="email" placeholder="Email" onChange={handleChange} required /><br /><br />
//         <input type="password" name="password" placeholder="Password" onChange={handleChange} required /><br /><br />
//         <select name="role" onChange={handleChange}>
//           <option value="student">Student</option>
//           <option value="teacher">Teacher</option>
//           <option value="admin">Admin</option>
//         </select><br /><br />
//         <button type="submit">Register</button><br /><br />
//         </center>
//       </form>
//       <ToastContainer />
//     </div>
//   );
// };

// export default Register;

