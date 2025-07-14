"use client";
import { motion } from "framer-motion";

export default function ExpenseList({ expenses, members, onDelete }: { expenses: any[]; members: any[]; onDelete: (id: string) => void }) {
  function memberName(id: string) {
    const m = members.find(m => m.id === id);
    return m ? m.name : "?";
  }

  if (!expenses.length) return <div className="text-center text-gray-500 pb-8">Zatím žádné výdaje.</div>;

  return (
    <ul className="flex flex-col gap-5 pb-8">
      {expenses.map((expense, i) => (
        <motion.li
          key={expense.id}
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          className="bg-white glass rounded-2xl px-5 py-4 shadow-md hover:shadow-xl transition-all border-l-8"
          style={{
            borderColor: "#a259f7", // nebo použij dynamickou barvu/emoji barvu
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{expense.emoji || "💸"}</span>
              <span className="font-bold text-lg">{expense.description}</span>
            </div>
            <span className="text-xl font-mono text-green-700">{Number(expense.amount).toFixed(2)} Kč</span>
          </div>
          <div className="flex items-center gap-2 mt-1 text-gray-500 text-sm">
            <span>Platí: <b className="text-purple-600">{memberName(expense.paid_by)}</b></span>
            <span> | Za: {expense.paid_for.map((uid: string) => memberName(uid)).join(", ")}</span>
          </div>
          <button
            onClick={() => onDelete(expense.id)}
            className="ml-auto block mt-3 text-xs bg-red-100 text-red-600 px-2 py-1 rounded-xl hover:bg-red-300 transition"
          >
            Smazat
          </button>
        </motion.li>
      ))}
    </ul>
  );
}
