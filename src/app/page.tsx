'use client';

import { useEffect, useState } from 'react';

const coinLabels: Record<string, string> = {
  bitcoin: 'Bitcoin',
  ethereum: 'Ethereum',
  solana: 'Solana',
  cardano: 'Cardano',
};

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
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading)
    return (
      <main className="app-shell">
        <section className="status-panel">
          <span className="status-ring" />
          <p>Loading live prices...</p>
        </section>
      </main>
    );

  if (error)
    return (
      <main className="app-shell">
        <section className="status-panel error-panel">
          <p>{error}</p>
        </section>
      </main>
    );

  return (
    <main className="app-shell">
      <section className="hero">
        <div className="hero-badge">Invest Analyzer</div>
        <h1>Old cool web design, modern market signal.</h1>
        <p>
          Live crypto pricing with a bold vintage layout, clean type, and rich pastel textures.
          This is not another glassy dashboard — it is strong, distinct, and easy to read.
        </p>
      </section>

      <section className="market-strip">
        <span>LIVE MARKET FEED</span>
        <span>Auto-refresh every 60 seconds · No fluff · High contrast, soft color.</span>
      </section>

      <section className="price-board">
        <div className="board-title">Market Pulse</div>
        <div className="price-list">
          {Object.entries(prices).map(([coinId, coinData]: [string, any]) => {
            const change = coinData.usd_24h_change ?? 0;
            return (
              <div key={coinId} className="price-line">
                <div>
                  <p className="price-name">{coinLabels[coinId] ?? coinId}</p>
                  <p className="price-symbol">{coinId.toUpperCase()}</p>
                </div>
                <div className="price-meta">
                  <p className="price-value">
                    ${coinData.usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className={`price-change ${change >= 0 ? 'positive' : 'negative'}`}>
                    {change >= 0 ? '+' : ''}
                    {change.toFixed(2)}%
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="summary-panel">
        <div className="summary-copy">
          <p className="section-label">A deliberate classic look</p>
          <h2>Built like an analog dashboard for the digital age.</h2>
          <p>
            The interface is structured with wide spacing, chunky borders, and soft contrast. It feels less like an app and more like a statement.
          </p>
        </div>

        <div className="summary-grid">
          <article className="feature-card">
            <h3>Strong visual rhythm</h3>
            <p>Lines, blocks, and typography guide your eye with purpose instead of hidden card stacks.</p>
          </article>
          <article className="feature-card">
            <h3>Custom palette</h3>
            <p>Using your chosen colors across the entire view for a cohesive and memorable look.</p>
          </article>
          <article className="feature-card">
            <h3>Ready for growth</h3>
            <p>The layout is complete enough to add data feeds, charts, and persistence later without changing the feel.</p>
          </article>
          <article className="feature-card accent-card">
            <h3>Next step</h3>
            <p>Functions and database support can be layered in after the frontend is settled.</p>
          </article>
        </div>
      </section>

      <footer className="footer-note">
        <p>Everything is styled, spaced, and polished for a full frontend experience before we wire in backend details.</p>
      </footer>
    </main>
  );
}
