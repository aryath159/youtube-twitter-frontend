import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

// navbar on top, sidebar on the left, the current page in the middle
function Layout() {
  return (
    <>
      <Navbar />

      <div className="app-body">
        <Sidebar />

        <div className="app-content">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Layout;
