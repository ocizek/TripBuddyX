"use client";
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseList from '@/components/ExpenseList';
import SettlementView from '@/components/SettlementView';
import SummaryCharts from '@/components/SummaryCharts';

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
    <div className="max-w-2xl mx-auto py-8 px-2">
      <h1 className="text-3xl font-bold text-center mb-2">{trip.name}</h1>
      <div className="text-center mb-4">Účastníci: {members.map(m => m.name).join(", ")}</div>
      <ExpenseForm members={members} onSubmit={addExpense} />
      <ExpenseList expenses={expenses} members={members} onDelete={deleteExpense} />
      <SummaryCharts expenses={expenses} members={members} />
      <SettlementView settlements={settlements} />
    </div>
  );
}
