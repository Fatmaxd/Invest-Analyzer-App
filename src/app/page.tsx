// app/page.tsx  (or src/app/page.tsx)

'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [prices, setPrices] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch('/api/prices?ids=bitcoin,ethereum,solana,cardano');
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        setPrices(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load prices');
        setLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="p-8 text-center">Loading live prices...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        Crypto Tracker Dashboard
      </h1>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(prices).map(([coinId, coinData]: [string, any]) => (
          <div key={coinId} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
            <h2 className="text-2xl font-semibold capitalize mb-2">
              {coinId}
            </h2>
            <p className="text-3xl font-bold text-green-600">
              ${coinData.usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className={`text-lg mt-2 ${coinData.usd_24h_change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {coinData.usd_24h_change?.toFixed(2)}% (24h)
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}