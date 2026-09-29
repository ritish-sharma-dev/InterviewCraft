import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../auth/useAuth";
import "../styles/components.css";

function SignupPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await register(form);
      navigate("/dashboard", { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to create your account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <Link to="/" className="brand-link auth-page__brand">
        <span className="brand-link__name">Interview Craft</span>
      </Link>
      <section className="auth-card" aria-labelledby="signup-title">
        <div className="auth-card__heading">
          <p className="auth-card__eyebrow">Start practicing</p>
          <h1 id="signup-title">Create your account</h1>
          <p>Set up your workspace and get into your next session.</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-form__field">
            <span>Name</span>
            <input
              type="text"
              autoComplete="name"
              maxLength={80}
              required
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
            />
          </label>
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
              autoComplete="new-password"
              minLength={8}
              maxLength={128}
              required
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
            />
          </label>
          {error && <p className="auth-form__error" role="alert">{error}</p>}
          <button className="app-button app-button--primary auth-form__submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>
        <p className="auth-card__switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </section>
    </main>
  );
}

export default SignupPage;