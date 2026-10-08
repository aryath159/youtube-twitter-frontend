import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

function Navbar({ onSearch }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { user, logout } = useContext(AuthContext);

  // start with the current ?query= so the box still shows what was searched
  // (it must be a string, "null" makes the input uncontrolled)
  const [searchquery, setSearchquery] = useState(searchParams.get("query") || "");

  const handlelogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();

    const trimmed = searchquery.trim();

    if (trimmed) {
      // Home.jsx reads the same "query" parameter
      navigate(`/?query=${encodeURIComponent(trimmed)}`);

      onSearch?.(trimmed);
    } else {
      navigate("/");
      onSearch?.("");
    }
  };

  return (
    <header className="navbar">
      {/* navbar left  */}
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">▶</span>
          <span>VideoTube</span>
        </Link>
      </div>

      {/* navbar central */}
      <form onSubmit={handleSearch} className="navbar-search">
        <input
          type="text"
          placeholder="Search videos ..."
          value={searchquery}
          onChange={(e) => setSearchquery(e.target.value)}
          // for screen readers
          aria-label="Search videos"
        />
        <button type="submit" aria-label="Search">
          🔍
        </button>
      </form>

      {/* navbar right */}
      <div className="navbar-right">
        {user ? (
          <>
            {/* logged in */}
            <Link to="/upload" className="btn btn-outline">
              Upload
            </Link>
            <Link to="/dashboard" className="btn btn-outline">
              Studio
            </Link>

            <div className="navbar-user" tabIndex={0}>
              <img src={user.avatar} alt={user.username} className="navbar-avatar" />

              {/* drop down - shown when the avatar is hovered / focused */}
              <div className="navbar-dropdown">
                <div className="dropdown-username">@{user.username}</div>

                <Link to={`/channel/${user.username}`}>Your channel</Link>
                <Link to="/profile">Profile settings</Link>

                <button type="button" onClick={handlelogout}>
                  Logout
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-outline">
              Login
            </Link>

            <Link to="/register" className="btn btn-primary">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;

/*
  <header>
  │
  ├── navbar-left   -> logo
  ├── navbar-search -> input + button
  └── navbar-right
      ├── logged in     -> Upload, Studio, avatar dropdown
      └── NOT logged in -> Login, Sign Up

  navigate("/?query=node") only changes the URL. Home.jsx reads the URL with
  useSearchParams() and calls the backend, so onSearch is optional.
*/
