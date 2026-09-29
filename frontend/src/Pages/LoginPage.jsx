import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../auth/useAuth";
import "../styles/components.css";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await login(form);
      navigate("/dashboard", { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to sign in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <Link to="/" className="brand-link auth-page__brand">
        <span className="brand-link__name">Interview Craft</span>
      </Link>
      <section className="auth-card" aria-labelledby="login-title">
        <div className="auth-card__heading">
          <p className="auth-card__eyebrow">Welcome back</p>
          <h1 id="login-title">Sign in to your workspace</h1>
          <p>Continue where your next great interview begins.</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-form__field">
            <span>Email</span>
            <input
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
            />
          </label>
          <label className="auth-form__field">
            <span>Password</span>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
            />
          </label>
          {error && <p className="auth-form__error" role="alert">{error}</p>}
          <button className="app-button app-button--primary auth-form__submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="auth-card__switch">
          New to Interview Craft? <Link to="/signup">Create an account</Link>
        </p>
      </section>
    </main>
  );
}

export default LoginPage;