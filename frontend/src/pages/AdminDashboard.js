import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/auth/users/", {
          headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users", error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>Welcome, {user?.username}!</p>
      <button onClick={logout}>Logout</button>

      <h3>All Users</h3>
      <ul>
      {users.length > 0 ? (
          users.map((u) => (
            <li key={u.id}>
              {u.username} - {u.role}
            </li>
          ))
        ) : (
          <p>No users found</p>
        )}
      </ul>
    </div>
  );
};

export default AdminDashboard;

// import React from "react";
// import { useAuth } from "../context/AuthContext";

// const AdminDashboard = () => {
//   const { user, logout } = useAuth();
//   return (
//     <div>
//       <h2>Admin Dashboard</h2>
//       <p>Welcome, {user?.username}!</p>
//       <button onClick={logout}>Logout</button>
//     </div>
//   );
// };

// export default AdminDashboard;
