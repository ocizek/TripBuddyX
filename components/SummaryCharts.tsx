import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";

const COLORS = ["#7f5af0", "#2cb67d", "#ef4565", "#ffca3a", "#8ac926", "#1982c4", "#6a4c93", "#ff595e", "#b2bec3", "#e17055"];

export default function SummaryCharts({ expenses, members }: any) {
  if (!expenses.length) return null;

  // Suma podle člena (kdo kolik zaplatil)
  const byPayer = members.map((m: any, i: number) => ({
    name: m.name,
    value: expenses.filter((e: any) => e.paid_by === m.id).reduce((acc: number, e: any) => acc + Number(e.amount), 0),
    color: COLORS[i % COLORS.length]
  }));

  return (
    <div className="flex flex-col md:flex-row gap-6 items-center justify-center py-6">
      <div className="bg-white/70 rounded-2xl p-4 shadow-lg flex flex-col items-center">
        <h3 className="font-bold mb-2">Podíl zaplacených výdajů</h3>
        <div className="w-56 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={byPayer} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90}>
                {byPayer.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-white/70 rounded-2xl p-4 shadow-lg flex flex-col items-center">
        <h3 className="font-bold mb-2">Výdaje podle osoby</h3>
        <div className="w-64 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byPayer}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value">
                {byPayer.map((entry, idx) => (
                  <Cell key={`bar-${idx}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
