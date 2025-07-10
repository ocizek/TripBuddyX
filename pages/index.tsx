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
    supabase.from('trips').select('*').order('created_at', { ascending: false })
      .then(({ data }) => setTrips(data || []));
  }, []);

  async function createTrip(e: any) {
    e.preventDefault();
    if (!name || members.some(m => !m.name)) {
      alert("Zadej název výletu a jména všech účastníků.");
      return;
    }
    const { data: trip } = await supabase.from('trips').insert({ name }).select().single();
    const tripId = trip.id;
    await Promise.all(members.map(m =>
      supabase.from('members').insert({ trip_id: tripId, name: m.name })
    ));
    router.push(`/trip/${tripId}`);
  }

  return (
    <div className="max-w-xl mx-auto py-8 px-2">
      <h1 className="text-4xl font-bold mb-4 text-center">TripBuddy 🚀<
