import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import GradientButton from "../../components/ui/GradientButton.jsx";
import GlassCard from "../../components/ui/GlassCard.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { getErrorMessage } from "../../utils/errorHandler";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo = location.state?.from?.pathname || "/dashboard";

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(form);
      showToast({ type: "success", title: "Signed in" });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, "Login failed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GlassCard className="auth-card">
      <div className="section-heading">
        <p className="eyebrow">Welcome back</p>
        <h2>Sign in</h2>
      </div>

      <form className="form-stack" onSubmit={handleSubmit}>
        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </label>

        <label>
          Password
          <input name="password" type="password" value={form.password} onChange={handleChange} required />
        </label>

        {error ? <p className="form-error">{error}</p> : null}

        <GradientButton type="submit" isLoading={isSubmitting}>
          Sign in
        </GradientButton>
      </form>

      <p className="auth-switch">
        New here? <Link to="/register">Create an account</Link>
      </p>
      <Link className="text-link" to="/forgot-password">
        Forgot password?
      </Link>
    </GlassCard>
  );
}

export default Login;
