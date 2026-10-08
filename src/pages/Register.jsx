import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  const [form, setForm] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
  });

  const [avatar, setAvatar] = useState(null);
  const [coverimage, setCoverImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handlechange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handlesubmit = async (e) => {
    e.preventDefault();

    setError(null);

    if (!avatar) {
      setError("an avatar image is required");
      return;
    }

    setSubmitting(true);

    try {
      const formdata = new FormData();
      Object.entries(form).forEach(([key, value]) => formdata.append(key, value));

      formdata.append("avatar", avatar);
      if (coverimage) formdata.append("coverImage", coverimage);

      await register(formdata);
      navigate("/login", { state: { registered: true } });
    } catch (err) {
      setError(err.response?.data?.message || "could not create the account");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create your account</h1>
        <p className="auth-subtitle">Join VideoTube and start watching</p>

        <form onSubmit={handlesubmit}>
          <div className="form-field">
            <label htmlFor="fullname">Full name</label>
            <input
              id="fullname"
              type="text"
              name="fullname"
              required
              value={form.fullname}
              onChange={handlechange}
              placeholder="Priya Nair"
            />
          </div>

          <div className="form-field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              name="username"
              autoComplete="username"
              required
              value={form.username}
              onChange={handlechange}
              placeholder="priya_nair"
            />
          </div>

          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={handlechange}
              placeholder="priya@gmail.com"
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">Password (min 6 characters)</label>
            <input
              id="password"
              type="password"
              name="password"
              autoComplete="new-password"
              required
              minLength={6}
              value={form.password}
              onChange={handlechange}
              placeholder="********"
            />
          </div>

          <div className="form-field">
            <label htmlFor="avatar">Avatar (required)</label>
            <input
              id="avatar"
              type="file"
              name="avatar"
              accept="image/*"
              onChange={(e) => setAvatar(e.target.files[0] || null)}
            />
          </div>

          <div className="form-field">
            <label htmlFor="coverImage">Cover image (optional)</label>
            <input
              id="coverImage"
              type="file"
              name="coverImage"
              accept="image/*"
              onChange={(e) => setCoverImage(e.target.files[0] || null)}
            />
          </div>

          {/* showing error */}
          {error && <p className="form-error">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary w-full"
          >
            {submitting ? "Creating account ..." : "Sign up"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
