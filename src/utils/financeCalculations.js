/**
 * SpendWise Financial Calculations Utility
 * Reusable functions for calculating income, expenses, balances,
 * UPI spending, category breakdowns, and time-based aggregates.
 */

/**
 * Format a date string (YYYY-MM-DD) into consistent readable display (e.g. 01 Nov 2026)
 */
export function formatDisplayDate(dateString) {
  if (!dateString) return "";
  const parts = dateString.split("-");
  if (parts.length === 3) {
    const [year, month, day] = parts;
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const monthIndex = parseInt(month, 10) - 1;
    if (monthIndex >= 0 && monthIndex < 12) {
      return `${day.padStart(2, "0")} ${months[monthIndex]} ${year}`;
    }
  }
  const dateObj = new Date(dateString);
  if (!isNaN(dateObj.getTime())) {
    return dateObj.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }
  return dateString;
}

/**
 * Format a number into Indian Rupee format (e.g. ₹1,25,000.00)
 */
export function formatCurrency(amount) {
  const num = Number(amount) || 0;
  const isNegative = num < 0;
  const absFormatted = Math.abs(num).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${isNegative ? "−" : ""}₹${absFormatted}`;
}

/**
 * Sum of all income transactions
 */
export function calculateTotalIncome(transactions = []) {
  if (!Array.isArray(transactions)) return 0;
  const sum = transactions
    .filter((tx) => tx?.type === "income")
    .reduce((acc, tx) => acc + (Number(tx.amount) || 0), 0);
  return Math.round(sum * 100) / 100;
}

/**
 * Sum of all expense transactions
 */
export function calculateTotalExpenses(transactions = []) {
  if (!Array.isArray(transactions)) return 0;
  const sum = transactions
    .filter((tx) => tx?.type === "expense")
    .reduce((acc, tx) => acc + (Number(tx.amount) || 0), 0);
  return Math.round(sum * 100) / 100;
}

/**
 * Remaining balance = Total Income - Total Expenses
 */
export function calculateRemainingBalance(totalIncome, totalExpenses) {
  const income = Number(totalIncome) || 0;
  const expenses = Number(totalExpenses) || 0;
  return Math.round((income - expenses) * 100) / 100;
}

/**
 * Total spent through UPI (Expense type ONLY; income through UPI does not count)
 */
export function calculateUpiSpending(transactions = []) {
  if (!Array.isArray(transactions)) return 0;
  const sum = transactions
    .filter((tx) => tx?.type === "expense" && tx?.paymentMethod === "UPI")
    .reduce((acc, tx) => acc + (Number(tx.amount) || 0), 0);
  return Math.round(sum * 100) / 100;
}

/**
 * Helper to get the start of the current week (Monday)
 */
function getStartOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Filter transactions by selected period:
 * - 'today'
 * - 'this_week'
 * - 'this_month'
 * - 'last_month'
 * - 'last_3_months'
 * - 'this_year'
 * - 'all'
 * - 'custom' (requires customStart and customEnd)
 */
export function filterTransactionsByPeriod(
  transactions = [],
  period = "this_month",
  customStart = "",
  customEnd = ""
) {
  if (!Array.isArray(transactions) || period === "all") return transactions || [];

  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed

  const formatYearMonth = (y, m) =>
    `${y}-${String(m + 1).padStart(2, "0")}`;

  return transactions.filter((tx) => {
    if (!tx || !tx.date) return false;
    const txDate = tx.date;

    switch (period) {
      case "today":
        return txDate === todayStr;

      case "this_week": {
        const startOfWeekStr = getStartOfWeek(now).toISOString().split("T")[0];
        return txDate >= startOfWeekStr && txDate <= todayStr;
      }

      case "this_month":
        return txDate.startsWith(formatYearMonth(currentYear, currentMonth));

      case "last_month": {
        const prevMonthDate = new Date(currentYear, currentMonth - 1, 1);
        return txDate.startsWith(
          formatYearMonth(prevMonthDate.getFullYear(), prevMonthDate.getMonth())
        );
      }

      case "last_3_months": {
        const threeMonthsAgo = new Date(currentYear, currentMonth - 2, 1);
        const prefix =
          formatYearMonth(
            threeMonthsAgo.getFullYear(),
            threeMonthsAgo.getMonth()
          ) + "-01";
        return txDate >= prefix;
      }

      case "this_year":
        return txDate.startsWith(String(currentYear));

      case "custom":
        if (customStart && txDate < customStart) return false;
        if (customEnd && txDate > customEnd) return false;
        return true;

      default:
        return true;
    }
  });
}

/**
 * Breakdown of transactions by category for a specific type ('expense' or 'income')
 * Returns an object with { [category]: totalAmount }
 */
export function calculateCategoryTotals(transactions = [], type = "expense") {
  if (!Array.isArray(transactions)) return {};
  const totals = {};

  transactions
    .filter((tx) => tx?.type === type)
    .forEach((tx) => {
      const cat = tx.category || "Other";
      const amt = Number(tx.amount) || 0;
      totals[cat] = Math.round(((totals[cat] || 0) + amt) * 100) / 100;
    });

  return totals;
}

/**
 * Breakdown of transactions by payment method (for expenses)
 * Returns an object with { [method]: totalAmount }
 */
export function calculatePaymentMethodTotals(transactions = [], type = "expense") {
  if (!Array.isArray(transactions)) return {};
  const totals = {};

  transactions
    .filter((tx) => tx?.type === type)
    .forEach((tx) => {
      const method = tx.paymentMethod || "Other";
      const amt = Number(tx.amount) || 0;
      totals[method] = Math.round(((totals[method] || 0) + amt) * 100) / 100;
    });

  return totals;
}

/**
 * Get monthly aggregated income & expenses for the last N months
 * Returns array of { monthKey: 'YYYY-MM', label: 'Mon YYYY', income: number, expenses: number }
 */
export function getMonthlyBreakdown(transactions = [], lastNMonths = 6) {
  if (!Array.isArray(transactions)) return [];

  const monthMap = new Map();
  const now = new Date();

  // Populate last N months in order
  for (let i = lastNMonths - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    monthMap.set(key, { monthKey: key, label, income: 0, expenses: 0 });
  }

  // Include older transaction months if any
  transactions.forEach((tx) => {
    if (!tx?.date) return;
    const key = tx.date.slice(0, 7);
    if (!monthMap.has(key)) {
      const [y, m] = key.split("-");
      const d = new Date(Number(y), Number(m) - 1, 1);
      const label = d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
      monthMap.set(key, { monthKey: key, label, income: 0, expenses: 0 });
    }
  });

  // Aggregate income and expense amounts
  transactions.forEach((tx) => {
    if (!tx?.date) return;
    const key = tx.date.slice(0, 7);
    const entry = monthMap.get(key);
    if (entry) {
      const amt = Number(tx.amount) || 0;
      if (tx.type === "income") entry.income += amt;
      else if (tx.type === "expense") entry.expenses += amt;
    }
  });

  return Array.from(monthMap.values())
    .sort((a, b) => a.monthKey.localeCompare(b.monthKey))
    .map((item) => ({
      ...item,
      income: Math.round(item.income * 100) / 100,
      expenses: Math.round(item.expenses * 100) / 100,
    }));
}
