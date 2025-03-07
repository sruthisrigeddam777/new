import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { Container, Table, Button, Card } from "react-bootstrap";

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
    <Container className="mt-5">
      <Card className="p-4 shadow-lg">
        <h2 className="text-center">Admin Dashboard</h2>

        <div className="d-flex justify-content-end">
          <Button variant="danger" onClick={logout}>Logout</Button>
        </div>

        <h3 className="mt-4">All Users</h3>
        {users.length > 0 ? (
          <Table striped bordered hover responsive className="mt-3">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, index) => (
                <tr key={index}>
                  <td>{u.id}</td>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge bg-${u.role === "admin" ? "danger" : u.role === "teacher" ? "primary" : "success"}`}>
                      {u.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p className="text-center text-muted">No users found</p>
        )}
      </Card>
    </Container>
  );
};

export default AdminDashboard;

// import React, { useEffect, useState } from "react";
// import { useAuth } from "../context/AuthContext";
// import axios from "axios";

// const AdminDashboard = () => {
//   const { user, logout } = useAuth();
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await axios.get("http://127.0.0.1:8000/auth/users/", {
//           headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
//         });
//         setUsers(response.data);
//       } catch (error) {
//         console.error("Error fetching users", error);
//       }
//     };
//     fetchUsers();
//   }, []);

//   return (
//     <div>
//       <h2>Admin Dashboard</h2>
//       <p>Welcome, {user?.username}!</p>
//       <button onClick={logout}>Logout</button>

//       <h3>All Users</h3>
//       <ul>
//       {users.length > 0 ? (
//           users.map((u) => (
//             <li key={u.id}>
//               {u.username} - {u.role}
//             </li>
//           ))
//         ) : (
//           <p>No users found</p>
//         )}
//       </ul>
//     </div>
//   );
// };

// export default AdminDashboard;

// // import React from "react";
// // import { useAuth } from "../context/AuthContext";

// // const AdminDashboard = () => {
// //   const { user, logout } = useAuth();
// //   return (
// //     <div>
// //       <h2>Admin Dashboard</h2>
// //       <p>Welcome, {user?.username}!</p>
// //       <button onClick={logout}>Logout</button>
// //     </div>
// //   );
// // };

// // export default AdminDashboard;
