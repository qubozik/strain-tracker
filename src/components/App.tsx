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
  const [showAdd, setShowAdd] = useState(false);

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

      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-lg font-semibold">Your Strains ({strains.length})</h2>
        <div className="flex items-center gap-2">
          <ExportButtons />
          <button
            onClick={() => setShowAdd(true)}
            className="px-4 py-1.5 rounded-lg bg-brand hover:bg-brand-hover text-brand-fg font-medium text-sm transition-colors"
          >
            + Add Strain
          </button>
        </div>
      </div>

      <StrainList initialStrains={strains} refresh={refresh} />

      {showAdd && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 p-4 overflow-y-auto"
          onClick={() => setShowAdd(false)}
        >
          <div
            className="w-full max-w-2xl mt-10 rounded-xl border border-line bg-surface p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Add a Strain</h2>
              <button
                onClick={() => setShowAdd(false)}
                aria-label="Close"
                className="h-8 w-8 rounded-lg border border-line bg-surface2 hover:bg-surface text-lg leading-none"
              >
                ×
              </button>
            </div>
            <AddForm
              onAdded={() => {
                refresh();
                setShowAdd(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}