'use client';

import { useState, useCallback } from 'react';
import type { Strain, Stats } from '@/lib/db';
import AddForm from './AddForm';
import StrainList from './StrainList';
import Dashboard from './Dashboard';
import ExportButtons from './ExportButtons';

interface AppProps {
  initialStrains: Strain[];
  initialStats: Stats;
}

export default function App({ initialStrains, initialStats }: AppProps) {
  const [strains, setStrains] = useState(initialStrains);
  const [stats, setStats] = useState(initialStats);

  const refresh = useCallback(async () => {
    const [strainsRes, statsRes] = await Promise.all([
      fetch('/api/strains'),
      fetch('/api/stats'),
    ]);
    if (strainsRes.ok) setStrains(await strainsRes.json());
    if (statsRes.ok) setStats(await statsRes.json());
  }, []);

  return (
    <div className="space-y-8">
      <Dashboard stats={stats} strains={strains} />

      <div className="rounded-xl border border-line bg-surface p-6">
        <h2 className="text-lg font-semibold mb-4">Add a Strain</h2>
        <AddForm onAdded={refresh} />
      </div>

      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-lg font-semibold">Your Strains ({strains.length})</h2>
        <ExportButtons />
      </div>

      <StrainList initialStrains={strains} refresh={refresh} />
    </div>
  );
}