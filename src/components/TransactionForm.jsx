import { useState } from "react";
import "./TransactionForm.css";

function TransactionForm({ onAddTransaction }) {
  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    category: "Food",
    paymentMethod: "UPI",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    const amount = Number(formData.amount);

    if (
      formData.amount.trim() === "" ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      setError("Enter a valid amount greater than zero.");
      return;
    }

    if (!formData.date) {
      setError("Please select a date.");
      return;
    }

    const newTransaction = {
      id: crypto.randomUUID(),
      ...formData,
      amount,
    };

    onAddTransaction(newTransaction);

    setFormData({
      type: "expense",
      amount: "",
      category: "Food",
      paymentMethod: "UPI",
      description: "",
      date: new Date().toISOString().split("T")[0],
    });

    setError("");
  }

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <h3>Add Transaction</h3>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="type">Transaction Type</label>

          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount (₹)</label>

          <input
            id="amount"
            name="amount"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="Enter amount"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>

          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="Salary">Salary</option>
            <option value="Allowance">Allowance</option>
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Shopping">Shopping</option>
            <option value="Education">Education</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="paymentMethod">Payment Method</label>

          <select
            id="paymentMethod"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
          >
            <option value="UPI">UPI</option>
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="date">Date</label>

          <input
            id="date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>

          <input
            id="description"
            name="description"
            type="text"
            placeholder="e.g. Lunch at college"
            value={formData.description}
            onChange={handleChange}
            maxLength={150}
          />
        </div>
      </div>

      {error && <p className="form-error">{error}</p>}

      <button className="submit-transaction" type="submit">
        Add Transaction
      </button>
    </form>
  );
}

export default TransactionForm;