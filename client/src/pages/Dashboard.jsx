import {
  Wallet,
  TrendingDown,
  CalendarDays,
  Sparkles,
  ArrowUpRight,
  Plus,
  ArrowRight,
} from "lucide-react";

import { useEffect, useState } from "react";

import Sidebar from "../components/layout/Sidebar";
import StatCard from "../components/dashboard/StatCard";
import SpendingChart from "../components/dashboard/SpendingChart";
import SparkleBackground from "../components/layout/SparkleBackground";
import { getExpenses } from "../services/expenseService";
import AddExpenseModal from "../components/dashboard/AddExpenseModal";
const money = (value) =>
  `₹${Math.abs(value).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;

const formatDate = (dateValue) => {
  if (!dateValue) return "Date unavailable";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return "Date unavailable";

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (first, second) =>
    first.getDate() === second.getDate() &&
    first.getMonth() === second.getMonth() &&
    first.getFullYear() === second.getFullYear();

  if (isSameDay(date, today)) return "Today";
  if (isSameDay(date, yesterday)) return "Yesterday";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
};

const categoryColors = [
  "bg-[#A3C997]/20 text-[#A3C997] border border-[#A3C997]/30",
  "bg-[#E89B84]/20 text-[#E89B84] border border-[#E89B84]/30",
  "bg-sky-400/20 text-sky-300 border border-sky-400/30",
  "bg-purple-400/20 text-purple-300 border border-purple-400/30",
];

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddExpense, setShowAddExpense] = useState(false);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getExpenses();
        setExpenses(data);
      } catch (err) {
        console.error("Failed to fetch expenses:", err);
        setError(
          "Could not load expenses. Check that your backend and database are running."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  const now = new Date();

  const currentMonthExpenses = expenses.filter((expense) => {
    const date = new Date(expense.date);

    return (
      !Number.isNaN(date.getTime()) &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  });

  const monthlySpending = currentMonthExpenses.reduce(
    (total, expense) => total + Number(expense.amount || 0),
    0
  );

  const recentTransactions = [...expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const budget = 10000;
  const remainingBudget = budget - monthlySpending;

  const daysInMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0
  ).getDate();

  const daysRemaining = Math.max(daysInMonth - now.getDate() + 1, 1);

  const dailyAllowance = Math.max(remainingBudget, 0) / daysRemaining;

  const currentMonthName = now.toLocaleDateString("en-IN", {
    month: "long",
  });

  const currentDate = now.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="relative min-h-screen bg-[#0F0D0C] text-[#FFFDF9] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(163,201,151,0.08),transparent)]">
      <SparkleBackground />

      <Sidebar />

      <main className="relative z-10 ml-64 min-w-0 px-5 py-7 sm:px-8 lg:px-10">
        {/* Header */}
        <header className="mb-9 flex flex-wrap items-center justify-between gap-5">
          <div>
            <p className="mb-2 text-sm font-medium text-[#C2B4A5]">
              {currentDate}
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Your money, in focus.
            </h1>

            <p className="mt-2 text-sm text-[#C2B4A5]">
              Here's your financial snapshot for {currentMonthName}.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddExpense(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#A3C997] px-5 py-3 text-sm font-bold text-[#0F0D0C] shadow-[0_0_20px_rgba(163,201,151,0.3)] transition hover:bg-[#B5D6AA] hover:shadow-[0_0_25px_rgba(163,201,151,0.5)]"
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>Add expense</span>
          </button>
        </header>

        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-300"
          >
            {error}
          </div>
        )}

        {/* Statistics cards */}
        <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Spent this month"
            value={loading ? "Loading..." : money(monthlySpending)}
            subtitle="Across all categories"
            icon={Wallet}
            accent="terracotta"
          />

          <StatCard
            title="Budget remaining"
            value={loading ? "Loading..." : money(remainingBudget)}
            subtitle={
              remainingBudget < 0
                ? "You have exceeded your monthly budget"
                : "Based on a ₹10,000 monthly budget"
            }
            icon={TrendingDown}
            accent="sage"
          />

          <StatCard
            title="Daily allowance"
            value={loading ? "Loading..." : money(dailyAllowance)}
            subtitle="Available budget divided by days remaining"
            icon={CalendarDays}
            accent="neutral"
          />

          <StatCard
            title="Predicted spending"
            value="₹4,927"
            subtitle="Linear Regression estimate"
            icon={Sparkles}
            accent="sage"
          />
        </section>

        {/* Spending chart and AI insights */}
        <section className="mb-8 grid gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,1fr)]">
          <SpendingChart />

          <article className="relative overflow-hidden rounded-2xl border border-[#A3C997]/30 bg-gradient-to-br from-[#1C2419] via-[#1E1916] to-[#14100E] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
            <div className="mb-5 flex items-center gap-2 text-[#A3C997]">
              <Sparkles size={18} />

              <span className="text-xs font-bold uppercase tracking-[0.18em]">
                AI spending insight
              </span>
            </div>

            <h2 className="max-w-xs text-2xl font-semibold leading-snug text-white">
              Small habits shape your financial picture.
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#C2B4A5]">
              SpendSense estimates your next month's spending from historical
              expense totals. Track more months to help you understand your
              spending patterns.
            </p>

            <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-5">
              <span className="text-sm font-medium text-[#C2B4A5]">
                Explore predictions
              </span>

              <ArrowUpRight size={19} className="text-[#A3C997]" />
            </div>

            <div className="pointer-events-none absolute -bottom-14 -right-10 h-44 w-44 rounded-full bg-[#A3C997]/20 blur-3xl" />
          </article>
        </section>

        {/* Recent transactions */}
        <section className="rounded-2xl border border-white/10 bg-[#1E1A17] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.3)] sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Recent transactions
              </h2>

              <p className="mt-1 text-sm text-[#C2B4A5]">
                Your latest recorded expenses
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                alert("The full transaction history will be added next.")
              }
              className="flex items-center gap-2 text-sm font-semibold text-[#A3C997] transition hover:text-[#B5D6AA]"
            >
              <span>View all</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {loading ? (
            <p className="py-8 text-center text-sm text-[#C2B4A5]">
              Loading your transactions...
            </p>
          ) : error ? (
            <p className="py-8 text-center text-sm text-[#C2B4A5]">
              Transactions could not be loaded.
            </p>
          ) : recentTransactions.length === 0 ? (
            <div className="py-10 text-center">
              <Wallet size={32} className="mx-auto mb-3 text-[#A3C997]" />

              <p className="text-sm font-medium text-white">
                No expenses yet
              </p>

              <p className="mt-2 text-sm text-[#C2B4A5]">
                Add your first expense to see it here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {recentTransactions.map((transaction, index) => (
                <div
                  key={transaction._id || index}
                  className="flex items-center justify-between gap-4 py-4 first:pt-2 last:pb-1"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                        categoryColors[index % categoryColors.length]
                      }`}
                    >
                      {(transaction.title || "E").charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">
                        {transaction.title || "Untitled expense"}
                      </p>

                      <p className="mt-1 text-xs text-[#C2B4A5]">
                        {transaction.category || "Uncategorized"}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-sm font-bold text-[#FFFDF9]">
                      -{money(Number(transaction.amount || 0))}
                    </p>

                    <p className="mt-1 text-xs text-[#C2B4A5]">
                      {formatDate(transaction.date)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="py-7 text-center text-xs text-[#8A7D71]">
          SpendSense · Make every rupee count.
        </footer>
      </main>
       {/* Add Expense Modal */}
      {showAddExpense && (
        <AddExpenseModal
          onClose={() => setShowAddExpense(false)}
          onExpenseAdded={(newExpense) => {
            setExpenses((previous) => [newExpense, ...previous]);
          }}
        />
        )}
    </div>
  );
}