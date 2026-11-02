import { useState, useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Doughnut, Bar, Line } from "react-chartjs-2";
import {
  filterTransactionsByPeriod,
  calculateTotalExpenses,
  calculateCategoryTotals,
  calculatePaymentMethodTotals,
  getMonthlyBreakdown,
  formatCurrency,
} from "../utils/financeCalculations";
import { CATEGORY_COLORS, PAYMENT_COLORS } from "../utils/constants";
import "./ExpenseChart.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function ExpenseChart({ transactions = [] }) {
  const [period, setPeriod] = useState("this_month");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const filteredTransactions = useMemo(() => {
    return filterTransactionsByPeriod(
      transactions,
      period,
      customStart,
      customEnd
    );
  }, [transactions, period, customStart, customEnd]);

  const totalExpenses = useMemo(
    () => calculateTotalExpenses(filteredTransactions),
    [filteredTransactions]
  );

  const categoryTotals = useMemo(
    () => calculateCategoryTotals(filteredTransactions, "expense"),
    [filteredTransactions]
  );

  const paymentTotals = useMemo(
    () => calculatePaymentMethodTotals(filteredTransactions, "expense"),
    [filteredTransactions]
  );

  const monthlyData = useMemo(() => {
    return getMonthlyBreakdown(transactions, 6);
  }, [transactions]);

  const rankedCategories = useMemo(() => {
    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalExpenses > 0 ? ((amount / totalExpenses) * 100).toFixed(1) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [categoryTotals, totalExpenses]);

  const categoryChartData = useMemo(() => {
    const labels = Object.keys(categoryTotals);
    return {
      labels,
      datasets: [
        {
          label: "Expenses by Category",
          data: Object.values(categoryTotals),
          backgroundColor: labels.map(
            (_, index) => CATEGORY_COLORS[index % CATEGORY_COLORS.length]
          ),
          borderWidth: 2,
          borderColor: "#ffffff",
          hoverOffset: 6,
        },
      ],
    };
  }, [categoryTotals]);

  const paymentChartData = useMemo(() => {
    const labels = Object.keys(paymentTotals);
    return {
      labels,
      datasets: [
        {
          label: "Spending by Payment Method",
          data: Object.values(paymentTotals),
          backgroundColor: labels.map(
            (label) => PAYMENT_COLORS[label] || "#94a3b8"
          ),
          borderWidth: 2,
          borderColor: "#ffffff",
          hoverOffset: 6,
        },
      ],
    };
  }, [paymentTotals]);

  const incomeVsExpenseChartData = useMemo(() => {
    return {
      labels: monthlyData.map((m) => m.label),
      datasets: [
        {
          label: "Income",
          data: monthlyData.map((m) => m.income),
          backgroundColor: "#10b981",
          borderRadius: 6,
        },
        {
          label: "Expenses",
          data: monthlyData.map((m) => m.expenses),
          backgroundColor: "#ef4444",
          borderRadius: 6,
        },
      ],
    };
  }, [monthlyData]);

  const trendChartData = useMemo(() => {
    return {
      labels: monthlyData.map((m) => m.label),
      datasets: [
        {
          label: "Monthly Expenses",
          data: monthlyData.map((m) => m.expenses),
          borderColor: "#2563eb",
          backgroundColor: "rgba(37, 99, 235, 0.12)",
          tension: 0.35,
          fill: true,
          pointBackgroundColor: "#2563eb",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 5,
        },
      ],
    };
  }, [monthlyData]);

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { boxWidth: 12, font: { size: 12 }, padding: 14 },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const val = context.parsed;
            const pct =
              totalExpenses > 0
                ? ((val / totalExpenses) * 100).toFixed(1)
                : 0;
            return ` ${context.label}: ${formatCurrency(val)} (${pct}%)`;
          },
        },
      },
    },
    cutout: "62%",
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: { font: { size: 12 } } },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.dataset.label}: ${formatCurrency(ctx.parsed.y)}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `₹${value.toLocaleString("en-IN")}`,
          font: { size: 11 },
        },
        grid: { color: "#f1f5f9" },
      },
      x: { grid: { display: false }, ticks: { font: { size: 11 } } },
    },
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` Expenses: ${formatCurrency(ctx.parsed.y)}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `₹${value.toLocaleString("en-IN")}`,
          font: { size: 11 },
        },
        grid: { color: "#f1f5f9" },
      },
      x: { grid: { display: false }, ticks: { font: { size: 11 } } },
    },
  };

  const hasAnyTransactions = transactions.length > 0;
  const hasPeriodExpenses = totalExpenses > 0;
  const hasPeriodData = filteredTransactions.length > 0;

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h2>Spending Analytics</h2>

        <div className="period-selector-wrapper">
          <label htmlFor="analytics-period" className="period-label">
            Period:
          </label>
          <select
            id="analytics-period"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="period-select"
          >
            <option value="this_month">This Month</option>
            <option value="last_month">Last Month</option>
            <option value="last_3_months">Last 3 Months</option>
            <option value="this_year">This Year</option>
            <option value="all">All Time</option>
            <option value="custom">Custom Date Range</option>
          </select>
        </div>
      </div>

      {period === "custom" && (
        <div className="custom-range-bar">
          <div className="date-input-group">
            <label htmlFor="analytics-start">From:</label>
            <input
              id="analytics-start"
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
            />
          </div>
          <div className="date-input-group">
            <label htmlFor="analytics-end">To:</label>
            <input
              id="analytics-end"
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
            />
          </div>
        </div>
      )}

      {!hasAnyTransactions ? (
        <div className="analytics-empty-state">
          <div className="empty-chart-icon" aria-hidden="true">📊</div>
          <h4>No Transactions Available</h4>
          <p>Add some transactions to see your spending analytics.</p>
        </div>
      ) : !hasPeriodData ? (
        <div className="analytics-empty-state">
          <div className="empty-chart-icon" aria-hidden="true">📅</div>
          <h4>No Data for Selected Period</h4>
          <p>There are no transactions recorded for this period.</p>
          <button
            type="button"
            className="btn-switch-period"
            onClick={() => setPeriod("all")}
          >
            View All Time
          </button>
        </div>
      ) : (
        <>
          <div className="charts-grid">
            <div className="chart-card">
              <h4>Expense Breakdown by Category</h4>
              <div className="chart-wrapper">
                {hasPeriodExpenses ? (
                  <Doughnut data={categoryChartData} options={doughnutOptions} />
                ) : (
                  <div className="chart-no-expense">
                    <p>No expense transactions in this period.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="chart-card">
              <h4>Spending by Payment Method</h4>
              <div className="chart-wrapper">
                {hasPeriodExpenses ? (
                  <Doughnut data={paymentChartData} options={doughnutOptions} />
                ) : (
                  <div className="chart-no-expense">
                    <p>No expense transactions in this period.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="chart-card">
              <h4>Income vs. Expenses (Monthly)</h4>
              <div className="chart-wrapper">
                <Bar data={incomeVsExpenseChartData} options={barOptions} />
              </div>
            </div>

            <div className="chart-card">
              <h4>Monthly Expense Trend</h4>
              <div className="chart-wrapper">
                <Line data={trendChartData} options={lineOptions} />
              </div>
            </div>
          </div>

          {hasPeriodExpenses && rankedCategories.length > 0 && (
            <div className="ranking-section">
              <h4>Top Expense Categories</h4>
              <div className="ranking-list">
                {rankedCategories.map((item, index) => (
                  <div key={item.category} className="ranking-item">
                    <div className="ranking-row">
                      <div className="ranking-title-group">
                        <span className={`ranking-index rank-${index + 1}`}>#{index + 1}</span>
                        <span className="ranking-cat-name">{item.category}</span>
                      </div>
                      <div className="ranking-amount-group">
                        <span className="ranking-amount">{formatCurrency(item.amount)}</span>
                        <span className="ranking-pct">({item.percentage}%)</span>
                      </div>
                    </div>
                    <div className="ranking-progress-bg">
                      <div
                        className="ranking-progress-fill"
                        style={{
                          width: `${Math.min(100, Math.max(4, item.percentage))}%`,
                          backgroundColor:
                            CATEGORY_COLORS[index % CATEGORY_COLORS.length],
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ExpenseChart;
