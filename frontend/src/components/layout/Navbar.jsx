import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import GradientButton from "../ui/GradientButton.jsx";

function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        Live Poll
      </Link>

      <nav className="nav-links" aria-label="Main navigation">
        {isAuthenticated ? (
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
