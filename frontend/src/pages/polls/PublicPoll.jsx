import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../../components/layout/Navbar.jsx";
import GlassCard from "../../components/ui/GlassCard.jsx";
import GradientButton from "../../components/ui/GradientButton.jsx";
import LoadingSpinner from "../../components/ui/LoadingSpinner.jsx";
import StatusBadge from "../../components/ui/StatusBadge.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { pollService } from "../../features/polls/polls.service.js";
import { getErrorMessage } from "../../utils/errorHandler.js";
import { formatDateTime, getOptionId, getPollId, getVoterFingerprint } from "../../utils/poll.utils.js";

function PublicPoll() {
  const { shareCode } = useParams();
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
  const answeredCount = Object.keys(answers).length;
  const isComplete = questions.length > 0 && answeredCount === questions.length;
  const hasSubmitted = questions.length > 0 && submittedQuestions.length === questions.length;

  const votedSet = useMemo(() => new Set(submittedQuestions), [submittedQuestions]);

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

  const selectAnswer = (questionId, optionId) => {
    setAnswers((current) => ({ ...current, [questionId]: optionId }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isComplete) {
      showToast({ type: "error", title: "Answer every question first" });
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const pollId = getPollId(poll);
      const userFingerPrint = getVoterFingerprint();

      for (const question of questions) {
        const questionId = getPollId(question);

        if (votedSet.has(questionId)) {
          continue;
        }

        await pollService.submitVote({
          pollId,
          questionId,
          optionId: answers[questionId],
          userFingerPrint,
          firstName: voter.firstName || undefined,
          lastName: voter.lastName || undefined,
        });
        setSubmittedQuestions((current) => [...current, questionId]);
      }

      showToast({ type: "success", title: "Vote submitted", message: "Thanks for participating." });
    } catch (err) {
      setError(getErrorMessage(err, "Vote submission failed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner label="Loading poll" />;
  }

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
                <span>{poll?.isAnonymousAllowed ? "Anonymous voting allowed" : "Sign-in voting required"}</span>
              </div>
            </div>
          </div>
        </GlassCard>

        {error ? <p className="form-error">{error}</p> : null}

        {!canVote ? (
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
                  <div className="option-grid">
                    {question.options.map((option) => {
                      const optionId = getOptionId(option);
                      return (
                        <label className="option-tile" key={optionId}>
                          <input
                            type="radio"
                            name={questionId}
                            checked={answers[questionId] === optionId}
                            onChange={() => selectAnswer(questionId, optionId)}
                          />
                          <span>{option.text}</span>
                        </label>
                      );
                    })}
                  </div>
                </GlassCard>
              );
            })}

            <GradientButton type="submit" isLoading={isSubmitting} disabled={!isComplete || hasSubmitted}>
              Submit vote
            </GradientButton>
          </form>
        )}
      </main>
    </div>
  );
}

export default PublicPoll;
