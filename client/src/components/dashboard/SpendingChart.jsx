import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const sampleData = [
  { month: "May", spending: 15360 },
  { month: "Jun", spending: 1482 },
  { month: "Jul", spending: 2485 },
  { month: "Aug", spending: 6891 },
  { month: "Sep", spending: 6449 },
  { month: "Oct", spending: 4927 },
];

const formatCurrency = (value) =>
  `₹${Number(value).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

export default function SpendingChart() {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#1E1A17] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
      {/* Chart Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">
            Spending overview
          </h2>
          <p className="mt-1 text-xs text-[#C2B4A5]">
            Your monthly expense trend
          </p>
        </div>

        <span className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-[#C2B4A5]">
          Last 6 months
        </span>
      </div>

      {/* Area Chart Container */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={sampleData}
            margin={{ top: 8, right: 8, left: -15, bottom: 0 }}
          >
            <defs>
              <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#A3C997" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#A3C997" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="#FFFFFF"
              strokeOpacity={0.08}
              vertical={false}
            />

            <XAxis
              dataKey="month"
              tick={{ fill: "#C2B4A5", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              dy={10}
            />

            <YAxis
              tickFormatter={(value) => `₹${value / 1000}k`}
              tick={{ fill: "#C2B4A5", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickCount={5}
            />

            <Tooltip
              formatter={(value) => [formatCurrency(value), "Spending"]}
              contentStyle={{
                background: "#14110F",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "12px",
                color: "#FFFDF9",
                boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
              }}
              labelStyle={{ color: "#C2B4A5", marginBottom: 4 }}
            />

            <Area
              type="monotone"
              dataKey="spending"
              stroke="#A3C997"
              strokeWidth={3}
              fill="url(#spendingGradient)"
              activeDot={{
                r: 6,
                fill: "#A3C997",
                stroke: "#14110F",
                strokeWidth: 3,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}