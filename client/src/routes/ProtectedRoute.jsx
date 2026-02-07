import { Navigate } from "react-router-dom";
import { useContext } from "react";
import AppContext from "../context/AppContext";

const ProtectedRoute = ({ children }) => {
  const { userData } = useContext(AppContext);

  if (!userData) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

// Using Protected Route
// <Route
//   path="/dashboard"
//   element={
//     <ProtectedRoute>
//       <Dashboard />
//     </ProtectedRoute>
//   }
// />