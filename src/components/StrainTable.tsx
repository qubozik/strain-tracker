'use client';

import { useState } from 'react';
import type { Strain } from '@/lib/db';
import Lightbox from './Lightbox';

interface StrainTableProps {
  strains: Strain[];
  onEdit: (strain: Strain) => void;
  onDelete: (strain: Strain) => void;
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="whitespace-nowrap">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= rating ? 'text-star' : 'text-line'}>
          ★
        </span>
      ))}
    </span>
  );
}

export default function StrainTable({ strains, onEdit, onDelete }: StrainTableProps) {
  const [lightbox, setLightbox] = useState<string[] | null>(null);
  return (
    <div className="overflow-x-auto rounded-xl border border-line">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-surface2 text-muted text-left">
            <th className="px-3 py-2 font-medium">Photo</th>
            <th className="px-3 py-2 font-medium">Name</th>
            <th className="px-3 py-2 font-medium">Type</th>
            <th className="px-3 py-2 font-medium">Vendor</th>
            <th className="px-3 py-2 font-medium">Consumption</th>
            <th className="px-3 py-2 font-medium">Terpenes</th>
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
            <tr key={s.id} className="border-t border-line hover:bg-surface2/50">
              <td className="px-3 py-2">
                {s.images && s.images.length > 0 ? (
                  <button type="button" onClick={() => setLightbox(s.images)} className="block cursor-zoom-in" aria-label={`Expand ${s.name} photo`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.images[0]} alt={s.name} className="h-10 w-10 object-cover rounded border border-line" />
                  </button>
                ) : (
                  <div className="h-10 w-10 rounded border border-line bg-surface2" />
                )}
              </td>
              <td className="px-3 py-2 font-medium">{s.name}</td>
              <td className="px-3 py-2 text-fg">{s.type}</td>
              <td className="px-3 py-2 text-muted">{s.vendor || '—'}</td>
              <td className="px-3 py-2 text-muted">{s.consumption ?? 'Flower'}</td>
              <td className="px-3 py-2 text-muted">{s.terpenes && s.terpenes.length > 0 ? s.terpenes.join(', ') : '—'}</td>
              <td className="px-3 py-2 text-muted max-w-48 truncate">{s.effects || '—'}</td>
              <td className="px-3 py-2 text-right text-fg">${Number(s.price).toFixed(2)}</td>
              <td className="px-3 py-2 text-right text-fg">
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
                    className="text-xs px-2 py-1 rounded-lg bg-surface2 hover:bg-surface border border-line"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(s)}
                    className="text-xs px-2 py-1 rounded-lg bg-earth-red/15 text-earth-red hover:bg-earth-red/25 border border-earth-red/40"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {lightbox && (
        <Lightbox images={lightbox} index={0} onClose={() => setLightbox(null)} />
      )}
    </div>
  );
}