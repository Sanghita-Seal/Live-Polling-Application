import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/layout/Navbar.jsx";
import GlassCard from "../../components/ui/GlassCard.jsx";
import GradientButton from "../../components/ui/GradientButton.jsx";
import LoadingSpinner from "../../components/ui/LoadingSpinner.jsx";
import StatusBadge from "../../components/ui/StatusBadge.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { pollService } from "../../features/polls/polls.service.js";
import { getErrorMessage } from "../../utils/errorHandler.js";
import { formatDateTime, getOptionId, getPollId, getVoterFingerprint } from "../../utils/poll.utils.js";

function PublicPoll() {
  const { shareCode } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isBootstrapping } = useAuth();
  const { showToast } = useToast();
  const [poll, setPoll] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [voter, setVoter] = useState({ firstName: "", lastName: "" });
  const [submittedQuestions, setSubmittedQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const canVote = poll?.status === "active";
  const requiredQuestions = questions.filter((question) => question.isRequired !== false);
  const isComplete =
    questions.length > 0 && requiredQuestions.every((question) => Boolean(answers[getPollId(question)]));
  const submittedSet = useMemo(() => new Set(submittedQuestions), [submittedQuestions]);
  const hasSubmitted =
    questions.length > 0 &&
    submittedQuestions.length > 0 &&
    (requiredQuestions.length > 0
      ? requiredQuestions.every((question) => submittedSet.has(getPollId(question)))
      : questions.every((question) => submittedSet.has(getPollId(question))));
  const hasPendingAnswers = questions.some((question) => {
    const questionId = getPollId(question);
    return Boolean(answers[questionId]) && !submittedSet.has(questionId);
  });

  const votedSet = submittedSet;

  useEffect(() => {
    const loadPoll = async () => {
      try {
        const response = await pollService.getPublicPoll(shareCode);
        setPoll(response.data?.poll || null);
        setQuestions(response.data?.questions || []);
      } catch (err) {
        setError(getErrorMessage(err, "Poll could not be loaded"));
      } finally {
        setIsLoading(false);
      }
    };

    loadPoll();
  }, [shareCode]);

  useEffect(() => {
    if (isLoading || isBootstrapping || !poll || poll.isAnonymousAllowed || isAuthenticated) {
      return;
    }

    navigate("/login", {
      replace: true,
      state: { from: location },
    });
  }, [isAuthenticated, isBootstrapping, isLoading, location, navigate, poll]);

  const markQuestionSubmitted = (questionId) => {
    setSubmittedQuestions((current) => {
      if (current.includes(questionId)) {
        return current;
      }

      return [...current, questionId];
    });
  };

  const selectAnswer = (questionId, optionId) => {
    setAnswers((current) => ({ ...current, [questionId]: optionId }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isComplete) {
      showToast({ type: "error", title: "Answer all mandatory questions first" });
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const pollId = getPollId(poll);
      const userFingerPrint = getVoterFingerprint();

      let submittedCount = 0;

      for (const question of questions) {
        const questionId = getPollId(question);

        if (votedSet.has(questionId)) {
          continue;
        }

        if (!answers[questionId]) {
          continue;
        }

        await pollService.submitVote({
          pollId,
          questionId,
          optionId: answers[questionId],
          userFingerPrint,
          firstName: voter.firstName || undefined,
          lastName: voter.lastName || undefined,
        }, {
          skipAuth: Boolean(poll?.isAnonymousAllowed),
          skipRefresh: Boolean(poll?.isAnonymousAllowed),
        });
        submittedCount += 1;
        markQuestionSubmitted(questionId);
      }

      if (submittedCount > 0) {
        showToast({ type: "success", title: "Vote submitted", message: "Thanks for participating." });
      }
    } catch (err) {
      setError(getErrorMessage(err, "Vote submission failed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || isBootstrapping) {
    return <LoadingSpinner label="Loading poll" />;
  }

  const showPublishedResults = Boolean(poll?.isResultPublished);

  return (
    <div className="page-shell">
      <Navbar />
      <main className="public-main">
        <GlassCard>
          <div className="builder-header">
            <div>
              <p className="eyebrow">Live poll</p>
              <div className="poll-title-line">
                <h1>{poll?.pollName || "Poll unavailable"}</h1>
                <StatusBadge status={poll?.status} />
              </div>
              <p>{poll?.pollDescription}</p>
              <div className="poll-meta">
                <span>Ends {formatDateTime(poll?.pollEndTime)}</span>
                {showPublishedResults ? <span>Results published</span> : null}
                <span>{poll?.isAnonymousAllowed ? "Anonymous voting allowed" : "Sign-in voting required"}</span>
              </div>
            </div>
          </div>
        </GlassCard>

        {error ? <p className="form-error">{error}</p> : null}

        {showPublishedResults ? (
          <>
            <GlassCard>
              <h2>Final results</h2>
              <div className="poll-meta">
                <span>{poll?.totalVotes || 0} votes</span>
                <span>{poll?.totalParticipants || 0} participants</span>
                <span>Published {formatDateTime(poll?.resultPublishedAt)}</span>
              </div>
            </GlassCard>

            {questions.map((question) => {
              const total = question.options.reduce((sum, option) => sum + (option.votes || 0), 0);

              return (
                <GlassCard key={getPollId(question)}>
                  <h2>
                    {question.questionNumber}. {question.question}
                  </h2>
                  <p className="muted-text">{question.isRequired === false ? "Optional" : "Mandatory"}</p>

                  <div className="analytics-list">
                    {question.options.map((option) => {
                      const percent = total > 0 ? Math.round(((option.votes || 0) / total) * 100) : 0;

                      return (
                        <div className="analytics-row" key={getOptionId(option)}>
                          <div className="analytics-label">
                            <span>{option.text}</span>
                            <strong>
                              {option.votes || 0} votes - {percent}%
                            </strong>
                          </div>
                          <div className="analytics-bar">
                            <span style={{ width: `${percent}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </GlassCard>
              );
            })}
          </>
        ) : !canVote ? (
          <GlassCard>
            <h2>This poll is not accepting votes</h2>
            <p className="muted-text">The owner has not started it yet, or it has already ended.</p>
            <Link className="text-link" to="/">
              Back home
            </Link>
          </GlassCard>
        ) : hasSubmitted ? (
          <GlassCard>
            <h2>Your vote has been recorded</h2>
            <p className="muted-text">Thanks for participating.</p>
            <Link className="text-link" to="/">
              Back home
            </Link>
          </GlassCard>
        ) : (
          <form className="public-vote-form" onSubmit={handleSubmit}>
            <GlassCard>
              <div className="section-heading">
                <p className="eyebrow">Participant</p>
                <h2>Your details</h2>
              </div>
              <div className="two-column-form">
                <label>
                  First name
                  <input
                    value={voter.firstName}
                    onChange={(event) => setVoter((current) => ({ ...current, firstName: event.target.value }))}
                    maxLength={80}
                  />
                </label>
                <label>
                  Last name
                  <input
                    value={voter.lastName}
                    onChange={(event) => setVoter((current) => ({ ...current, lastName: event.target.value }))}
                    maxLength={80}
                  />
                </label>
              </div>
            </GlassCard>

            {questions.map((question) => {
              const questionId = getPollId(question);

              return (
                <GlassCard key={questionId}>
                  <h2>
                    {question.questionNumber}. {question.question}
                  </h2>
                  <p className="muted-text">{question.isRequired === false ? "Optional" : "Mandatory"}</p>
                  <div className="option-grid">
                    {question.options.map((option) => {
                      const optionId = getOptionId(option);
                      const isSubmitted = submittedSet.has(questionId);
                      return (
                        <label className="option-tile" key={optionId}>
                          <input
                            type="radio"
                            name={questionId}
                            checked={answers[questionId] === optionId}
                            disabled={isSubmitted || isSubmitting}
                            onChange={() => selectAnswer(questionId, optionId)}
                          />
                          <span>
                            {option.text}
                            {answers[questionId] === optionId && isSubmitted ? " - recorded" : ""}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </GlassCard>
              );
            })}

            <GradientButton
              type="submit"
              isLoading={isSubmitting}
              disabled={!isComplete || !hasPendingAnswers || hasSubmitted}
            >
              Submit selected votes
            </GradientButton>
          </form>
        )}
      </main>
    </div>
  );
}

export default PublicPoll;
