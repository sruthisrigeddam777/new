import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        setUser(jwtDecode(token)); // ✅ Decode JWT and update user state
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("access_token");
      }
    }
  }, []);  // ✅ No dependency on `localStorage.getItem("access_token")`

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// import { createContext, useContext, useState, useEffect } from "react";
// import { jwtDecode } from "jwt-decode";
// import { useNavigate } from "react-router-dom";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("access_token");
//     if (token) {
//       try {
//         setUser(jwtDecode(token)); // ✅ Decode JWT and update user state
//       } catch (error) {
//         console.error("Error decoding token:", error);
//         localStorage.removeItem("access_token");
//       }
//     }
//   }, []);  // ✅ No dependency on `localStorage.getItem("access_token")`

//   const logout = () => {
//     localStorage.removeItem("access_token");
//     localStorage.removeItem("refresh_token");
//     setUser(null);
//     navigate("/login");
//   };

//   return (
//     <AuthContext.Provider value={{ user, setUser, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
