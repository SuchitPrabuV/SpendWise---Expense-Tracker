function Sidebar({
  activePage = "dashboard",
  onNavigate,
  isDemoMode = false,
  onLoadDemo,
  onResetData,
}) {
  return (
    <aside className="sidebar">
      <nav className="sidebar-links" aria-label="Main navigation">
        <button
          type="button"
          className={`sidebar-link ${activePage === "dashboard" ? "active" : ""}`}
          aria-current={activePage === "dashboard" ? "page" : undefined}
          onClick={() => onNavigate("dashboard")}
        >
          <span className="sidebar-indicator" aria-hidden="true"></span>
          Dashboard
        </button>

        <button
          type="button"
          className={`sidebar-link ${activePage === "transactions" ? "active" : ""}`}
          aria-current={activePage === "transactions" ? "page" : undefined}
          onClick={() => onNavigate("transactions")}
        >
          <span className="sidebar-indicator" aria-hidden="true"></span>
          Transactions
        </button>

        <button
          type="button"
          className={`sidebar-link ${activePage === "analytics" ? "active" : ""}`}
          aria-current={activePage === "analytics" ? "page" : undefined}
          onClick={() => onNavigate("analytics")}
        >
          <span className="sidebar-indicator" aria-hidden="true"></span>
          Analytics
        </button>
      </nav>

      <div className="sidebar-manage-box">
        {isDemoMode ? (
          <button
            type="button"
            className="sidebar-action-btn sidebar-btn-clear"
            onClick={onResetData}
            title="Switch back to empty personal ledger"
          >
            Clear Demo Data
          </button>
        ) : (
          <>
            <button
              type="button"
              className="sidebar-action-btn sidebar-btn-demo"
              onClick={onLoadDemo}
              title="Load sample transactions"
            >
              Load Demo Data
            </button>
            <button
              type="button"
              className="sidebar-action-btn sidebar-btn-clear"
              onClick={onResetData}
              title="Delete all stored transactions"
            >
              Reset All Data
            </button>
          </>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
