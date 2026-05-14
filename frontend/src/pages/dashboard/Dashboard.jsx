import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { pollService } from "../../features/polls/polls.service.js";
import { getErrorMessage } from "../../utils/errorHandler.js";

import PageWrapper from "../../components/layout/PageWrapper.jsx";
import Sidebar from "../../components/layout/Sidebar.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import GlassCard from "../../components/ui/GlassCard.jsx";
import GradientButton from "../../components/ui/GradientButton.jsx";
import StatusBadge from "../../components/ui/StatusBadge.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { copyText } from "../../utils/clipboard.utils.js";
import { formatDateTime, getAnalyticsUrl, getPollId, getPublicPollUrl } from "../../utils/poll.utils.js";

function Dashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [polls, setPolls] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const totalVotes = polls.reduce((sum, poll) => sum + (poll.totalVotes || 0), 0);
  const livePolls = polls.filter((poll) => poll.status === "active").length;

  useEffect(() => {
    const loadPolls = async () => {
      try {
        const response = await pollService.getMyPolls();
        setPolls(response.data || []);
      } catch (error) {
        setError(getErrorMessage(error, "Failed to load polls"));
      } finally {
        setIsLoading(false);
      }
    };

    loadPolls();
  }, []);

  const copyToClipboard = async (value, label) => {
    if (await copyText(value)) {
      showToast({ type: "success", title: `${label} copied` });
      return;
    }

    showToast({ type: "error", title: "Copy failed", message: "Please copy the link manually." });
  };

  return (
    <PageWrapper className="dashboard-shell">
      <div className="dashboard-layout">
        <Sidebar />

        <main className="dashboard-main">
          <section className="dashboard-header">
            <div>
              <p className="eyebrow">Dashboard</p>
              <h1>Welcome{user?.name ? `, ${user.name}` : ""}</h1>
              <p>Create, manage, and share your live polls from here.</p>
            </div>
            <GradientButton as={Link} to="/polls/create">
              Create poll
            </GradientButton>
          </section>

          <section className="stats-grid">
            <GlassCard>
              <p className="stat-label">Role</p>
              <strong>{user?.role || "User"}</strong>
            </GlassCard>
            <GlassCard>
              <p className="stat-label">Live polls</p>
              <strong>{livePolls}</strong>
            </GlassCard>
            <GlassCard>
              <p className="stat-label">Total votes</p>
              <strong>{totalVotes}</strong>
            </GlassCard>
          </section>

          <GlassCard>
            <div className="card-heading">
              <div>
                <p className="eyebrow">Workspace</p>
                <h2>Your polls</h2>
              </div>
              <span>{polls.length} total</span>
            </div>

            {isLoading ? (
              <p>Loading polls...</p>
            ) : error ? (
              <p className="form-error">{error}</p>
            ) : polls.length === 0 ? (
              <EmptyState
                title="No polls created yet"
                description=" Create your first poll, add questions, then share it with voters"
                action={
                  <GradientButton as={Link} to="/polls/create">
                    Create Poll
                  </GradientButton>
                }
              />
            ) : (
              <div className="poll-list">
                {polls.map((poll) => {
                  const pollId = getPollId(poll);

                  return (
                  <div className="poll-row" key={pollId}>
                    <div className="poll-row-main">
                      <div className="poll-title-line">
                        <h3>{poll.pollName}</h3>
                        <StatusBadge status={poll.status} />
                      </div>
                      <p>{poll.pollDescription}</p>
                      <div className="poll-meta">
                        <span>{poll.pollDurationInMinutes} min</span>
                        <span>{poll.totalParticipants || 0} participants</span>
                        <span>Created {formatDateTime(poll.createdAt)}</span>
                      </div>
                    </div>

                    <div className="poll-actions">
                      {poll.status === "ended" ? (
                        <button
                          type="button"
                          className="ghost-button result-link-button"
                          onClick={() => copyToClipboard(getPublicPollUrl(poll.shareCode), "Final result link")}
                        >
                          Copy final result link
                        </button>
                      ) : (
                      <button
                        type="button"
                        className="ghost-button"
                        onClick={() => copyToClipboard(getPublicPollUrl(poll.shareCode), "Vote link")}
                      >
                        Copy vote link
                      </button>
                      )}
                      <button
                        type="button"
                        className="ghost-button"
                        onClick={() => copyToClipboard(getAnalyticsUrl(poll.analyticsCode), "Analytics link")}
                      >
                        Copy analytics
                      </button>
                      <GradientButton as={Link} to={`/polls/${pollId}/builder`}>
                        Manage
                      </GradientButton>
                    </div>
                  </div>
                  );
                })}
              </div>
            )}
          </GlassCard>
        </main>
      </div>
    </PageWrapper>
  );
}

export default Dashboard;
