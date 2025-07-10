import { motion } from "framer-motion";

export default function ExpenseList({ expenses, members, onEdit, onDelete }: any) {
  return (
    <div className="flex flex-col gap-2">
      {expenses.map((exp: any) => {
        const payer = members.find((m: any) => m.id === exp.paid_by);
        const receivers = members.filter((m: any) => exp.paid_for.includes(m.id)).map((m: any) => m.name).join(", ");
        return (
          <motion.div
            layout
            key={exp.id}
            className="flex items-center bg-white/80 rounded-xl shadow p-2 justify-between gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <span className="text-2xl">{exp.emoji}</span>
            <span className="min-w-[80px]">{exp.description}</span>
            <span className="font-semibold">{exp.amount} Kč</span>
            <span className="text-sm text-gray-700">Platí: {payer?.name}</span>
            <span className="text-xs text-gray-500">Za: {receivers}</span>
            {onEdit && <button onClick={() => onEdit(exp)} className="text-purple-600 hover:underline">Upravit</button>}
            {onDelete && <button onClick={() => onDelete(exp.id)} className="text-red-500 hover:underline">Smazat</button>}
          </motion.div>
        );
      })}
    </div>
  );
}
