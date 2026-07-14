import { getStrains, getStats } from '@/lib/db';
import App from '@/components/App';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let strains: Awaited<ReturnType<typeof getStrains>> = [];
  let stats: Awaited<ReturnType<typeof getStats>> = {
    total: 0,
    avgPrice: 0,
    avgRating: 0,
    typeCounts: {},
    bestRated: null,
  };

  try {
    [strains, stats] = await Promise.all([getStrains(), getStats()]);
  } catch (err) {
    // DB not configured yet; render empty state with error banner
    console.error('DB error:', err);
  }

  return (
    <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="text-green-500">🌿</span> Strain Tracker
        </h1>
        <p className="text-neutral-400 mt-1">Track your strains, effects, prices, and ratings.</p>
      </header>

      {strains.length === 0 && stats.total === 0 && (
        <div className="rounded-xl border border-yellow-800/50 bg-yellow-900/20 text-yellow-200 p-4 mb-6">
          <p className="text-sm">
            <strong>Database not connected.</strong> Set the <code>DATABASE_URL</code> environment variable in Vercel with your Neon Postgres connection string.
          </p>
        </div>
      )}

      <App initialStrains={strains} initialStats={stats} />
    </main>
  );
}