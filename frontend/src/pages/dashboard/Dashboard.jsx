import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { pollService } from "../../features/polls/polls.service.js";
import { getErrorMessage } from "../../utils/errorHandler.js";

import PageWrapper from "../../components/layout/PageWrapper.jsx";
import Sidebar from "../../components/layout/Sidebar.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import GlassCard from "../../components/ui/GlassCard.jsx";
import GradientButton from "../../components/ui/GradientButton.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

function Dashboard() {
  const { user } = useAuth();
  const [polls, setPolls] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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
              <p className="stat-label">Account</p>
              <strong>{user?.email || "Signed in"}</strong>
            </GlassCard>
            <GlassCard>
              <p className="stat-label">Total polls</p>
              <strong>{polls.length}</strong>
            </GlassCard>
          </section>

          <GlassCard>
            <h2> Your Polls</h2>

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
                {polls.map((poll) => (
                  <div className="poll-row" key={poll._id}>
                    <div>
                      <h3>{poll.pollName}</h3>
                      <p>{poll.pollDescription}</p>
                      <p>Status: {poll.status}</p>
                    </div>

                    <GradientButton as={Link} to={`/polls/${poll._id}/builder`}>
                      Edit
                    </GradientButton>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </main>
      </div>
    </PageWrapper>
  );
}

export default Dashboard;
