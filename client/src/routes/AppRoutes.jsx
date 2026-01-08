import { Routes, Route } from "react-router-dom";

/* Layouts */
import StudentLayout from "../layouts/StudentLayout";
import EducatorLayout from "../layouts/EducatorLayout";

/* Student pages */
import Home from "../pages/student/Home";
import CourseList from "../pages/student/CourseList";
import CourseDetails from "../pages/student/CourseDetails";
import MyEnrollments from "../pages/student/MyEnrollments";
import Player from "../pages/student/Player";

/* Educator pages */
import Dashboard from "../pages/educator/Dashboard";
import AddCourse from "../pages/educator/AddCourse";
import MyCousres from "../pages/educator/MyCousres";
import StudentsEnrolled from "../pages/educator/StudentsEnrolled";

const AppRoutes = () => {
  return (
    <Routes>
      {/* ===== STUDENT ROUTES ===== */}
      <Route element={<StudentLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/course-list/:input?" element={<CourseList />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/my-enrollments" element={<MyEnrollments />} />
        <Route path="/player/:courseId" element={<Player />} />
      </Route>

      {/* ===== EDUCATOR ROUTES ===== */}
      <Route path="/educator" element={<EducatorLayout />}>
        {/* Dashboard (default page) */}
        <Route index element={<Dashboard />} />

        <Route path="add-course" element={<AddCourse />} />
        <Route path="my-courses" element={<MyCousres />} />
        <Route path="student-enrolled" element={<StudentsEnrolled />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;


// 🧠 Why index is IMPORTANT
// index means default child route
// When user visits:
// /educator
// 👉 <Dashboard /> loads automatically
// No duplicate path
// Clean routing

// Component name should start with capital letter
// import { Routes, Route } from "react-router-dom";
// import Home from "../pages/student/Home";
// import MainLayout from "../layouts/MainLayout";

// const AppRoutes = () => {
//   return (
//     <Routes>
//       <Route element={<MainLayout />}>
//         <Route path="/" element={<Home />} />
//       </Route>
//     </Routes>
//   );
// };

// export default AppRoutes;
