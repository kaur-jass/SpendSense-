export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent = "sage",
}) {
  const accentClasses = {
    sage: "bg-[#A3C997]/20 text-[#A3C997] border border-[#A3C997]/30 shadow-[0_0_15px_rgba(163,201,151,0.15)]",
    terracotta: "bg-[#E89B84]/20 text-[#E89B84] border border-[#E89B84]/30 shadow-[0_0_15px_rgba(232,155,132,0.15)]",
    neutral: "bg-white/10 text-[#EBE0D3] border border-white/15",
  };

  return (
    <article className="rounded-2xl border border-white/10 bg-[#1E1A17] p-6 shadow-[0_8px_25px_rgba(0,0,0,0.3)] transition hover:border-white/20 hover:bg-[#25201C]">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-[#C2B4A5]">{title}</p>
        {Icon && (
          <div className={`rounded-xl p-2.5 ${accentClasses[accent]}`}>
            <Icon size={19} strokeWidth={2} />
          </div>
        )}
      </div>

      <h2 className="mt-5 text-3xl font-bold tracking-tight text-white">
        {value}
      </h2>

      <p className="mt-2 text-xs leading-5 text-[#C2B4A5]">{subtitle}</p>
    </article>
  );
}