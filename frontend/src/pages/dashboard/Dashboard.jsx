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
              <p>Authentication is connected. Poll features can be added here as your backend grows.</p>
            </div>
            <GradientButton type="button">Create poll</GradientButton>
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
              title="No poll backend connected yet"
              description="When you add poll routes, create service methods and replace this area with create, vote, and result screens."
            />
          </GlassCard>
        </main>
      </div>
    </PageWrapper>
  );
}

export default Dashboard;
