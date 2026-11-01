function Sidebar() {
  return (
    <aside className="sidebar">
      <p className="sidebar-heading">MENU</p>

      <nav className="sidebar-links" aria-label="Dashboard navigation">
        <a
          href="#dashboard"
          className="sidebar-link active"
          aria-current="page"
        >
          <span className="sidebar-indicator" aria-hidden="true"></span>
          Dashboard
        </a>

        <a href="#transactions" className="sidebar-link">
          <span className="sidebar-indicator" aria-hidden="true"></span>
          Transactions
        </a>

        <a href="#analytics" className="sidebar-link">
          <span className="sidebar-indicator" aria-hidden="true"></span>
          Analytics
        </a>
      </nav>

      <div className="sidebar-footer">
        <p>Spend smarter.</p>
        <p>Plan better.</p>
      </div>
    </aside>
  )
}

export default Sidebar