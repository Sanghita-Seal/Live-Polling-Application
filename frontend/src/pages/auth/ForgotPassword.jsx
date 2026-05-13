import { useState } from "react";
import { Link } from "react-router-dom";
import GradientButton from "../../components/ui/GradientButton.jsx";
import GlassCard from "../../components/ui/GlassCard.jsx";
import { authService } from "../../features/auth/auth.service";
import { getErrorMessage } from "../../utils/errorHandler";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await authService.forgotPassword({ email });
      setMessage(response.message || "Password reset email sent");
    } catch (err) {
      setError(getErrorMessage(err, "Could not send reset email"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GlassCard className="auth-card">
      <div className="section-heading">
        <p className="eyebrow">Account help</p>
        <h2>Reset your password</h2>
      </div>

      <form className="form-stack" onSubmit={handleSubmit}>
        <label>
          Email
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>

        {message ? <p className="form-success">{message}</p> : null}
        {error ? <p className="form-error">{error}</p> : null}

        <GradientButton type="submit" isLoading={isSubmitting}>
          Send reset link
        </GradientButton>
      </form>

      <Link className="text-link" to="/login">
        Back to sign in
      </Link>
    </GlassCard>
  );
}

export default ForgotPassword;
