import Navbar from "./Navbar.jsx";

function PageWrapper({ children, className = "" }) {
  return (
    <div className={`page-shell ${className}`}>
      <Navbar />
      {children}
    </div>
  );
}

export default PageWrapper;
