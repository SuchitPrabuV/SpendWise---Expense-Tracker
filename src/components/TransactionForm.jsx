import { useState } from "react";
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES, PAYMENT_METHODS } from "../utils/constants";
import "./TransactionForm.css";

function TransactionForm({
  onAddTransaction,
  editingTransaction = null,
  onUpdateTransaction,
  onCancelEdit,
}) {
  const isEditing = Boolean(editingTransaction);

  const [formData, setFormData] = useState(() => {
    if (editingTransaction) {
      return {
        type: editingTransaction.type || "expense",
        amount: editingTransaction.amount != null ? String(editingTransaction.amount) : "",
        category: editingTransaction.category || "Food",
        paymentMethod: editingTransaction.paymentMethod || "UPI",
        description: editingTransaction.description || "",
        date: editingTransaction.date || new Date().toISOString().split("T")[0],
      };
    }
    return {
      type: "expense",
      amount: "",
      category: "Food",
      paymentMethod: "UPI",
      description: "",
      date: new Date().toISOString().split("T")[0],
    };
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    if (name === "type") {
      const allowedCategories = value === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
      setFormData((prev) => ({
        ...prev,
        type: value,
        category: allowedCategories.includes(prev.category) ? prev.category : allowedCategories[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    setError("");
    setSuccessMessage("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    const rawAmount = String(formData.amount).trim();
    const parsedAmount = Number(rawAmount);

    if (rawAmount === "" || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid amount greater than ₹0.");
      return;
    }

    if (!formData.date || formData.date.trim() === "") {
      setError("Please select a transaction date.");
      return;
    }

    if (formData.description && formData.description.length > 150) {
      setError("Description cannot exceed 150 characters.");
      return;
    }

    const cleanedAmount = Math.round(parsedAmount * 100) / 100;

    if (isEditing && onUpdateTransaction) {
      const updatedTx = {
        ...editingTransaction,
        type: formData.type,
        amount: cleanedAmount,
        category: formData.category,
        paymentMethod: formData.paymentMethod,
        date: formData.date,
        description: formData.description.trim(),
      };
      onUpdateTransaction(updatedTx);
      setSuccessMessage("Transaction updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } else if (onAddTransaction) {
      const newTransaction = {
        id: typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `tx_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        type: formData.type,
        amount: cleanedAmount,
        category: formData.category,
        paymentMethod: formData.paymentMethod,
        date: formData.date,
        description: formData.description.trim(),
      };

      onAddTransaction(newTransaction);
      setSuccessMessage("Transaction added successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);

      setFormData({
        type: formData.type,
        amount: "",
        category: formData.type === "income" ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0],
        paymentMethod: "UPI",
        description: "",
        date: new Date().toISOString().split("T")[0],
      });
    }

    setError("");
  }

  const categoryOptions = formData.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <form className={`transaction-form ${isEditing ? "editing-mode" : ""}`} onSubmit={handleSubmit} noValidate>
      <div className="form-header">
        <h3>{isEditing ? "Edit Transaction" : "Add Transaction"}</h3>
        {isEditing && (
          <span className="editing-indicator-badge">
            Editing Record #{editingTransaction.id.slice(0, 8)}
          </span>
        )}
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="tx-type">Transaction Type</label>
          <select
            id="tx-type"
            name="type"
            value={formData.type}
            onChange={handleChange}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="tx-amount">Amount (₹)</label>
          <input
            id="tx-amount"
            name="amount"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="e.g. 500.00"
            value={formData.amount}
            onChange={handleChange}
            required
            aria-required="true"
          />
        </div>

        <div className="form-group">
          <label htmlFor="tx-category">Category</label>
          <select
            id="tx-category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="tx-paymentMethod">Payment Method</label>
          <select
            id="tx-paymentMethod"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
          >
            {PAYMENT_METHODS.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="tx-date">Date</label>
          <input
            id="tx-date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            required
            aria-required="true"
          />
        </div>

        <div className="form-group">
          <label htmlFor="tx-description">Description (optional)</label>
          <input
            id="tx-description"
            name="description"
            type="text"
            placeholder="e.g. Lunch at college or Monthly stipend"
            value={formData.description}
            onChange={handleChange}
            maxLength={150}
          />
        </div>
      </div>

      {error && (
        <div className="form-alert form-alert-error" role="alert" aria-live="polite">
          <span className="alert-icon">⚠️</span> {error}
        </div>
      )}

      {successMessage && (
        <div className="form-alert form-alert-success" role="status" aria-live="polite">
          <span className="alert-icon">✓</span> {successMessage}
        </div>
      )}

      <div className="form-actions">
        <button className="submit-transaction" type="submit">
          {isEditing ? "Save Changes" : "Add Transaction"}
        </button>
        {isEditing && (
          <button
            type="button"
            className="cancel-button"
            onClick={onCancelEdit}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default TransactionForm;
