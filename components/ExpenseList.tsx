"use client";
import { motion } from "framer-motion";

export default function ExpenseList({ expenses, members, onDelete }: { expenses: any[]; members: any[]; onDelete: (id: string) => void }) {
  function memberName(id: string) {
    const m = members.find(m => m.id === id);
    return m ? m.name : "?";
  }

  if (!expenses.length) return <div className="text-center text-gray-500 pb-8">Zatím žádné výdaje.</div>;

  return (
    <ul className="flex flex-col gap-6 pb-8">
      {expenses.map((expense, i) => (
        <motion.li
          key={expense.id}
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          className="glass rounded-2xl px-6 py-5 shadow-lg hover:shadow-xl transition-all border-l-8 border-purple-300 flex flex-col gap-2"
        >
          <div className="flex items-center gap-3 text-xl mb-1">
            <span className="text-3xl">{expense.emoji || "💸"}</span>
            <span className="font-semibold text-xl">{expense.description}</span>
          </div>
          <div className="flex justify-end items-center">
            <span className="text-2xl font-mono text-green-700">{Number(expense.amount).toLocaleString()} Kč</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-gray-600 text-sm mt-1">
            <span>
              <b>Platí:</b> <span className="text-purple-700">{memberName(expense.paid_by)}</span>
            </span>
            <span>|</span>
            <span>
              <b>Za:</b> {expense.paid_for.map((uid: string) => memberName(uid)).join(", ")}
            </span>
          </div>
          <div className="flex justify-end mt-1">
            <button
              onClick={() => onDelete(expense.id)}
              className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded-xl hover:bg-red-300 transition shadow"
            >
              Smazat
            </button>
          </div>
        </motion.li>
      ))}
    </ul>
  );
}
