const summaryData = [
  {
    title: 'Total Income',
    amount: '₹25,000',
    description: 'Money received',
    type: 'income',
  },
  {
    title: 'Total Expenses',
    amount: '₹8,450',
    description: 'Money spent',
    type: 'expense',
  },
  {
    title: 'Remaining Balance',
    amount: '₹16,550',
    description: 'Income minus expenses',
    type: 'balance',
  },
  {
    title: 'UPI Spending',
    amount: '₹5,200',
    description: 'Expenses paid through UPI',
    type: 'upi',
  },
]

function SummaryCards() {
  return (
    <section className="summary-grid" aria-label="Financial summary">
      {summaryData.map((item) => (
        <article
          className={`summary-card ${item.type}`}
          key={item.type}
        >
          <p className="summary-title">{item.title}</p>

          <h2 className="summary-amount">{item.amount}</h2>

          <p className="summary-description">{item.description}</p>
        </article>
      ))}
    </section>
  )
}

export default SummaryCards