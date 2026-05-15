import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import GradientButton from "../ui/GradientButton.jsx";

function Navbar({ variant = "app" }) {
  const { isAuthenticated, logout } = useAuth();
  const isLanding = variant === "landing";

  return (
    <header className={`navbar ${isLanding ? "landing-navbar" : ""}`}>
      <Link to="/" className="brand">
        PollSync
      </Link>

      <nav className="nav-links" aria-label="Main navigation">
        {isLanding ? (
          <>
            <a href="#features">Features</a>
            <a href="#analytics">Analytics</a>
            <a href="#pricing">Pricing</a>
            <NavLink to="/login">Login</NavLink>
            <GradientButton as={Link} to="/register" className="small-button">
              Get Started
            </GradientButton>
          </>
        ) : isAuthenticated ? (
          <>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/polls/create">Create</NavLink>
            <GradientButton type="button" className="small-button" onClick={logout}>
              Logout
            </GradientButton>
          </>
        ) : (
          <>
            <NavLink to="/login">Sign in</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
