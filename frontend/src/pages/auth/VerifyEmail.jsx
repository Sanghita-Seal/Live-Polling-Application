import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import GlassCard from "../../components/ui/GlassCard.jsx";
import LoadingSpinner from "../../components/ui/LoadingSpinner.jsx";
import { authService } from "../../features/auth/auth.service";
import { getErrorMessage } from "../../utils/errorHandler";

function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState({ loading: true, message: "", error: "" });

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await authService.verifyEmail(token);
        setStatus({ loading: false, message: response.message || "Email verified successfully", error: "" });
      } catch (err) {
        setStatus({ loading: false, message: "", error: getErrorMessage(err, "Email verification failed") });
      }
    };

    verify();
  }, [token]);

  if (status.loading) {
    return <LoadingSpinner label="Verifying email" />;
  }

  return (
    <GlassCard className="auth-card">
      <div className="section-heading">
        <p className="eyebrow">Email verification</p>
        <h2>{status.error ? "Verification failed" : "Verified"}</h2>
      </div>

      {status.message ? <p className="form-success">{status.message}</p> : null}
      {status.error ? <p className="form-error">{status.error}</p> : null}

      <Link className="text-link" to="/login">
        Go to sign in
      </Link>
    </GlassCard>
  );
}

export default VerifyEmail;
