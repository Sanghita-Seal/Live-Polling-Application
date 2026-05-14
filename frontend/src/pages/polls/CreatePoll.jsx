import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GradientButton from "../../components/ui/GradientButton.jsx";
import GlassCard from "../../components/ui/GlassCard.jsx";
import PageWrapper from "../../components/layout/PageWrapper.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { pollService } from "../../features/polls/polls.service.js";
import { getErrorMessage } from "../../utils/errorHandler.js";

function CreatePoll() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    pollName: "",
    pollDescription: "",
    pollDurationInMinutes: 10,
    isAnonymousAllowed: false,
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await pollService.createPoll({
        ...form,
        pollDurationInMinutes: Number(form.pollDurationInMinutes),
      });

      const pollId = response.data?._id;
      showToast({ type: "success", title: "Poll created", message: "Add questions before sharing it with voters." });
      navigate(pollId ? `/polls/${pollId}/builder` : "/dashboard");
    } catch (err) {
      setError(getErrorMessage(err, "Poll creation failed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageWrapper>
      <main className="dashboard-main">
        <GlassCard className="auth-card">
          <div className="section-heading">
            <p className="eyebrow">New poll</p>
            <h2>Create poll</h2>
          </div>

          <form className="form-stack" onSubmit={handleSubmit}>
            <label>
              Poll name
              <input
                name="pollName"
                value={form.pollName}
                onChange={handleChange}
                minLength={3}
                maxLength={100}
                required
              />
            </label>

            <label>
              Description
              <textarea
                name="pollDescription"
                value={form.pollDescription}
                onChange={handleChange}
                minLength={3}
                maxLength={500}
                required
              />
            </label>

            <label>
              Duration in minutes
              <input
                name="pollDurationInMinutes"
                type="number"
                min="1"
                max="60"
                value={form.pollDurationInMinutes}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Voting access
              <span className="toggle-row">
                <input
                  name="isAnonymousAllowed"
                  type="checkbox"
                  checked={form.isAnonymousAllowed}
                  onChange={handleChange}
                />
                Allow anonymous voting
              </span>
            </label>

            {error ? <p className="form-error">{error}</p> : null}

            <GradientButton type="submit" isLoading={isSubmitting}>
              Create poll
            </GradientButton>
          </form>
        </GlassCard>
      </main>
    </PageWrapper>
  );
}

export default CreatePoll;
