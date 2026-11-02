import { formatCurrency } from "../utils/financeCalculations";

function SummaryCards({
  totalIncome = 0,
  totalExpenses = 0,
  balance = 0,
  upiSpending = 0,
  periodLabel = "This Month",
}) {
  const isNegative = balance < 0;

  const cards = [
    {
      title: "Total Income",
      amount: formatCurrency(totalIncome),
      badge: periodLabel,
      type: "income",
    },
    {
      title: "Total Expenses",
      amount: formatCurrency(totalExpenses),
      badge: periodLabel,
      type: "expense",
    },
    {
      title: "Remaining Balance",
      amount: formatCurrency(balance),
      badge: isNegative ? "Deficit" : "Net Balance",
      type: isNegative ? "balance balance-negative" : "balance",
    },
    {
      title: "UPI Spending",
      amount: formatCurrency(upiSpending),
      badge: "Expenses",
      type: "upi",
    },
  ];

  return (
    <section className="summary-grid" aria-label="Financial summary">
      {cards.map((item) => (
        <article className={`summary-card ${item.type}`} key={item.title}>
          <div className="summary-card-top">
            <p className="summary-title">{item.title}</p>
            <span className="summary-card-badge">{item.badge}</span>
          </div>
          <h2 className="summary-amount">{item.amount}</h2>
        </article>
      ))}
    </section>
  );
}

export default SummaryCards;
