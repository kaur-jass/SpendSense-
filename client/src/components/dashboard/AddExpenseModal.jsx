import { useState } from "react";
import { X, Plus } from "lucide-react";
import { createExpense } from "../../services/expenseService";

const initialForm = {
  title: "",
  amount: "",
  category: "Food",
  date: new Date().toLocaleDateString("en-CA"),
  notes: "",
};

const categories = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Education",
  "Entertainment",
  "Health",
  "Other",
];

export default function AddExpenseModal({ onClose, onExpenseAdded }) {
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const amount = Number(form.amount);

    if (!form.title.trim()) {
      setError("Please enter an expense title.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Please enter an amount greater than zero.");
      return;
    }

    if (!form.date) {
      setError("Please select a date.");
      return;
    }

    try {
      setSaving(true);

      const newExpense = await createExpense({
        title: form.title.trim(),
        amount,
        category: form.category,
        date: form.date,
        notes: form.notes.trim(),
      });

      onExpenseAdded(newExpense);
      onClose();
    } catch (err) {
      console.error("Failed to create expense:", err);

      setError(
        err.response?.data?.message ||
          "Could not save the expense. Please check your connection and try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "mt-2 w-full rounded-xl border border-white/10 bg-[#14110F] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#8A7D71] focus:border-[#A3C997]/60";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-expense-title"
        className="my-auto w-full max-w-lg rounded-2xl border border-white/10 bg-[#1E1A17] p-6 shadow-2xl sm:p-8"
      >
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#A3C997]">
              SpendSense
            </p>

            <h2
              id="add-expense-title"
              className="text-2xl font-semibold text-white"
            >
              Add an expense
            </h2>

            <p className="mt-2 text-sm text-[#C2B4A5]">
              Record where your money went.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close modal"
            className="rounded-lg p-2 text-[#C2B4A5] transition hover:bg-white/10 hover:text-white disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="title"
              className="text-sm font-medium text-[#FFFDF9]"
            >
              Expense title
            </label>

            <input
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Groceries, bus pass"
              maxLength={100}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="amount"
              className="text-sm font-medium text-[#FFFDF9]"
            >
              Amount (₹)
            </label>

            <input
              id="amount"
              name="amount"
              type="number"
              value={form.amount}
              onChange={handleChange}
              placeholder="0.00"
              min="0.01"
              step="0.01"
              required
              className={inputClass}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="category"
                className="text-sm font-medium text-[#FFFDF9]"
              >
                Category
              </label>

              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                className={inputClass}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="date"
                className="text-sm font-medium text-[#FFFDF9]"
              >
                Date
              </label>

              <input
                id="date"
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="notes"
              className="text-sm font-medium text-[#FFFDF9]"
            >
              Notes <span className="text-[#8A7D71]">(optional)</span>
            </label>

            <textarea
              id="notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Add any extra details..."
              rows={3}
              maxLength={500}
              className={`${inputClass} resize-none`}
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-300"
            >
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/5 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#A3C997] px-4 py-3 text-sm font-bold text-[#0F0D0C] transition hover:bg-[#B5D6AA] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Plus size={17} />
              {saving ? "Saving..." : "Save expense"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
