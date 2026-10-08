import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Watch from "./pages/Watch";
import Channel from "./pages/Channel";
import Upload from "./pages/Upload";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Liked from "./pages/Liked";
import Profile from "./pages/Profile";

function NotFound() {
  return (
    <div className="px-4 py-16 text-center">
      <h1 className="font-display text-2xl">Page not found</h1>
      <p className="mt-2 text-sm text-muted">
        That page doesn't exist.{" "}
        <Link to="/" className="text-leaf underline">
          Go home
        </Link>
      </p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* pages without the navbar / sidebar */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* pages inside the layout */}
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="watch/:videoId" element={<Watch />} />
          <Route path="channel/:username" element={<Channel />} />

          {/* pages that need a login */}
          <Route element={<ProtectedRoute />}>
            <Route path="upload" element={<Upload />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="history" element={<History />} />
            <Route path="liked" element={<Liked />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
