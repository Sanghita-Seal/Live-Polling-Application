import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../../components/layout/Navbar.jsx";
import GlassCard from "../../components/ui/GlassCard.jsx";
import LoadingSpinner from "../../components/ui/LoadingSpinner.jsx";
import StatusBadge from "../../components/ui/StatusBadge.jsx";
import { pollService } from "../../features/polls/polls.service.js";
import { getErrorMessage } from "../../utils/errorHandler.js";
import { formatDateTime } from "../../utils/poll.utils.js";

function PollAnalytics() {
  const { analyticsCode } = useParams();
  const [poll, setPoll] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const response = await pollService.getAnalytics(analyticsCode);
        setPoll(response.data?.poll || null);
        setQuestions(response.data?.questions || []);
      } catch (err) {
        setError(getErrorMessage(err, "Analytics could not be loaded"));
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalytics();
  }, [analyticsCode]);

  if (isLoading) {
    return <LoadingSpinner label="Loading analytics" />;
  }

  return (
    <div className="page-shell">
      <Navbar />
      <main className="public-main">
        <GlassCard>
          <div className="builder-header">
            <div>
              <p className="eyebrow">Analytics</p>
              <div className="poll-title-line">
                <h1>{poll?.pollName || "Poll analytics"}</h1>
                <StatusBadge status={poll?.status} />
              </div>
              <p>{poll?.pollDescription}</p>
              <div className="poll-meta">
                <span>{poll?.totalVotes || 0} votes</span>
                <span>{poll?.totalParticipants || 0} participants</span>
                <span>Started {formatDateTime(poll?.pollStartTime)}</span>
              </div>
            </div>
          </div>
        </GlassCard>

        {error ? <p className="form-error">{error}</p> : null}

        {questions.map((question) => {
          const total = question.options.reduce((sum, option) => sum + (option.votes || 0), 0);

          return (
            <GlassCard key={question.id}>
              <h2>
                {question.questionNumber}. {question.question}
              </h2>

              <div className="analytics-list">
                {question.options.map((option) => {
                  const percent = total > 0 ? Math.round(((option.votes || 0) / total) * 100) : 0;

                  return (
                    <div className="analytics-row" key={option.id}>
                      <div className="analytics-label">
                        <span>{option.text}</span>
                        <strong>
                          {option.votes || 0} votes · {percent}%
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

        {!error && questions.length === 0 ? (
          <GlassCard>
            <h2>No questions found</h2>
            <p className="muted-text">Analytics will appear after questions are added to this poll.</p>
          </GlassCard>
        ) : null}

        <Link className="text-link" to="/">
          Back home
        </Link>
      </main>
    </div>
  );
}

export default PollAnalytics;
