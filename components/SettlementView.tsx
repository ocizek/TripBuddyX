export default function SettlementView({ settlements }: any) {
  if (!settlements.length) return null;
  return (
    <div className="mt-6 bg-white/80 rounded-2xl shadow p-4">
      <h3 className="font-bold mb-2">Vyrovnání dluhů</h3>
      <ul className="list-disc ml-5">
        {settlements.map((s: any, idx: number) => (
          <li key={idx}>
            <span className="font-semibold">{s.from}</span> ➡️ <span className="font-semibold">{s.to}</span>: {s.amount} Kč
          </li>
        ))}
      </ul>
    </div>
  );
}
