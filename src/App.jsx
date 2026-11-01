import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import SummaryCards from './components/SummaryCards'
import './App.css'
import { useState } from "react";
import TransactionForm from "./components/TransactionForm";

function App() {
  const [transactions, setTransactions] = useState([]);

  function handleAddTransaction(transaction) {
    setTransactions((previousTransactions) => [
      transaction,
      ...previousTransactions,
    ]);
  }

  return (
    <div className="app">
      <Navbar />

      <div className="app-layout">
        <Sidebar />

        <main className="main-content">
          <section id="dashboard" className="dashboard-section">
            <div className="page-header">
              <div>
                <p className="page-eyebrow">YOUR FINANCES</p>
                <h1>Dashboard</h1>
                <p className="page-description">
                  Track your money and understand your spending.
                </p>
              </div>

              <span className="demo-badge">DEMO DATA</span>
            </div>

            <SummaryCards />
          </section>

          <section id="transactions" className="placeholder-section">
            <h2>Transactions</h2>
            <TransactionForm onAddTransaction={handleAddTransaction} />
            {transactions.length > 0 && (
              <ul className="transaction-list">
                {transactions.map((transaction) => (
                  <li key={transaction.id}>
                    <span>
                      {transaction.description || transaction.category} · {transaction.date}
                    </span>
                    <strong>
                      {transaction.type === "income" ? "+" : "−"}₹
                      {transaction.amount.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </strong>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section id="analytics" className="placeholder-section">
            <h2>Analytics</h2>
            <p>
              Your spending charts will appear here when we build
              the analytics module.
            </p>
          </section>
        </main>
      </div>
    </div>
  )
}

export default App
