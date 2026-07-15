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

  let dbError: string | null = null;

  try {
    [strains, stats] = await Promise.all([getStrains(), getStats()]);
  } catch (err) {
    dbError = err instanceof Error ? err.message : String(err);
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

      {dbError && (
        <div className="rounded-xl border border-red-800/50 bg-red-900/20 text-red-200 p-4 mb-6">
          <p className="text-sm">
            <strong>Database error:</strong> {dbError}
          </p>
          <p className="text-xs mt-2 text-red-300/70">
 Visit <code>/api/debug</code> for connection diagnostics. Ensure <code>DATABASE_URL</code> is set for the Production environment in Vercel and that you redeployed after adding it.
          </p>
        </div>
      )}

      {!dbError && strains.length === 0 && stats.total === 0 && (
        <div className="rounded-xl border border-neutral-700 bg-neutral-900 text-neutral-300 p-4 mb-6">
          <p className="text-sm">
            <strong>No strains yet.</strong> Add your first strain using the form below to get started.
          </p>
        </div>
      )}

      <App initialStrains={strains} initialStats={stats} />
    </main>
  );
}