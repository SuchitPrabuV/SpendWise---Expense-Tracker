# SpendWise — Personal Expense Tracker

SpendWise is a modern, responsive personal finance tracking web application designed to help individuals, students, and professionals monitor income and expenditures, calculate balances in real time, analyze spending habits through interactive visualizations, and persist transaction records securely in the browser.

---

## 🚀 Key Features

### 1. Dynamic Financial Overview
- **Real-time Metrics**: Live calculation of Total Income, Total Expenses, Remaining Balance, and UPI Spending.
- **Timeframe Filtering**: Filter dashboard metrics across **Today**, **This Week**, **This Month**, **This Year**, and **All Time**.
- **Negative Balance Alert**: Visual indicators and warning states when expenses exceed total income.

### 2. Comprehensive Transaction Management (Module 3 & 4)
- **Income & Expense Tracking**: Separate categorization for inflow (Salary, Allowance, Freelance, Other income) and outflow (Food, Travel, Shopping, Education, Bills, Entertainment, Healthcare, Other expenses).
- **Payment Method Support**: Categorize transactions by UPI, Cash, Card, and Bank Transfer.
- **Smart Validation**: Guardrails preventing negative or empty amounts, missing dates, or excessive description lengths.
- **Full CRUD Capabilities**: Add, View, Edit, and Delete transactions with instant propagation to dashboard cards and charts.
- **Delete Confirmation Modal**: Prevents accidental data loss with explicit confirmation.
- **Real-time Search & Multi-filter**: Search by keywords across descriptions, categories, and payment methods. Filter concurrently by transaction type, category, payment mode, and custom date range.
- **Multi-criteria Sorting**: Sort by newest first, oldest first, highest amount, or lowest amount.
- **Pagination**: Smooth pagination with page indicators and controls.

### 3. Spending Analytics & Interactive Charts (Module 6)
- **Expense Category Breakdown**: Doughnut chart showing percentage and rupee distribution across expense categories.
- **Income vs. Expenses**: Monthly comparative bar chart tracking cash flow.
- **Monthly Spending Trend**: Line chart illustrating expenditure patterns over time.
- **Payment Method Distribution**: Breakdown of spending across UPI, Cash, Card, and Bank Transfer (strictly filtering expenses).
- **Category Rankings**: Automated leaderboard of highest expenditure categories with proportional visual progress bars.
- **Configurable Analytics Timeframes**: View insights by This Month, Last Month, Last 3 Months, This Year, All Time, or Custom Date Ranges.
- **Empty States**: Contextual messages guiding users when no transactions are recorded for a period.

### 4. Persistent Browser Storage & Demo Mode (Module 7)
- **Offline & Local Storage**: Data automatically persists in `localStorage` across page reloads and browser sessions.
- **Fault Tolerance**: Resilient try-catch wrapping protects against storage restrictions or quota limits.
- **Interactive Demo Mode**: Explore preloaded sample datasets with realistic student/freelancer finances. Easily switch back to a clean personal ledger or reset all stored data.

---

## 🛠️ Technologies Used

- **Framework**: React 19
- **Build Tool**: Vite 8
- **Language**: JavaScript (ESModules, JSX)
- **Styling**: Vanilla CSS (Responsive Flexbox & CSS Grid, no external CSS dependencies)
- **Data Visualization**: Chart.js & react-chartjs-2
- **Linting & Code Quality**: ESLint 10 with React Hooks & React Refresh rules

---

## 📁 Project Structure

```
spendwise/
├── public/
├── src/
│   ├── assets/                      # Static assets and icons
│   ├── components/
│   │   ├── Navbar.jsx               # Top navigation header
│   │   ├── Sidebar.jsx              # Side navigation and ledger controls
│   │   ├── SummaryCards.jsx         # Dynamic financial summary overview
│   │   ├── TransactionForm.jsx      # Transaction entry and edit form
│   │   ├── TransactionForm.css      # Form styles & alerts
│   │   ├── TransactionList.jsx      # History table, filters, search, modal
│   │   ├── TransactionList.css      # Table & filter controls styling
│   │   ├── ExpenseChart.jsx         # Chart.js analytics and ranking dashboard
│   │   └── ExpenseChart.css         # Chart grids and progress indicators
│   ├── utils/
│   │   ├── constants.js             # Categories, methods, colors, and presets
│   │   ├── financeCalculations.js   # Pure calculation and formatting utilities
│   │   └── storage.js               # Safe localStorage wrapper and demo data
│   ├── App.jsx                      # Root state manager & component coordinator
│   ├── App.css                      # Global layout & dashboard styling
│   ├── index.css                    # Base styles and typography
│   └── main.jsx                     # Application entry point
├── test-verification.mjs            # Automated verification test suite
├── index.html                       # HTML template
├── package.json                     # Dependencies & scripts
└── vite.config.js                   # Vite configuration
```

---

## 💻 Getting Started Locally

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm (v9.0.0 or higher)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/SuchitPrabuV/SpendWise---Expense-Tracker.git
   cd SpendWise---Expense-Tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

4. Run the verification test suite:
   ```bash
   npm test
   ```

5. Run the linter:
   ```bash
   npm run lint
   ```

6. Build for production:
   ```bash
   npm run build
   ```

---

## 🌐 Deployment Instructions

SpendWise is configured as a static Single Page Application (SPA) ready for deployment to any static web hosting provider:

### Deploying to Vercel
1. Install the Vercel CLI: `npm i -g vercel` (or connect your GitHub repository directly at [vercel.com](https://vercel.com)).
2. Build Command: `npm run build`
3. Output Directory: `dist`

### Deploying to Netlify
1. Connect repository on [netlify.com](https://netlify.com) or run `ntl deploy`.
2. Build command: `npm run build`
3. Publish directory: `dist`

### Deploying to GitHub Pages
1. In `vite.config.js`, set `base: '/SpendWise---Expense-Tracker/'`.
2. Deploy the `dist` folder via `gh-pages` or GitHub Actions workflow.

---

## ⚠️ Known Limitations & Scope

To maintain high performance and simplicity, Version 1 focuses exclusively on a client-side personal financial ledger:
- **Client-Side Storage**: Data is saved to the browser's `localStorage` and does not synchronize across separate devices or private browser windows.
- **Currency**: Default currency formatting is localized to Indian Rupees (`₹`, `en-IN`).
- **No Backend Database**: In line with the design specifications, multi-user authentication, cloud databases, and automatic bank imports are deferred to future versions.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
