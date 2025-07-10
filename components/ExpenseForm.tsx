import { useState } from "react";

const EMOJIS = ["🍕", "🍺", "🏨", "🛩️", "🚕", "⛽", "🏝️", "🎫", "🛒", "🛥️", "🎉", "🧃", "🍔"];

export default function ExpenseForm({ members, onSubmit, defaultValues }: any) {
  const [form, setForm] = useState(defaultValues || {
    description: "",
    amount: "",
    emoji: EMOJIS[0],
    paid_by: members[0]?.id || "",
    paid_for: members.map((m: any) => m.id)
  });

  function handleChange(e: any) {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm((prev: any) => ({
        ...prev,
        paid_for: checked
          ? [...prev.paid_for, value]
          : prev.paid_for.filter((id: string) => id !== value),
      }));
    } else {
      setForm((prev: any) => ({ ...prev, [name]: value }));
    }
  }

  function handleEmoji(emoji: string) {
    setForm((prev: any) => ({ ...prev, emoji }));
  }

  function handleSubmit(e: any) {
    e.preventDefault();
    if (!form.description || !form.amount || !form.paid_by || form.paid_for.length === 0) {
      alert("Vyplň všechny položky.");
      return;
    }
    onSubmit(form);
    setForm({ ...form, description: "", amount: "" });
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white/70 rounded-2xl shadow-lg p-4 mb-4 flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <label className="font-bold">Popis výdaje</label>
        <input
          className="rounded-xl p-2 border"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="např. Večeře"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="font-bold">Částka</label>
        <input
          className="rounded-xl p-2 border"
          name="amount"
          type="number"
          min="1"
          value={form.amount}
          onChange={handleChange}
          placeholder="Kč"
          required
        />
      </div>
      <div>
        <label className="font-bold">Emoji</label>
        <div className="flex gap-1 flex-wrap mt-1">
          {EMOJIS.map((e) => (
            <button
              type="button"
              key={e}
              onClick={() => handleEmoji(e)}
              className={`text-2xl p-1 rounded-xl hover:bg-purple-200 ${form.emoji === e ? "ring-2 ring-purple-500 bg-purple-200" : ""}`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="font-bold">Kdo platil?</label>
        <select className="rounded-xl p-2 border" name="paid_by" value={form.paid_by} onChange={handleChange}>
          {members.map((m: any) => (
            <option value={m.id} key={m.id}>{m.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="font-bold">Za koho?</label>
        <div className="flex flex-wrap gap-2">
          {members.map((m: any) => (
            <label key={m.id} className="flex items-center gap-1 bg-white rounded-xl p-1 px-2 shadow">
              <input
                type="checkbox"
                name="paid_for"
                value={m.id}
                checked={form.paid_for.includes(m.id)}
                onChange={handleChange}
              />
              {m.name}
            </label>
          ))}
        </div>
      </div>
      <button className="mt-3 bg-purple-500 text-white px-4 py-2 rounded-xl font-bold hover:bg-purple-600 transition" type="submit">
        Přidat výdaj
      </button>
    </form>
  );
}
