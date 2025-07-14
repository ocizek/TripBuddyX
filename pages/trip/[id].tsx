"use client";
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseList from '@/components/ExpenseList';
import SettlementView from '@/components/SettlementView';
import SummaryCharts from '@/components/SummaryCharts';
import { motion } from "framer-motion";

function computeSettlements(expenses: any[], members: any[]) {
  const totals: Record<string, number> = {};
  members.forEach(m => { totals[m.id] = 0; });
  expenses.forEach(e => {
    totals[e.paid_by] += Number(e.amount);
    const share = Number(e.amount) / e.paid_for.length;
    e.paid_for.forEach((uid: string) => {
      totals[uid] -= share;
    });
  });

  let debts: any[] = [];
  let positive = members.filter(m => totals[m.id] > 0).map(m => ({ ...m, amt: totals[m.id] }));
  let negative = members.filter(m => totals[m.id] < 0).map(m => ({ ...m, amt: totals[m.id] }));

  for (let pos of positive) {
    for (let neg of negative) {
      if (pos.amt <= 0 || neg.amt >= 0) continue;
      const settle = Math.min(pos.amt, -neg.amt);
      debts.push({
        from: neg.name,
        to: pos.name,
        amount: Math.round(settle)
      });
      pos.amt -= settle;
      neg.amt += settle;
    }
  }
  return debts;
}

export default function TripDetailPage() {
  const params = useParams();
  const router = useRouter();
  const tripId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [trip, setTrip] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  async function fetchAll() {
    setLoading(true);
    const { data: trip } = await supabase.from('trips').select('*').eq('id', tripId).single();
    const { data: members } = await supabase.from('members').select('*').eq('trip_id', tripId);
    const { data: expenses } = await supabase.from('expenses').select('*').eq('trip_id', tripId).order('created_at', { ascending: false });
    setTrip(trip);
    setMembers(members || []);
    setExpenses(expenses || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line
  }, [tripId]);

  async function addExpense(form: any) {
    await supabase.from('expenses').insert({
      trip_id: tripId,
      description: form.description,
      amount: form.amount,
      emoji: form.emoji,
      paid_by: form.paid_by,
      paid_for: form.paid_for,
    });
    fetchAll();
  }

  async function deleteExpense(id: string) {
    await supabase.from('expenses').delete().eq('id', id);
    fetchAll();
  }

  if (loading) return <div className="p-8 text-xl">Načítám...</div>;
  if (!trip) return <div className="p-8 text-xl">Výlet nenalezen.</div>;

  const settlements = computeSettlements(expenses, members);

  return (
    <motion.div
      className="max-w-2xl mx-auto py-8 px-2"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", duration: 0.7 }}
    >
      <div className="glass mb-6 p-4">
        <h1 className="text-3xl font-bold text-center mb-2">{trip.name} <span className="text-2xl">🗺️</span></h1>
        <div className="text-center mb-1 text-gray-600">Účastníci: {members.map(m => m.name).join(", ")}</div>
        <div className="text-center mb-2">
          <span className="inline-block bg-green-100 text-green-700 rounded-xl px-2 py-1 font-mono text-xs">
            Sdílet: {typeof window !== "undefined" ? window.location.href : ""}
          </span>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
        <ExpenseForm members={members} onSubmit={addExpense} />
      </motion.div>

      <SummaryCharts expenses={expenses} members={members} />

      {/* Filtr podle osob */}
      <div className="flex gap-2 justify-center mb-4">
        <button
          onClick={() => setSelectedMember(null)}
          className={`rounded-xl px-3 py-1 font-bold transition-all ${!selectedMember ? 'bg-purple-500 text-white shadow' : 'bg-gray-200'}`}
        >
          Všichni
        </button>
        {members.map(m => (
          <button
            key={m.id}
            onClick={() => setSelectedMember(m.id)}
            className={`rounded-xl px-3 py-1 transition-all ${selectedMember === m.id ? 'bg-purple-500 text-white shadow' : 'bg-gray-200 hover:bg-purple-200'}`}
          >
            {m.name}
          </button>
        ))}
      </div>

      <ExpenseList
        expenses={selectedMember ? expenses.filter(e => e.paid_by === selectedMember) : expenses}
        members={members}
        onDelete={deleteExpense}
      />

      <SettlementView settlements={settlements} />
    </motion.div>
  );
}
