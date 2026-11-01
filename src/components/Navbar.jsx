function Navbar() {
  return (
    <header className="navbar">
      <a href="#dashboard" className="navbar-brand">
        SpendWise<span>.</span>
      </a>

      <nav className="navbar-links" aria-label="Main navigation">
        <a href="#dashboard">Dashboard</a>
        <a href="#transactions">Transactions</a>
        <a href="#analytics">Analytics</a>
      </nav>
    </header>
  )
}

export default Navbar