import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar.jsx";
import GradientButton from "../components/ui/GradientButton.jsx";

function Home() {
  return (
    <div className="page-shell">
      <Navbar />

      <main className="home-page">
        <section className="home-copy">
          <p className="eyebrow">Live Poll</p>
          <h1>Simple polling for classrooms, teams, and events.</h1>
          <p>
            Create your account, sign in, and land in a clean dashboard ready for the next poll features.
          </p>

          <div className="hero-actions">
            <GradientButton as={Link} to="/register">
              Create account
            </GradientButton>
            <Link className="text-link" to="/login">
              Sign in
            </Link>
          </div>
        </section>

        <section className="home-preview" aria-label="Dashboard preview">
          <div className="preview-card">
            <span className="status-dot" />
            <p>Authentication ready</p>
            <strong>Dashboard access is protected by your access token.</strong>
          </div>
          <div className="preview-grid">
            <div />
            <div />
            <div />
            <div />
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
