import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  // ProtectedRoute remembers the page the user wanted
  const redirectTo = location.state?.from?.pathname || "/";

  const { login } = useContext(AuthContext);
  // one box for "email or username": the backend accepts either
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const identifier = form.identifier.trim();
    const credentials = identifier.includes("@")
      ? { email: identifier, password: form.password }
      : { username: identifier, password: form.password };

    try {
      await login(credentials);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "could not login. check your details");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Log in</h1>
        <p className="auth-subtitle">Welcome back</p>

        {location.state?.registered && (
          <p className="form-success">Account created! You can log in now.</p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="identifier">Email or username</label>
            <input
              id="identifier"
              name="identifier"
              type="text"
              autoComplete="username"
              required
              value={form.identifier}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              autoComplete="current-password"
              required
              value={form.password}
              onChange={handleChange}
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary w-full"
          >
            {submitting ? "Logging in ..." : "Log in"}
          </button>
        </form>

        <p className="auth-footer">
          New here? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
