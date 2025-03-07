import axios from "axios";

const API_URL = "http://127.0.0.1:8000/auth/exams/";

// const getAuthHeaders = () => {
//   return { Authorization: `Bearer ${localStorage.getItem("access_token")}` };
// };
const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    console.error("No access token found!");
  }
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
};

// Create a New Exam
export const createExam = async (examData) => {
  try {
    console.log("Sending Exam Data:", examData); // Debugging
    const response = await axios.post(`${API_URL}create/`, examData, { headers: getAuthHeaders() });
    console.log("Exam created:", response.data); // Debug success response
    return response.data;
  } catch (error) {
    console.error("Error creating exam:", error.response?.data || error.message);
    throw error; // Rethrow for handling in the component
  }
};

// Fetch All Exams
export const fetchExams = async () => {
  const response = await axios.get(API_URL, { headers: getAuthHeaders() });
  return response.data;
};


// import axios from "axios";

// const API_URL = "http://127.0.0.1:8000/auth/exams/";

// // const getAuthHeaders = () => {
// //   return { Authorization: `Bearer ${localStorage.getItem("access_token")}` };
// // };
// const getAuthHeaders = () => {
//   const token = localStorage.getItem("access_token");
//   if (!token) {
//     console.error("No access token found!");
//   }
//   return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
// };

// // Create a New Exam
// export const createExam = async (examData) => {
//   try {
//     console.log("Sending Exam Data:", examData); // Debugging
//     const response = await axios.post(`${API_URL}create/`, examData, { headers: getAuthHeaders() });
//     console.log("Exam created:", response.data); // Debug success response
//     return response.data;
//   } catch (error) {
//     console.error("Error creating exam:", error.response?.data || error.message);
//     throw error; // Rethrow for handling in the component
//   }
// };

// // Fetch All Exams
// export const fetchExams = async () => {
//   try {
//     const response = await axios.get("http://127.0.0.1:8000/auth/exams/", { headers: getAuthHeaders() });
//     console.log("Fetched Exams:", response.data);  // ✅ Debugging
//     return response.data;
//   } catch (error) {
//     console.error("❌ Error fetching exams:", error.response?.data || error.message);
//     throw error;
//   }
// };


