import { Link } from "react-router-dom";

import PageWrapper from "../../components/layout/PageWrapper.jsx";
import Sidebar from "../../components/layout/Sidebar.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import GlassCard from "../../components/ui/GlassCard.jsx";
import GradientButton from "../../components/ui/GradientButton.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

function Dashboard() {
  const { user } = useAuth();

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
              <p className="stat-label">Poll modules</p>
              <strong>Coming next</strong>
            </GlassCard>
          </section>

          <GlassCard>
            <EmptyState
              title="No polls created yet"
              description="Create your first poll, add questions, then share it with voters."
              action={
                <GradientButton as={Link} to="/polls/create">
                  Create poll
                </GradientButton>
              }
            />
          </GlassCard>
        </main>
      </div>
    </PageWrapper>
  );
}

export default Dashboard;
