
import { Outlet} from "react-router-dom";
import Navbar from "../components/student/Navbar";

const StudentLayout = () => {
  // const isEducatorRoute=useMatch("/educator/*");

  return (
    <div className="text-default min-h-screen bg-white">
      {/* Student Navbar */}
      {/* <StudentNavbar /> */}
      {/* {!isEducatorRoute && <Navbar/>} */}
      <Navbar/>
      
      <Outlet />
    </div>
  );
};

export default StudentLayout;
