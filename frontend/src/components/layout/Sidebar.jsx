import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <p className="sidebar-label">Workspace</p>
      <NavLink to="/dashboard">Overview</NavLink>
    </aside>
  );
}

export default Sidebar;
