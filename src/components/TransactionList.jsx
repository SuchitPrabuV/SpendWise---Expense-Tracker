import { useState, useMemo } from "react";
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES, PAYMENT_METHODS } from "../utils/constants";
import { formatCurrency, formatDisplayDate } from "../utils/financeCalculations";
import "./TransactionList.css";

function TransactionList({
  transactions = [],
  onDeleteTransaction,
  onEditTransaction,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Confirm delete modal state
  const [txToDelete, setTxToDelete] = useState(null);

  // Available categories for filtering
  const availableCategories = useMemo(() => {
    if (typeFilter === "income") return INCOME_CATEGORIES;
    if (typeFilter === "expense") return EXPENSE_CATEGORIES;
    return Array.from(new Set([...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES]));
  }, [typeFilter]);

  // Reset category filter if it no longer belongs to the selected type
  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setTypeFilter(newType);
    if (categoryFilter !== "all") {
      const validCats =
        newType === "income"
          ? INCOME_CATEGORIES
          : newType === "expense"
          ? EXPENSE_CATEGORIES
          : [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];
      if (!validCats.includes(categoryFilter)) {
        setCategoryFilter("all");
      }
    }
    setCurrentPage(1);
  };

  // Filtered and sorted transactions
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((tx) => {
        // Search filter (description, category, payment method)
        if (searchTerm.trim() !== "") {
          const term = searchTerm.toLowerCase();
          const descMatch = (tx.description || "").toLowerCase().includes(term);
          const catMatch = (tx.category || "").toLowerCase().includes(term);
          const payMatch = (tx.paymentMethod || "").toLowerCase().includes(term);
          if (!descMatch && !catMatch && !payMatch) return false;
        }

        // Type filter
        if (typeFilter !== "all" && tx.type !== typeFilter) {
          return false;
        }

        // Category filter
        if (categoryFilter !== "all" && tx.category !== categoryFilter) {
          return false;
        }

        // Payment method filter
        if (paymentFilter !== "all" && tx.paymentMethod !== paymentFilter) {
          return false;
        }

        // Date range filter
        if (startDate && tx.date < startDate) {
          return false;
        }
        if (endDate && tx.date > endDate) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "date-desc") {
          return b.date.localeCompare(a.date) || b.id.localeCompare(a.id);
        }
        if (sortBy === "date-asc") {
          return a.date.localeCompare(b.date) || a.id.localeCompare(b.id);
        }
        if (sortBy === "amount-desc") {
          return b.amount - a.amount;
        }
        if (sortBy === "amount-asc") {
          return a.amount - b.amount;
        }
        return 0;
      });
  }, [
    transactions,
    searchTerm,
    typeFilter,
    categoryFilter,
    paymentFilter,
    startDate,
    endDate,
    sortBy,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTransactions, safeCurrentPage, itemsPerPage]);

  function handleResetFilters() {
    setSearchTerm("");
    setTypeFilter("all");
    setCategoryFilter("all");
    setPaymentFilter("all");
    setStartDate("");
    setEndDate("");
    setSortBy("date-desc");
    setCurrentPage(1);
  }

  const hasActiveFilters =
    searchTerm !== "" ||
    typeFilter !== "all" ||
    categoryFilter !== "all" ||
    paymentFilter !== "all" ||
    startDate !== "" ||
    endDate !== "" ||
    sortBy !== "date-desc";

  function confirmDelete() {
    if (txToDelete && onDeleteTransaction) {
      onDeleteTransaction(txToDelete.id);
      setTxToDelete(null);
    }
  }

  return (
    <div className="transaction-history-container">
      <div className="history-header">
        <div>
          <h3>Transaction History</h3>
          <p className="history-subtitle">
            Showing {filteredTransactions.length} {filteredTransactions.length === 1 ? "record" : "records"}
            {transactions.length !== filteredTransactions.length && ` (filtered from ${transactions.length} total)`}
          </p>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            className="clear-filters-btn"
            onClick={handleResetFilters}
          >
            Clear Filters ✕
          </button>
        )}
      </div>

      {/* Search, Filter and Sort Controls */}
      <div className="controls-panel">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by description, category, or payment method..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Search transactions"
          />
          {searchTerm && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearchTerm("")}
              aria-label="Clear search text"
            >
              ✕
            </button>
          )}
        </div>

        <div className="filters-grid">
          <div className="control-group">
            <label htmlFor="filter-type">Type</label>
            <select
              id="filter-type"
              value={typeFilter}
              onChange={handleTypeChange}
            >
              <option value="all">All Types</option>
              <option value="expense">Expenses Only</option>
              <option value="income">Income Only</option>
            </select>
          </div>

          <div className="control-group">
            <label htmlFor="filter-category">Category</label>
            <select
              id="filter-category"
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All Categories</option>
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label htmlFor="filter-payment">Payment Method</label>
            <select
              id="filter-payment"
              value={paymentFilter}
              onChange={(e) => {
                setPaymentFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All Methods</option>
              {PAYMENT_METHODS.map((pm) => (
                <option key={pm} value={pm}>
                  {pm}
                </option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label htmlFor="filter-sort">Sort By</label>
            <select
              id="filter-sort"
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
            </select>
          </div>

          <div className="control-group">
            <label htmlFor="filter-start-date">From Date</label>
            <input
              id="filter-start-date"
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="control-group">
            <label htmlFor="filter-end-date">To Date</label>
            <input
              id="filter-end-date"
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {/* Transaction Table / List */}
      {transactions.length === 0 ? (
        <div className="empty-history-state">
          <div className="empty-icon" aria-hidden="true">💸</div>
          <h4>No Transactions Yet</h4>
          <p>You haven't recorded any income or expenses yet. Use the form above to add your first transaction.</p>
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="empty-history-state">
          <div className="empty-icon" aria-hidden="true">🔍</div>
          <h4>No Transactions Match Your Filters</h4>
          <p>Try adjusting your search keywords, category, payment method, or date range.</p>
          <button type="button" className="btn-secondary" onClick={handleResetFilters}>
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="table-responsive-wrapper">
          <table className="transaction-table">
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Description</th>
                <th scope="col">Category</th>
                <th scope="col">Payment Method</th>
                <th scope="col">Type</th>
                <th scope="col" className="text-right">Amount</th>
                <th scope="col" className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.map((tx) => {
                const isIncome = tx.type === "income";
                return (
                  <tr key={tx.id} className={`tx-row tx-row-${tx.type}`}>
                    <td className="tx-cell-date">
                      {formatDisplayDate(tx.date)}
                    </td>
                    <td className="tx-cell-desc">
                      <span className="desc-text" title={tx.description || tx.category}>
                        {tx.description || tx.category}
                      </span>
                    </td>
                    <td>
                      <span className="badge category-badge">
                        {tx.category}
                      </span>
                    </td>
                    <td>
                      <span className="badge payment-badge">
                        {tx.paymentMethod}
                      </span>
                    </td>
                    <td>
                      <span className={`badge type-badge ${isIncome ? "type-income" : "type-expense"}`}>
                        {isIncome ? "Income" : "Expense"}
                      </span>
                    </td>
                    <td className={`tx-cell-amount text-right ${isIncome ? "amount-income" : "amount-expense"}`}>
                      {isIncome ? "+" : "−"}{formatCurrency(tx.amount)}
                    </td>
                    <td className="tx-cell-actions text-center">
                      <div className="actions-wrapper">
                        <button
                          type="button"
                          className="action-btn edit-btn"
                          onClick={() => onEditTransaction && onEditTransaction(tx)}
                          title={`Edit ${tx.description || tx.category}`}
                          aria-label={`Edit transaction ${tx.description || tx.category}`}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="action-btn delete-btn"
                          onClick={() => setTxToDelete(tx)}
                          title={`Delete ${tx.description || tx.category}`}
                          aria-label={`Delete transaction ${tx.description || tx.category}`}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination-bar">
          <span className="pagination-info">
            Page {safeCurrentPage} of {totalPages}
          </span>
          <div className="pagination-buttons">
            <button
              type="button"
              className="page-btn"
              disabled={safeCurrentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                className={`page-btn ${pageNum === safeCurrentPage ? "active" : ""}`}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </button>
            ))}
            <button
              type="button"
              className="page-btn"
              disabled={safeCurrentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {txToDelete && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="modal-content">
            <h4 id="modal-title">Confirm Delete Transaction</h4>
            <p>
              Are you sure you want to delete this transaction record?
            </p>
            <div className="delete-tx-summary">
              <strong>{txToDelete.description || txToDelete.category}</strong>
              <div className="delete-tx-meta">
                <span>{formatDisplayDate(txToDelete.date)}</span>
                <span>•</span>
                <span>{txToDelete.paymentMethod}</span>
                <span>•</span>
                <span className={txToDelete.type === "income" ? "amount-income" : "amount-expense"}>
                  {txToDelete.type === "income" ? "+" : "−"}{formatCurrency(txToDelete.amount)}
                </span>
              </div>
            </div>
            <p className="modal-warning">This action cannot be undone.</p>
            <div className="modal-actions">
              <button
                type="button"
                className="btn-modal-cancel"
                onClick={() => setTxToDelete(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-modal-delete"
                onClick={confirmDelete}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TransactionList;
