import { Outlet } from "react-router-dom";
import Navbar from "../components/educator/Navbar";
import Sidebar from "../components/educator/Sidebar";
import Footer from "../components/educator/Footer";

const EducatorLayout = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top Navbar */}
      <Navbar />

      {/* Body */}
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Right Content */}
        <main className="flex-1 p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>

      {/* Bottom Footer */}
      <Footer />
    </div>
  );
};

export default EducatorLayout;
