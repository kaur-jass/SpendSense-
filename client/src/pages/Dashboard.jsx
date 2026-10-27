import {
  Wallet,
  TrendingDown,
  CalendarDays,
  Sparkles,
  ArrowUpRight,
  Plus,
  ArrowRight,
} from "lucide-react";

import Sidebar from "../components/layout/Sidebar";
import StatCard from "../components/dashboard/StatCard";
import SpendingChart from "../components/dashboard/SpendingChart";
import SparkleBackground from "../components/layout/SparkleBackground";

const transactions = [
  {
    name: "Groceries",
    category: "Food & essentials",
    date: "Today",
    amount: -850,
    color: "bg-[#A3C997]/20 text-[#A3C997] border border-[#A3C997]/30",
  },
  {
    name: "Café",
    category: "Food & drinks",
    date: "Yesterday",
    amount: -320,
    color: "bg-[#E89B84]/20 text-[#E89B84] border border-[#E89B84]/30",
  },
  {
    name: "Bus pass",
    category: "Transport",
    date: "24 Oct",
    amount: -450,
    color: "bg-sky-400/20 text-sky-300 border border-sky-400/30",
  },
  {
    name: "Freelance work",
    category: "Income",
    date: "23 Oct",
    amount: 2500,
    color: "bg-[#A3C997]/20 text-[#A3C997] border border-[#A3C997]/30",
  },
];

const money = (value) =>
  `₹${Math.abs(value).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

export default function Dashboard() {
  return (
    <div className="relative min-h-screen bg-[#0F0D0C] text-[#FFFDF9] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(163,201,151,0.08),transparent)]">
      {/* Animated sparkle background */}
      <SparkleBackground />

      {/* Fixed navigation sidebar */}
      <Sidebar />

      {/* Main dashboard content */}
      <main className="relative z-10 ml-64 min-w-0 px-5 py-7 sm:px-8 lg:px-10">
        {/* Header */}
        <header className="mb-9 flex flex-wrap items-center justify-between gap-5">
          <div>
            <p className="mb-2 text-sm font-medium text-[#C2B4A5]">
              Tuesday, 27 October 2026
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Your money, in focus.
            </h1>

            <p className="mt-2 text-sm text-[#C2B4A5]">
              Here's your financial snapshot for October.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl bg-[#A3C997] px-5 py-3 text-sm font-bold text-[#0F0D0C] shadow-[0_0_20px_rgba(163,201,151,0.3)] transition hover:bg-[#B5D6AA] hover:shadow-[0_0_25px_rgba(163,201,151,0.5)]"
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>Add expense</span>
          </button>
        </header>

        {/* Statistics cards */}
        <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Spent this month"
            value="₹4,280"
            subtitle="Across all categories"
            icon={Wallet}
            accent="terracotta"
          />

          <StatCard
            title="Budget remaining"
            value="₹5,720"
            subtitle="57% of your budget is available"
            icon={TrendingDown}
            accent="sage"
          />

          <StatCard
            title="Daily allowance"
            value="₹190"
            subtitle="Suggested daily spending limit"
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
                Your latest money movements
              </p>
            </div>

            <button
              type="button"
              className="flex items-center gap-2 text-sm font-semibold text-[#A3C997] transition hover:text-[#B5D6AA]"
            >
              <span>View all</span>
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="divide-y divide-white/10">
            {transactions.map((transaction) => (
              <div
                key={transaction.name}
                className="flex items-center justify-between gap-4 py-4 first:pt-2 last:pb-1"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${transaction.color}`}
                  >
                    {transaction.name.charAt(0)}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">
                      {transaction.name}
                    </p>

                    <p className="mt-1 text-xs text-[#C2B4A5]">
                      {transaction.category}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <p
                    className={`text-sm font-bold ${
                      transaction.amount > 0
                        ? "text-[#A3C997]"
                        : "text-[#FFFDF9]"
                    }`}
                  >
                    {transaction.amount > 0 ? "+" : "-"}
                    {money(transaction.amount)}
                  </p>

                  <p className="mt-1 text-xs text-[#C2B4A5]">
                    {transaction.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="py-7 text-center text-xs text-[#8A7D71]">
          SpendSense · Make every rupee count.
        </footer>
      </main>
    </div>
  );
}