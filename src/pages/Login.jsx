import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import csspsLogo from "../assets/cssps-logo.png";
import s from "./Login.module.css";

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/hub";

  if (isAuthenticated) {
    navigate(from, { replace: true });
    return null;
  }

  const [form, setForm] = useState({ index_number: "", date_of_birth: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.index_number || !form.date_of_birth) {
      setError("Please enter your index number and date of birth.");
      return;
    }
    setLoading(true);
    try {
      await login(form.index_number.trim(), form.date_of_birth);
      navigate(from, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.detail || "Invalid index number or date of birth.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={s.page}>
      <div className={s.brand}>
        <img src={csspsLogo} alt="CSSPS Logo" className={s.logoImg} />
        <h1>CSSPS Student Portal</h1>
        <p>Sign in to access your placement</p>
      </div>

      <div className={`card ${s.formCard}`}>
        <form onSubmit={onSubmit} className={s.form}>
          <div className={s.field}>
            <label className={s.label} htmlFor="index_number">
              Index Number
            </label>
            <input
              id="index_number"
              name="index_number"
              type="text"
              value={form.index_number}
              onChange={onChange}
              placeholder="e.g. 130501801025"
              className="input-field"
              maxLength={14}
              autoComplete="username"
            />
          </div>

          <div className={s.field}>
            <label className={s.label} htmlFor="date_of_birth">
              Date of Birth
            </label>
            <input
              id="date_of_birth"
              name="date_of_birth"
              type="date"
              value={form.date_of_birth}
              onChange={onChange}
              className="input-field"
              autoComplete="bday"
            />
            <span className={s.hint}>This is used to verify your identity</span>
          </div>

          {error && (
            <div className="alert alert-error">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                style={{ flexShrink: 0, marginTop: 1 }}
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`btn-primary ${s.submitBtn}`}
          >
            {loading && (
              <span
                className="spinner"
                style={{
                  width: 15,
                  height: 15,
                  borderTopColor: "#fff",
                  borderColor: "rgba(255,255,255,0.3)",
                }}
              />
            )}
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className={s.help}>
          Having trouble? <a href="tel:0207337515">Call 020 733 7515</a>
        </p>
      </div>

      <Link to="/admin/login" className={s.back}>
        Login As Administrator
      </Link>
      <Link to="/" className={s.back}>
        ← Back to home
      </Link>
      <p className={s.footnote}>© 2026 – Powered by COLDSIS</p>
    </div>
  );
}
