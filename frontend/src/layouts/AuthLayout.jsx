import { Link, Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <main className="auth-layout">
      <section className="auth-hero">
        <Link to="/" className="brand">
          PollSync
        </Link>
        <div>
          <p className="eyebrow">Realtime decisions</p>
          <h1>Run polls, collect answers, and keep the room moving.</h1>
          <p>
            Secure accounts, shareable live polls, public voting, and analytics all mapped to your backend API.
          </p>
        </div>
      </section>

      <section className="auth-panel">
        <Outlet />
      </section>
    </main>
  );
}

export default AuthLayout;
