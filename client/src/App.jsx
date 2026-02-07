import React from "react";
import { ToastContainer } from "react-toastify";
import AppRoutes from "./routes/AppRoutes";
import "quill/dist/quill.snow.css";


const App = () => {
  return (
    <>
    <ToastContainer/>
      <AppRoutes />
    </>
  );
};

export default App;
