"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function HomePage() {
  const router = useRouter();
  const [trips, setTrips] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [members, setMembers] = useState([{ name: '' }, { name: '' }]);

  useEffect(() => {
    supabase
      .from('trips')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => setTrips(data || []));
  }, []);

  async function createTrip(e: any) {
    e.preventDefault();
    if (!name || members.some(m => !m.name)) {
      alert("Zadej název výletu a jména všech účastníků.");
      return;
    }
    const { data: trip } = await supabase
      .from('trips')
      .insert({ name })
      .select()
      .single();
    const tripId = trip.id;
    await Promise.all(
      members.map(m =>
        supabase.from('members').insert({ trip_id: tripId, name: m.name })
      )
    );
    router.push(`/trip/${tripId}`);
  }

  return (
    <div className="max-w-xl mx-auto py-8 px-2">
      <h1 className="text-4xl font-bold mb-4 text-center">TripBuddy 🚀</h1>
      <form
        onSubmit={createTrip}
        className="bg-white/70 rounded-2xl shadow-lg p-4 flex flex-col gap-3 mb-8"
      >
        <label className="font-bold text-xl">Název výletu</label>
        <input
          className="rounded-xl p-2 border"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="např. Sicílie 2025"
        />
        <label className="font-bold text-xl">Účastníci</label>
        {members.map((m, i) => (
          <input
            key={i}
            className="rounded-xl p-2 border my-1"
            value={m.name}
            onChange={e => {
              setMembers(prev =>
                prev.map((mm, j) =>
                  j === i ? { ...mm, name: e.target.value } : mm
                )
              );
            }}
            placeholder={`Jméno ${i + 1}`}
            required
          />
        ))}
        <button
          type="button"
          onClick={() => setMembers(prev => [...prev, { name: '' }])}
          className="bg-purple-400 rounded-xl px-3 py-1 text-white mt-1"
        >
          Přidat účastníka
        </button>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded-xl font-bold hover:bg-green-600 transition mt-3"
        >
          Vytvořit výlet
        </button>
      </form>
      <div>
        <h2 className="font-bold mb-2">Moje výlety</h2>
        <ul className="flex flex-col gap-2">
          {trips.map(trip => (
            <li
              key={trip.id}
              className="bg-white/60 rounded-xl p-2 shadow flex justify-between items-center"
            >
              <span>{trip.name}</span>
              <a
                href={`/trip/${trip.id}`}
                className="text-purple-700 font-bold hover:underline"
              >
                Zobrazit
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
