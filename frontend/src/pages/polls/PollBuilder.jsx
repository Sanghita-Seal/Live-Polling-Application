import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageWrapper from "../../components/layout/PageWrapper.jsx";
import GlassCard from "../../components/ui/GlassCard.jsx";
import GradientButton from "../../components/ui/GradientButton.jsx";
import StatusBadge from "../../components/ui/StatusBadge.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { pollService } from "../../features/polls/polls.service.js";
import { copyText } from "../../utils/clipboard.utils.js";
import { getErrorMessage } from "../../utils/errorHandler.js";
import { formatDateTime, getAnalyticsUrl, getPublicPollUrl } from "../../utils/poll.utils.js";

function PollBuilder() {
  const { pollId } = useParams();
  const { showToast } = useToast();

  const [poll, setPoll] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [settings, setSettings] = useState({
    pollName: "",
    pollDescription: "",
    pollDurationInMinutes: 10,
    isAnonymousAllowed: false,
  });
  const [form, setForm] = useState({
    question: "",
    isRequired: true,
    options: ["", ""],
  });
  const [error, setError] = useState("");
  const [settingsError, setSettingsError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [isPublishingResults, setIsPublishingResults] = useState(false);

  useEffect(() => {
    const loadPoll = async () => {
      try {
        const response = await pollService.getPollById(pollId);
        const loadedPoll = response.data?.poll || null;
        setPoll(loadedPoll);
        setQuestions(response.data?.questions || []);
        setSettings({
          pollName: loadedPoll?.pollName || "",
          pollDescription: loadedPoll?.pollDescription || "",
          pollDurationInMinutes: loadedPoll?.pollDurationInMinutes || 10,
          isAnonymousAllowed: Boolean(loadedPoll?.isAnonymousAllowed),
        });
      } catch (err) {
        setError(getErrorMessage(err, "Failed to load poll"));
      } finally {
        setIsLoading(false);
      }
    };

    loadPoll();
  }, [pollId]);

  const handleSettingsChange = (event) => {
    const { name, value, type, checked } = event.target;
    setSettings((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleQuestionChange = (event) => {
    const { checked, name, type, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleOptionChange = (index, value) => {
    setForm((current) => ({
      ...current,
      options: current.options.map((option, optionIndex) => (optionIndex === index ? value : option)),
    }));
  };

  const addOption = () => {
    setForm((current) => ({
      ...current,
      options: [...current.options, ""],
    }));
  };

  const removeOption = (index) => {
    setForm((current) => ({
      ...current,
      options: current.options.filter((_, optionIndex) => optionIndex !== index),
    }));
  };

  const saveSettings = async (event) => {
    event.preventDefault();
    setSettingsError("");
    setIsSavingSettings(true);

    try {
      const response = await pollService.updatePoll(pollId, {
        ...settings,
        pollDurationInMinutes: Number(settings.pollDurationInMinutes),
      });
      setPoll(response.data);
      showToast({ type: "success", title: "Poll settings saved" });
    } catch (err) {
      setSettingsError(getErrorMessage(err, "Failed to update poll"));
    } finally {
      setIsSavingSettings(false);
    }
  };

  const changeStatus = async (status) => {
    if (status === "active" && questions.length === 0) {
      showToast({ type: "error", title: "Add at least one question first" });
      return;
    }

    setIsChangingStatus(true);
    setError("");

    try {
      const response = await pollService.updatePoll(pollId, { status });
      setPoll(response.data);
      showToast({ type: "success", title: status === "active" ? "Poll is live" : "Poll ended" });
    } catch (err) {
      setError(getErrorMessage(err, "Failed to update poll status"));
    } finally {
      setIsChangingStatus(false);
    }
  };

  const copyToClipboard = async (value, label) => {
    if (await copyText(value)) {
      showToast({ type: "success", title: `${label} copied` });
      return;
    }

    showToast({ type: "error", title: "Copy failed", message: "Please copy the link manually." });
  };

  const publishResults = async () => {
    setIsPublishingResults(true);
    setError("");

    try {
      const response = await pollService.publishResults(pollId);
      setPoll(response.data);
      showToast({ type: "success", title: "Results published", message: "The public poll link now shows final results." });
    } catch (err) {
      setError(getErrorMessage(err, "Failed to publish results"));
    } finally {
      setIsPublishingResults(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const payload = {
        question: form.question,
        questionNumber: questions.length + 1,
        isRequired: form.isRequired,
        options: form.options.map((option, index) => ({
          text: option,
          order: index + 1,
        })),
      };

      const response = await pollService.createQuestion(pollId, payload);

      setQuestions((current) => [...current, response.data]);
      setForm({
        question: "",
        isRequired: true,
        options: ["", ""],
      });
      showToast({ type: "success", title: "Question added" });
    } catch (err) {
      setError(getErrorMessage(err, "Failed to add question"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <PageWrapper>
        <main className="dashboard-main narrow-main">
          <GlassCard>Loading poll...</GlassCard>
        </main>
      </PageWrapper>
    );
  }

  if (error && !poll) {
    return (
      <PageWrapper>
        <main className="dashboard-main narrow-main">
          <GlassCard>
            <h2>Poll could not be opened</h2>
            <p className="form-error">{error}</p>
            <GradientButton as={Link} to="/dashboard" className="small-button">
              Back to dashboard
            </GradientButton>
          </GlassCard>
        </main>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <main className="dashboard-main narrow-main">
        <GlassCard>
          <div className="builder-header">
            <div>
              <p className="eyebrow">Poll builder</p>
              <div className="poll-title-line">
                <h2>{poll?.pollName || "Untitled poll"}</h2>
                <StatusBadge status={poll?.status} />
              </div>
              <p>{poll?.pollDescription}</p>
              <div className="poll-meta">
                <span>{poll?.pollDurationInMinutes} min</span>
                <span>Starts {formatDateTime(poll?.pollStartTime)}</span>
                <span>Ends {formatDateTime(poll?.pollEndTime)}</span>
              </div>
            </div>

            <div className="poll-actions">
              {poll?.status === "draft" ? (
                <GradientButton type="button" onClick={() => changeStatus("active")} isLoading={isChangingStatus}>
                  Start poll
                </GradientButton>
              ) : null}
              {poll?.status === "active" ? (
                <GradientButton type="button" onClick={() => changeStatus("ended")} isLoading={isChangingStatus}>
                  End poll
                </GradientButton>
              ) : null}
              {poll?.status === "ended" && !poll?.isResultPublished ? (
                <GradientButton type="button" onClick={publishResults} isLoading={isPublishingResults}>
                  Publish results
                </GradientButton>
              ) : null}
              {poll?.isResultPublished ? <span className="muted-text">Results published</span> : null}
              {poll?.status === "ended" ? (
                <button
                  type="button"
                  className="ghost-button result-link-button"
                  onClick={() => copyToClipboard(getPublicPollUrl(poll?.shareCode), "Final result link")}
                >
                  Copy final result link
                </button>
              ) : (
                <button
                  type="button"
                  className="ghost-button"
                  onClick={() => copyToClipboard(getPublicPollUrl(poll?.shareCode), "Vote link")}
                >
                  Copy vote link
                </button>
              )}
              <button
                type="button"
                className="ghost-button"
                onClick={() => copyToClipboard(getAnalyticsUrl(poll?.analyticsCode), "Analytics link")}
              >
                Copy analytics
              </button>
            </div>
          </div>
        </GlassCard>

        <div className="builder-grid">
          <GlassCard>
            <div className="section-heading">
              <p className="eyebrow">Settings</p>
              <h2>Poll details</h2>
            </div>

            <form className="form-stack" onSubmit={saveSettings}>
              <label>
                Poll name
                <input
                  name="pollName"
                  value={settings.pollName}
                  onChange={handleSettingsChange}
                  minLength={3}
                  maxLength={100}
                  required
                />
              </label>

              <label>
                Description
                <textarea
                  name="pollDescription"
                  value={settings.pollDescription}
                  onChange={handleSettingsChange}
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
                  value={settings.pollDurationInMinutes}
                  onChange={handleSettingsChange}
                  required
                />
              </label>

              <label>
                Voting access
                <span className="toggle-row">
                  <input
                    name="isAnonymousAllowed"
                    type="checkbox"
                    checked={settings.isAnonymousAllowed}
                    onChange={handleSettingsChange}
                  />
                  Allow anonymous voting
                </span>
              </label>

              {settingsError ? <p className="form-error">{settingsError}</p> : null}

              <GradientButton type="submit" isLoading={isSavingSettings}>
                Save settings
              </GradientButton>
            </form>
          </GlassCard>

          <GlassCard>
            <div className="section-heading">
              <p className="eyebrow">Question bank</p>
              <h2>Add question</h2>
            </div>

            <form className="form-stack" onSubmit={handleSubmit}>
              <label>
                Question
                <input
                  name="question"
                  value={form.question}
                  onChange={handleQuestionChange}
                  minLength={3}
                  maxLength={300}
                  required
                />
              </label>

              <label>
                Requirement
                <span className="toggle-row">
                  <input
                    name="isRequired"
                    type="checkbox"
                    checked={form.isRequired}
                    onChange={handleQuestionChange}
                  />
                  Mandatory question
                </span>
              </label>

              {form.options.map((option, index) => (
                <label key={index}>
                  Option {index + 1}
                  <span className="inline-field">
                    <input
                      value={option}
                      onChange={(event) => handleOptionChange(index, event.target.value)}
                      maxLength={200}
                      required
                    />

                    {form.options.length > 2 ? (
                      <button type="button" className="icon-button" onClick={() => removeOption(index)}>
                        -
                      </button>
                    ) : null}
                  </span>
                </label>
              ))}

              {form.options.length < 4 ? (
                <button type="button" className="ghost-button" onClick={addOption}>
                  Add option
                </button>
              ) : null}

              {error ? <p className="form-error">{error}</p> : null}

              <GradientButton type="submit" isLoading={isSubmitting}>
                Add question
              </GradientButton>
            </form>
          </GlassCard>
        </div>

        <GlassCard>
          <div className="card-heading">
            <div>
              <p className="eyebrow">Questions</p>
              <h2>{questions.length} configured</h2>
            </div>
            <GradientButton as={Link} to="/dashboard" className="small-button">
              Dashboard
            </GradientButton>
          </div>

          {questions.length === 0 ? (
            <p className="muted-text">No questions added yet.</p>
          ) : (
            <div className="question-list">
              {questions.map((question) => (
                <article className="question-card" key={question._id}>
                  <h3>
                    {question.questionNumber}. {question.question}
                  </h3>
                  <p className="muted-text">{question.isRequired ? "Mandatory" : "Optional"}</p>

                  <ul>
                    {question.options.map((option) => (
                      <li key={option._id}>
                        <span>{option.text}</span>
                        <strong>{option.votes || 0} votes</strong>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          )}
        </GlassCard>
      </main>
    </PageWrapper>
  );
}

export default PollBuilder;
