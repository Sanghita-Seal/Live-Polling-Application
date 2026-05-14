import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import GradientButton from "../../components/ui/GradientButton.jsx";
import GlassCard from "../../components/ui/GlassCard.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { authService } from "../../features/auth/auth.service";
import { getErrorMessage } from "../../utils/errorHandler";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await authService.resetPassword(token, { password });
      showToast({ type: "success", title: "Password updated", message: "Please sign in again." });
      navigate("/login", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, "Could not reset password"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GlassCard className="auth-card">
      <div className="section-heading">
        <p className="eyebrow">Choose a new password</p>
        <h2>Reset password</h2>
      </div>

      <form className="form-stack" onSubmit={handleSubmit}>
        <label>
          New password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={5}
            pattern="(?=.*[A-Z])(?=.*\d).+"
            title="Password must include at least one uppercase letter and one digit."
            required
          />
        </label>

        <p className="helper-text">Use at least one uppercase letter and one digit.</p>
        {error ? <p className="form-error">{error}</p> : null}

        <GradientButton type="submit" isLoading={isSubmitting}>
          Update password
        </GradientButton>
      </form>

      <Link className="text-link" to="/login">
        Back to sign in
      </Link>
    </GlassCard>
  );
}

export default ResetPassword;
