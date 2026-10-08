import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { NavLink } from "react-router-dom";

const linkClass = ({ isActive }) =>
  `sidebar-link${isActive ? " active" : ""}`;

function Sidebar() {
  const { user } = useContext(AuthContext);

  return (
    <aside className="sidebar">
      <nav>
        <NavLink to="/" end className={linkClass}>
          Home
        </NavLink>

        {/* these pages need a login, so only show them to logged in users */}
        {user && (
          <>
            <NavLink to="/history" className={linkClass}>
              History
            </NavLink>

            <NavLink to="/liked" className={linkClass}>
              Liked Videos
            </NavLink>

            <div className="sidebar-section-title">Creator</div>

            <NavLink to="/upload" className={linkClass}>
              Upload
            </NavLink>

            <NavLink to="/dashboard" className={linkClass}>
              Dashboard
            </NavLink>

            <NavLink to={`/channel/${user.username}`} className={linkClass}>
              Channel
            </NavLink>

            <div className="sidebar-section-title">Account</div>

            <NavLink to="/profile" className={linkClass}>
              Profile
            </NavLink>
          </>
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;
