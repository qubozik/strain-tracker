'use client';

import type { Strain } from '@/lib/db';

interface StrainTableProps {
  strains: Strain[];
  onEdit: (strain: Strain) => void;
  onDelete: (strain: Strain) => void;
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="whitespace-nowrap">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= rating ? 'text-yellow-400' : 'text-neutral-700'}>
          ★
        </span>
      ))}
    </span>
  );
}

export default function StrainTable({ strains, onEdit, onDelete }: StrainTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-700">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-neutral-900 text-neutral-400 text-left">
            <th className="px-3 py-2 font-medium">Name</th>
            <th className="px-3 py-2 font-medium">Type</th>
            <th className="px-3 py-2 font-medium">Vendor</th>
            <th className="px-3 py-2 font-medium">Consumption</th>
            <th className="px-3 py-2 font-medium">Effects</th>
            <th className="px-3 py-2 font-medium text-right">Price</th>
            <th className="px-3 py-2 font-medium text-right">CBD %</th>
            <th className="px-3 py-2 font-medium text-center">High</th>
            <th className="px-3 py-2 font-medium">Rating</th>
            <th className="px-3 py-2 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {strains.map((s) => (
            <tr key={s.id} className="border-t border-neutral-800 hover:bg-neutral-900/50">
              <td className="px-3 py-2 font-medium">{s.name}</td>
              <td className="px-3 py-2 text-neutral-300">{s.type}</td>
              <td className="px-3 py-2 text-neutral-400">{s.vendor || '—'}</td>
              <td className="px-3 py-2 text-neutral-400">{s.consumption ?? 'Flower'}</td>
              <td className="px-3 py-2 text-neutral-400 max-w-48 truncate">{s.effects || '—'}</td>
              <td className="px-3 py-2 text-right text-neutral-300">${Number(s.price).toFixed(2)}</td>
              <td className="px-3 py-2 text-right text-neutral-300">
                {s.cbd_percent !== null && s.cbd_percent !== undefined ? `${Number(s.cbd_percent)}%` : '—'}
              </td>
              <td className="px-3 py-2 text-center">{s.makes_high ? 'Yes' : 'No'}</td>
              <td className="px-3 py-2">
                <Stars rating={s.rating} />
              </td>
              <td className="px-3 py-2">
                <div className="flex gap-1 justify-end">
                  <button
                    onClick={() => onEdit(s)}
                    className="text-xs px-2 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(s)}
                    className="text-xs px-2 py-1 rounded-lg bg-red-900/40 text-red-300 hover:bg-red-800/60 border border-red-800/50"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}