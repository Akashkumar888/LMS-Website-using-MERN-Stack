
import { Outlet } from "react-router-dom";

const EducatorLayout = () => {
  return (
    <div style={{ display: "flex" }}>
      {/* Educator Sidebar */}
      {/* <EducatorSidebar /> */}
      <h1>Educator Page</h1>

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      
    </div>
  );
};

export default EducatorLayout;
