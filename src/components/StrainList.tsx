'use client';

import { useState, useMemo } from 'react';
import type { Strain } from '@/lib/db';
import StrainCard from './StrainCard';
import StrainTable from './StrainTable';

interface StrainListProps {
  initialStrains: Strain[];
  refresh: () => void;
}

type ViewMode = 'grid' | 'table';

export default function StrainList({ initialStrains, refresh }: StrainListProps) {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [view, setView] = useState<ViewMode>('grid');
  const [editingStrain, setEditingStrain] = useState<Strain | null>(null);

  const types = useMemo(() => {
    const set = new Set(initialStrains.map((s) => s.type));
    return ['All', ...Array.from(set)];
  }, [initialStrains]);

  const filtered = useMemo(() => {
    return initialStrains.filter((s) => {
      const matchesType = typeFilter === 'All' || s.type === typeFilter;
      const q = query.toLowerCase();
      const matchesQuery =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.effects.toLowerCase().includes(q) ||
        (s.vendor ?? '').toLowerCase().includes(q);
      return matchesType && matchesQuery;
    });
  }, [initialStrains, query, typeFilter]);

  async function handleDelete(strain: Strain) {
    if (!confirm(`Delete "${strain.name}"?`)) return;
    const res = await fetch('/api/strains', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: strain.id }),
    });
    if (res.ok) refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, effects, or vendor..."
          className="flex-1 min-w-48 rounded-lg bg-neutral-900 border border-neutral-700 px-3 py-2 focus:border-green-600 focus:outline-none"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-lg bg-neutral-900 border border-neutral-700 px-3 py-2 focus:border-green-600 focus:outline-none"
        >
          {types.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <div className="flex rounded-lg border border-neutral-700 overflow-hidden">
          <button
            onClick={() => setView('grid')}
            className={`px-3 py-2 text-sm ${view === 'grid' ? 'bg-green-600 text-white' : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800'}`}
            aria-label="Grid view"
          >
            Grid
          </button>
          <button
            onClick={() => setView('table')}
            className={`px-3 py-2 text-sm ${view === 'table' ? 'bg-green-600 text-white' : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800'}`}
            aria-label="Table view"
          >
            Table
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-neutral-500 text-center py-12">No strains found.</p>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((strain) => (
            <StrainCard
              key={strain.id}
              strain={strain}
              onUpdated={refresh}
              onDeleted={refresh}
            />
          ))}
        </div>
      ) : (
        <StrainTable
          strains={filtered}
          onEdit={(s) => setEditingStrain(s)}
          onDelete={handleDelete}
        />
      )}

      {editingStrain && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 p-4 overflow-y-auto"
          onClick={() => setEditingStrain(null)}
        >
          <div
            className="w-full max-w-lg mt-10"
            onClick={(e) => e.stopPropagation()}
          >
            <StrainCard
              strain={editingStrain}
              onUpdated={refresh}
              onDeleted={refresh}
              initialEditing
              onClose={() => setEditingStrain(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}