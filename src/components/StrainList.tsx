'use client';

import { useState, useMemo } from 'react';
import type { Strain } from '@/lib/db';
import StrainCard from './StrainCard';

interface StrainListProps {
  initialStrains: Strain[];
  refresh: () => void;
}

export default function StrainList({ initialStrains, refresh }: StrainListProps) {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

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
      </div>

      {filtered.length === 0 ? (
        <p className="text-neutral-500 text-center py-12">No strains found.</p>
      ) : (
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
      )}
    </div>
  );
}