import { useState, useEffect, useMemo, useRef } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import SummaryCards from "./components/SummaryCards";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import ExpenseChart from "./components/ExpenseChart";
import {
  calculateTotalIncome,
  calculateTotalExpenses,
  calculateRemainingBalance,
  calculateUpiSpending,
  calculateCategoryTotals,
  filterTransactionsByPeriod,
  formatCurrency,
  formatDisplayDate,
} from "./utils/financeCalculations";
import {
  loadStoredTransactions,
  saveStoredTransactions,
  clearStoredTransactions,
  isStoredDemoMode,
  setStoredDemoMode,
  DEMO_TRANSACTIONS,
} from "./utils/storage";
import { PERIOD_LABELS, CATEGORY_COLORS } from "./utils/constants";
import "./App.css";

function App() {
  // Page Routing: 'dashboard' | 'transactions' | 'analytics'
  const [activePage, setActivePage] = useState(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "");
      if (["dashboard", "transactions", "analytics"].includes(hash)) {
        return hash;
      }
    }
    return "dashboard";
  });

  // Authoritative transactions state initialized from localStorage or demo data
  const [transactions, setTransactions] = useState(() => {
    const saved = loadStoredTransactions();
    if (saved && saved.length > 0) {
      return saved;
    }
    const isDemo = isStoredDemoMode();
    const isFirstVisit =
      typeof window !== "undefined" &&
      !localStorage.getItem("spendwise_first_visit_done");
    if (isDemo || isFirstVisit) {
      setStoredDemoMode(true);
      if (typeof window !== "undefined") {
        localStorage.setItem("spendwise_first_visit_done", "true");
      }
      return DEMO_TRANSACTIONS;
    }
    return [];
  });

  const [isDemoMode, setIsDemoMode] = useState(() => isStoredDemoMode());
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [summaryPeriod, setSummaryPeriod] = useState("this_month");
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const formRef = useRef(null);

  // Sync hash changes with page state
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (["dashboard", "transactions", "analytics"].includes(hash)) {
        setActivePage(hash);
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    saveStoredTransactions(transactions);
  }, [transactions]);

  useEffect(() => {
    setStoredDemoMode(isDemoMode);
  }, [isDemoMode]);

  // Navigate to page and update hash
  const handleNavigate = (page) => {
    setActivePage(page);
    if (typeof window !== "undefined") {
      window.location.hash = page;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Add transaction
  const handleAddTransaction = (newTx) => {
    setTransactions((prev) => [newTx, ...prev]);
    if (isDemoMode) {
      setIsDemoMode(false);
    }
  };

  // Edit transaction
  const handleStartEdit = (tx) => {
    setEditingTransaction(tx);
    if (activePage !== "transactions") {
      handleNavigate("transactions");
    }
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 50);
  };

  const handleUpdateTransaction = (updatedTx) => {
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === updatedTx.id ? updatedTx : tx))
    );
    setEditingTransaction(null);
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
  };

  // Delete transaction
  const handleDeleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
    if (editingTransaction?.id === id) {
      setEditingTransaction(null);
    }
  };

  // Demo & Reset handlers
  const handleLoadDemoData = () => {
    setTransactions(DEMO_TRANSACTIONS);
    setIsDemoMode(true);
    setEditingTransaction(null);
  };

  const handleConfirmReset = () => {
    clearStoredTransactions();
    setTransactions([]);
    setIsDemoMode(false);
    setEditingTransaction(null);
    setShowResetConfirm(false);
  };

  // Dashboard financial metrics
  const filteredSummaryTransactions = useMemo(() => {
    return filterTransactionsByPeriod(transactions, summaryPeriod);
  }, [transactions, summaryPeriod]);

  const totalIncome = useMemo(
    () => calculateTotalIncome(filteredSummaryTransactions),
    [filteredSummaryTransactions]
  );
  const totalExpenses = useMemo(
    () => calculateTotalExpenses(filteredSummaryTransactions),
    [filteredSummaryTransactions]
  );
  const balance = useMemo(
    () => calculateRemainingBalance(totalIncome, totalExpenses),
    [totalIncome, totalExpenses]
  );
  const upiSpending = useMemo(
    () => calculateUpiSpending(filteredSummaryTransactions),
    [filteredSummaryTransactions]
  );

  // Recent 5 transactions for Dashboard preview
  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id))
      .slice(0, 5);
  }, [transactions]);

  // Dashboard top spending highlights
  const topExpenseCategories = useMemo(() => {
    const totals = calculateCategoryTotals(filteredSummaryTransactions, "expense");
    return Object.entries(totals)
      .map(([cat, amt]) => ({
        category: cat,
        amount: amt,
        pct: totalExpenses > 0 ? ((amt / totalExpenses) * 100).toFixed(0) : 0,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 4);
  }, [filteredSummaryTransactions, totalExpenses]);

  return (
    <div className="app">
      <Navbar activePage={activePage} onNavigate={handleNavigate} />

      <div className="app-layout">
        <Sidebar
          activePage={activePage}
          onNavigate={handleNavigate}
          isDemoMode={isDemoMode}
          onLoadDemo={handleLoadDemoData}
          onResetData={() => setShowResetConfirm(true)}
        />

        <main className="main-content">
          {/* ================= PAGE 1: DASHBOARD ================= */}
          {activePage === "dashboard" && (
            <div className="page-view">
              <div className="page-header">
                <div>
                  <h1>Dashboard</h1>
                </div>

                <div className="dashboard-header-right">
                  <div className="period-pill-picker">
                    <label htmlFor="dashboard-period" className="picker-label">
                      Timeframe:
                    </label>
                    <select
                      id="dashboard-period"
                      value={summaryPeriod}
                      onChange={(e) => setSummaryPeriod(e.target.value)}
                      className="summary-period-dropdown"
                    >
                      <option value="this_month">This Month</option>
                      <option value="today">Today</option>
                      <option value="this_week">This Week</option>
                      <option value="this_year">This Year</option>
                      <option value="all">All Time</option>
                    </select>
                  </div>

                  {isDemoMode ? (
                    <span className="demo-badge demo-badge-active">
                      DEMO DATA
                    </span>
                  ) : (
                    <span className="demo-badge demo-badge-personal">
                      PERSONAL LEDGER
                    </span>
                  )}
                </div>
              </div>

              <SummaryCards
                totalIncome={totalIncome}
                totalExpenses={totalExpenses}
                balance={balance}
                upiSpending={upiSpending}
                periodLabel={PERIOD_LABELS[summaryPeriod] || "This Month"}
              />

              {/* Dashboard Quick Hub */}
              <div className="dashboard-hub-grid">
                {/* Recent Transactions Widget */}
                <div className="hub-card">
                  <div className="hub-card-header">
                    <h3>Recent Transactions</h3>
                    <button
                      type="button"
                      className="hub-link-btn"
                      onClick={() => handleNavigate("transactions")}
                    >
                      View All →
                    </button>
                  </div>

                  {recentTransactions.length === 0 ? (
                    <div className="hub-empty">
                      <p>No transactions recorded yet.</p>
                      <button
                        type="button"
                        className="btn-accent-sm"
                        onClick={() => handleNavigate("transactions")}
                      >
                        + Add Transaction
                      </button>
                    </div>
                  ) : (
                    <div className="hub-table-wrapper">
                      <table className="hub-table">
                        <tbody>
                          {recentTransactions.map((tx) => (
                            <tr key={tx.id}>
                              <td className="hub-cell-date">
                                {formatDisplayDate(tx.date)}
                              </td>
                              <td className="hub-cell-title">
                                <strong>{tx.description || tx.category}</strong>
                                <span className="hub-subtext">
                                  {tx.category} • {tx.paymentMethod}
                                </span>
                              </td>
                              <td
                                className={`hub-cell-amt ${
                                  tx.type === "income" ? "text-income" : "text-expense"
                                }`}
                              >
                                {tx.type === "income" ? "+" : "−"}
                                {formatCurrency(tx.amount)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Spending Highlights Widget */}
                <div className="hub-card">
                  <div className="hub-card-header">
                    <h3>Top Spending Categories</h3>
                    <button
                      type="button"
                      className="hub-link-btn"
                      onClick={() => handleNavigate("analytics")}
                    >
                      Analytics →
                    </button>
                  </div>

                  {topExpenseCategories.length === 0 ? (
                    <div className="hub-empty">
                      <p>No expenses recorded for this timeframe.</p>
                    </div>
                  ) : (
                    <div className="hub-bars-list">
                      {topExpenseCategories.map((item, idx) => (
                        <div key={item.category} className="hub-bar-item">
                          <div className="hub-bar-labels">
                            <span className="hub-bar-name">{item.category}</span>
                            <span className="hub-bar-val">
                              {formatCurrency(item.amount)} ({item.pct}%)
                            </span>
                          </div>
                          <div className="hub-bar-track">
                            <div
                              className="hub-bar-fill"
                              style={{
                                width: `${Math.min(100, Math.max(5, item.pct))}%`,
                                backgroundColor:
                                  CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================= PAGE 2: TRANSACTIONS ================= */}
          {activePage === "transactions" && (
            <div className="page-view" ref={formRef}>
              <div className="page-header">
                <h1>Transactions</h1>
              </div>

              <TransactionForm
                key={editingTransaction ? editingTransaction.id : "new"}
                onAddTransaction={handleAddTransaction}
                editingTransaction={editingTransaction}
                onUpdateTransaction={handleUpdateTransaction}
                onCancelEdit={handleCancelEdit}
              />

              <TransactionList
                transactions={transactions}
                onDeleteTransaction={handleDeleteTransaction}
                onEditTransaction={handleStartEdit}
              />
            </div>
          )}

          {/* ================= PAGE 3: ANALYTICS ================= */}
          {activePage === "analytics" && (
            <div className="page-view">
              <ExpenseChart transactions={transactions} />
            </div>
          )}
        </main>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-modal-title"
        >
          <div className="modal-content">
            <h4 id="reset-modal-title">Clear All Transactions?</h4>
            <p>
              This will permanently delete all stored transactions.
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="btn-modal-cancel"
                onClick={() => setShowResetConfirm(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-modal-delete"
                onClick={handleConfirmReset}
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
