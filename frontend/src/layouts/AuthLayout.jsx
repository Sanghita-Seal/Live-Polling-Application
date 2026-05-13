import { Link, Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <main className="auth-layout">
      <section className="auth-hero">
        <Link to="/" className="brand">
          Live Poll
        </Link>
        <div>
          <p className="eyebrow">Realtime decisions</p>
          <h1>Run polls, collect answers, and keep the room moving.</h1>
          <p>
            Start with secure authentication today. Poll creation, responses, and analytics can plug into this
            dashboard when the backend modules are ready.
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
