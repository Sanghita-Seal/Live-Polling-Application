import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GradientButton from "../../components/ui/GradientButton.jsx";
import GlassCard from "../../components/ui/GlassCard.jsx";
import { AUTH_ROLES } from "../../features/auth/auth.constants";
import { authService } from "../../features/auth/auth.service";
import { getErrorMessage } from "../../utils/errorHandler";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: AUTH_ROLES.customer,
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await authService.register(form);
      navigate("/login", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, "Registration failed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GlassCard className="auth-card">
      <div className="section-heading">
        <p className="eyebrow">Start polling</p>
        <h2>Create account</h2>
      </div>

      <form className="form-stack" onSubmit={handleSubmit}>
        <label>
          Name
          <input name="name" value={form.name} onChange={handleChange} minLength={2} required />
        </label>

        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </label>

        <label>
          Password
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            minLength={5}
            pattern="(?=.*[A-Z])(?=.*\d).+"
            title="Password must include at least one uppercase letter and one digit."
            required
          />
        </label>

        <label>
          Role
          <select name="role" value={form.role} onChange={handleChange}>
            <option value={AUTH_ROLES.customer}>Customer</option>
            <option value={AUTH_ROLES.seller}>Seller</option>
          </select>
        </label>

        <p className="helper-text">Password must include at least one uppercase letter and one digit.</p>
        {error ? <p className="form-error">{error}</p> : null}

        <GradientButton type="submit" isLoading={isSubmitting}>
          Register
        </GradientButton>
      </form>

      <p className="auth-switch">
        Already registered? <Link to="/login">Sign in</Link>
      </p>
    </GlassCard>
  );
}

export default Register;
