import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  TrendingUp,
  Settings,
  CircleHelp,
  Leaf,
} from "lucide-react";

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Transactions", icon: ArrowLeftRight },
  { label: "Budgets", icon: Wallet },
  { label: "Predictions", icon: TrendingUp },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-64 shrink-0 flex-col overflow-y-auto border-r border-white/10 bg-[#14110F] px-5 py-7">
      <div>
        {/* Header / Brand Logo */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#A3C997]/30 bg-[#A3C997]/20 text-[#A3C997] shadow-[0_0_15px_rgba(163,201,151,0.2)]">
            <Leaf size={20} strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              SpendSense
            </h1>
            <p className="text-xs text-[#C2B4A5]">Personal finance</p>
          </div>
        </div>

        {/* Workspace Section Header */}
        <p className="mb-4 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8A7D71]">
          Workspace
        </p>

        {/* Navigation Items */}
        <nav className="space-y-2">
          {navigation.map(({ label, icon: Icon, active }) => (
            <button
              key={label}
              type="button"
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                active
                  ? "border border-[#A3C997]/30 bg-[#A3C997]/20 text-[#A3C997] shadow-[0_0_15px_rgba(163,201,151,0.1)]"
                  : "text-[#C2B4A5] hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={19} strokeWidth={2} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Footer / Account Section */}
      <div className="mt-auto space-y-2 pt-10">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#C2B4A5] hover:bg-white/5 hover:text-white"
        >
          <CircleHelp size={19} />
          <span>Help & support</span>
        </button>

        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#C2B4A5] hover:bg-white/5 hover:text-white"
        >
          <Settings size={19} />
          <span>Settings</span>
        </button>

        <div className="mt-5 border-t border-white/10 px-3 pt-5">
          <p className="text-sm font-semibold text-white">My workspace</p>
          <p className="mt-1 text-xs text-[#8A7D71]">Personal account</p>
        </div>
      </div>
    </aside>
  );
}