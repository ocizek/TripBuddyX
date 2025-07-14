// components/SummaryCharts.tsx
"use client";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#a259f7", "#f76a6a", "#ff7eb9", "#43e97b", "#38f9d7", "#ffd700",
];

export default function SummaryCharts({ expenses, members }: { expenses: any[]; members: any[] }) {
  // Celkové výdaje podle člena
  const data = members.map((m, idx) => ({
    name: m.name,
    value: expenses.filter(e => e.paid_by === m.id).reduce((acc, e) => acc + Number(e.amount), 0),
    fill: COLORS[idx % COLORS.length],
  }));

  if (data.every(d => d.value === 0)) {
    return <div className="text-center text-gray-500 py-4">Zatím žádné výdaje</div>;
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="my-8">
      <h2 className="font-bold text-lg text-center mb-2">Podíl výdajů podle osob</h2>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            label={({ name, percent }) => `${name} (${Math.round(percent * 100)}%)`}
            isAnimationActive
          >
            {data.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip formatter={(v: number) => `${v.toFixed(2)} Kč`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
