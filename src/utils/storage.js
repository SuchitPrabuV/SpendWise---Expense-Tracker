/**
 * SpendWise Storage Utility
 * Safe localStorage wrapper with validation, error resilience,
 * and demo data presets.
 */

const STORAGE_KEY = "spendwise_transactions_v1";
const DEMO_MODE_KEY = "spendwise_is_demo_mode_v1";

export const DEMO_TRANSACTIONS = [
  {
    id: "demo-tx-1",
    type: "income",
    amount: 25000,
    category: "Salary",
    paymentMethod: "Bank Transfer",
    date: "2026-11-01",
    description: "Monthly salary stipend",
  },
  {
    id: "demo-tx-2",
    type: "expense",
    amount: 120,
    category: "Food",
    paymentMethod: "UPI",
    date: "2026-11-01",
    description: "College cafeteria lunch",
  },
  {
    id: "demo-tx-3",
    type: "income",
    amount: 5000,
    category: "Freelance",
    paymentMethod: "Bank Transfer",
    date: "2026-10-28",
    description: "UI design freelance project",
  },
  {
    id: "demo-tx-4",
    type: "expense",
    amount: 850,
    category: "Travel",
    paymentMethod: "UPI",
    date: "2026-10-26",
    description: "Metro rail card recharge",
  },
  {
    id: "demo-tx-5",
    type: "expense",
    amount: 2400,
    category: "Shopping",
    paymentMethod: "Card",
    date: "2026-10-22",
    description: "Autumn clothes and shoes",
  },
  {
    id: "demo-tx-6",
    type: "expense",
    amount: 1800,
    category: "Bills",
    paymentMethod: "UPI",
    date: "2026-10-18",
    description: "Fiber broadband & phone bill",
  },
  {
    id: "demo-tx-7",
    type: "expense",
    amount: 1200,
    category: "Education",
    paymentMethod: "UPI",
    date: "2026-10-14",
    description: "Online programming course",
  },
  {
    id: "demo-tx-8",
    type: "expense",
    amount: 650,
    category: "Entertainment",
    paymentMethod: "Cash",
    date: "2026-10-10",
    description: "Cinema ticket & popcorn",
  },
  {
    id: "demo-tx-9",
    type: "expense",
    amount: 950,
    category: "Healthcare",
    paymentMethod: "Card",
    date: "2026-10-06",
    description: "Pharmacy vitamins & first aid",
  },
  {
    id: "demo-tx-10",
    type: "income",
    amount: 20000,
    category: "Allowance",
    paymentMethod: "Bank Transfer",
    date: "2026-10-01",
    description: "October family allowance",
  },
  {
    id: "demo-tx-11",
    type: "expense",
    amount: 1500,
    category: "Food",
    paymentMethod: "UPI",
    date: "2026-09-25",
    description: "Groceries & cooking supplies",
  },
  {
    id: "demo-tx-12",
    type: "expense",
    amount: 700,
    category: "Travel",
    paymentMethod: "Cash",
    date: "2026-09-18",
    description: "Cab rides",
  },
];

/**
 * Validate that a raw item has the expected transaction shape
 */
function isValidTransaction(tx) {
  return (
    tx &&
    typeof tx === "object" &&
    typeof tx.id === "string" &&
    (tx.type === "income" || tx.type === "expense") &&
    typeof tx.amount === "number" &&
    !isNaN(tx.amount) &&
    tx.amount > 0 &&
    typeof tx.category === "string" &&
    typeof tx.paymentMethod === "string" &&
    typeof tx.date === "string"
  );
}

/**
 * Load transactions from browser localStorage
 */
export function loadStoredTransactions() {
  try {
    if (typeof window === "undefined" || !window.localStorage) {
      return [];
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter(isValidTransaction);
    }
    return [];
  } catch (error) {
    console.warn("SpendWise: Unable to load stored transactions:", error);
    return [];
  }
}

/**
 * Save transactions to browser localStorage
 */
export function saveStoredTransactions(transactions) {
  try {
    if (typeof window === "undefined" || !window.localStorage) {
      return false;
    }
    if (!Array.isArray(transactions)) {
      return false;
    }
    const validData = transactions.filter(isValidTransaction);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(validData));
    return true;
  } catch (error) {
    console.error("SpendWise: Storage write error (quota full or restricted):", error);
    return false;
  }
}

/**
 * Clear all stored transactions
 */
export function clearStoredTransactions() {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(DEMO_MODE_KEY);
      return true;
    }
    return false;
  } catch (error) {
    console.error("SpendWise: Clear storage failed:", error);
    return false;
  }
}

/**
 * Check if the app is currently in demo mode
 */
export function isStoredDemoMode() {
  try {
    if (typeof window === "undefined" || !window.localStorage) {
      return false;
    }
    return localStorage.getItem(DEMO_MODE_KEY) === "true";
  } catch {
    return false;
  }
}

/**
 * Set demo mode state in storage
 */
export function setStoredDemoMode(isDemo) {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem(DEMO_MODE_KEY, isDemo ? "true" : "false");
    }
  } catch {
    // Ignore storage errors in restricted contexts
  }
}
