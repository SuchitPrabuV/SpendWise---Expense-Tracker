function Navbar({ activePage = "dashboard", onNavigate }) {
  return (
    <header className="navbar">
      <button
        type="button"
        className="navbar-brand-btn"
        onClick={() => onNavigate("dashboard")}
      >
        SpendWise<span>.</span>
      </button>

      <nav className="navbar-links" aria-label="Main navigation">
        <button
          type="button"
          className={`nav-btn ${activePage === "dashboard" ? "nav-btn-active" : ""}`}
          aria-current={activePage === "dashboard" ? "page" : undefined}
          onClick={() => onNavigate("dashboard")}
        >
          Dashboard
        </button>
        <button
          type="button"
          className={`nav-btn ${activePage === "transactions" ? "nav-btn-active" : ""}`}
          aria-current={activePage === "transactions" ? "page" : undefined}
          onClick={() => onNavigate("transactions")}
        >
          Transactions
        </button>
        <button
          type="button"
          className={`nav-btn ${activePage === "analytics" ? "nav-btn-active" : ""}`}
          aria-current={activePage === "analytics" ? "page" : undefined}
          onClick={() => onNavigate("analytics")}
        >
          Analytics
        </button>
      </nav>
    </header>
  );
}

export default Navbar;
