'use client';

import type { Strain, Stats } from '@/lib/db';

interface DashboardProps {
  stats: Stats;
  strains: Strain[];
}

export default function Dashboard({ stats, strains }: DashboardProps) {
  if (stats.total === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="rounded-xl border border-neutral-700 bg-neutral-900 p-4">
        <p className="text-xs text-neutral-400 uppercase tracking-wide">Total Strains</p>
        <p className="text-2xl font-bold mt-1">{stats.total}</p>
      </div>
      <div className="rounded-xl border border-neutral-700 bg-neutral-900 p-4">
        <p className="text-xs text-neutral-400 uppercase tracking-wide">Avg Price</p>
        <p className="text-2xl font-bold mt-1">${stats.avgPrice.toFixed(2)}</p>
      </div>
      <div className="rounded-xl border border-neutral-700 bg-neutral-900 p-4">
        <p className="text-xs text-neutral-400 uppercase tracking-wide">Avg Rating</p>
        <p className="text-2xl font-bold mt-1">{stats.avgRating.toFixed(1)} ★</p>
      </div>
      <div className="rounded-xl border border-neutral-700 bg-neutral-900 p-4">
        <p className="text-xs text-neutral-400 uppercase tracking-wide">Top Rated</p>
        <p className="text-lg font-semibold mt-1 truncate">{stats.bestRated?.name ?? '-'}</p>
      </div>
    </div>
  );
}