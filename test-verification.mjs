import assert from "node:assert";
import {
  calculateTotalIncome,
  calculateTotalExpenses,
  calculateRemainingBalance,
  calculateUpiSpending,
  filterTransactionsByPeriod,
  calculateCategoryTotals,
  calculatePaymentMethodTotals,
  getMonthlyBreakdown,
  formatCurrency,
  formatDisplayDate,
} from "./src/utils/financeCalculations.js";
import {
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
  PAYMENT_METHODS,
} from "./src/utils/constants.js";

console.log("=== RUNNING SPENDWISE VERIFICATION TESTS ===");

// 1. Test Currency and Date formatting
console.log("Testing formatters...");
assert.strictEqual(formatCurrency(120), "₹120.00");
assert.strictEqual(formatCurrency(-500), "−₹500.00");
assert.strictEqual(formatCurrency(125000), "₹1,25,000.00");
assert.strictEqual(formatDisplayDate("2026-11-01"), "01 Nov 2026");
assert.strictEqual(formatDisplayDate("2026-08-15"), "15 Aug 2026");

// 2. Test Module 3: Categories & Payment Methods
console.log("Testing Module 3 categories & payment methods...");
assert.deepStrictEqual(INCOME_CATEGORIES, [
  "Salary",
  "Allowance",
  "Freelance",
  "Other income",
]);
assert.deepStrictEqual(EXPENSE_CATEGORIES, [
  "Food",
  "Travel",
  "Shopping",
  "Education",
  "Bills",
  "Entertainment",
  "Healthcare",
  "Other expenses",
]);
assert.deepStrictEqual(PAYMENT_METHODS, [
  "UPI",
  "Cash",
  "Card",
  "Bank Transfer",
]);

// 3. Test Module 5: Financial Calculations
console.log("Testing financial calculation formulas...");
const sampleTxs = [
  { id: "1", type: "income", amount: 5000, category: "Allowance", paymentMethod: "Bank Transfer", date: "2026-11-01" },
  { id: "2", type: "income", amount: 3000, category: "Freelance", paymentMethod: "UPI", date: "2026-11-01" },
  { id: "3", type: "income", amount: 2000, category: "Other income", paymentMethod: "Cash", date: "2026-11-01" },
  { id: "4", type: "expense", amount: 1500, category: "Food", paymentMethod: "UPI", date: "2026-11-01" },
  { id: "5", type: "expense", amount: 800, category: "Travel", paymentMethod: "Cash", date: "2026-11-01" },
  { id: "6", type: "expense", amount: 700, category: "Shopping", paymentMethod: "Card", date: "2026-11-01" },
];

const totalInc = calculateTotalIncome(sampleTxs);
assert.strictEqual(totalInc, 10000, "Total income should be 10,000");

const totalExp = calculateTotalExpenses(sampleTxs);
assert.strictEqual(totalExp, 3000, "Total expenses should be 3,000");

const balance = calculateRemainingBalance(totalInc, totalExp);
assert.strictEqual(balance, 7000, "Remaining balance should be 7,000");

// UPI Spending rule: Only expense transactions through UPI count.
// Income received through UPI (3000) MUST NOT count!
const upiSpending = calculateUpiSpending(sampleTxs);
assert.strictEqual(upiSpending, 1500, "UPI spending should be 1,500 (income via UPI must be excluded)");

// Edge case: Negative balance
assert.strictEqual(calculateRemainingBalance(1000, 2500), -1500);

// Edge case: Empty transactions
assert.strictEqual(calculateTotalIncome([]), 0);
assert.strictEqual(calculateTotalExpenses([]), 0);
assert.strictEqual(calculateRemainingBalance(0, 0), 0);
assert.strictEqual(calculateUpiSpending([]), 0);

// Edge case: Decimals precision
const decimalTxs = [
  { id: "d1", type: "income", amount: 100.1, category: "Salary", paymentMethod: "Bank Transfer", date: "2026-11-01" },
  { id: "d2", type: "income", amount: 200.2, category: "Freelance", paymentMethod: "Bank Transfer", date: "2026-11-01" },
];
assert.strictEqual(calculateTotalIncome(decimalTxs), 300.3);

// 4. Test Category & Payment Method Aggregations
console.log("Testing category & payment breakdowns...");
const catTotals = calculateCategoryTotals(sampleTxs, "expense");
assert.strictEqual(catTotals["Food"], 1500);
assert.strictEqual(catTotals["Travel"], 800);
assert.strictEqual(catTotals["Shopping"], 700);

const payTotals = calculatePaymentMethodTotals(sampleTxs, "expense");
assert.strictEqual(payTotals["UPI"], 1500);
assert.strictEqual(payTotals["Cash"], 800);
assert.strictEqual(payTotals["Card"], 700);

// 5. Test Monthly Breakdown
console.log("Testing monthly trends...");
const monthlyBreakdown = getMonthlyBreakdown(sampleTxs, 3);
assert.ok(Array.isArray(monthlyBreakdown));
assert.ok(monthlyBreakdown.length >= 3);

// 6. Test Time-based filtering
console.log("Testing period filters...");
const periodFiltered = filterTransactionsByPeriod(sampleTxs, "all");
assert.strictEqual(periodFiltered.length, 6);

console.log("ALL TESTS PASSED SUCCESSFULLY! ✨");
