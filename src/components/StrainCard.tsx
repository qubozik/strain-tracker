'use client';

import { useState } from 'react';

interface Strain {
  id: number;
  name: string;
  type: string;
  effects: string;
  price: number;
  rating: number;
  image_url: string | null;
  created_at: string;
}

interface StrainCardProps {
  strain: Strain;
  onUpdated: () => void;
  onDeleted: () => void;
}

const strainTypes = ['Sativa', 'Indica', 'Hybrid', 'Indica-dominant', 'Sativa-dominant', 'CBD'];

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={`text-lg ${star <= rating ? 'text-yellow-400' : 'text-neutral-700'}`}>
          ★
        </span>
      ))}
    </div>
  );
}

function typeColor(type: string): string {
  switch (type) {
    case 'Sativa':
    case 'Sativa-dominant':
      return 'bg-orange-900/40 text-orange-300 border-orange-700/50';
    case 'Indica':
    case 'Indica-dominant':
      return 'bg-purple-900/40 text-purple-300 border-purple-700/50';
    case 'Hybrid':
      return 'bg-blue-900/40 text-blue-300 border-blue-700/50';
    case 'CBD':
      return 'bg-teal-900/40 text-teal-300 border-teal-700/50';
    default:
      return 'bg-neutral-800 text-neutral-300 border-neutral-700';
  }
}

export default function StrainCard({ strain, onUpdated, onDeleted }: StrainCardProps) {
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // editable local state
  const [name, setName] = useState(strain.name);
  const [type, setType] = useState(strain.type);
  const [effects, setEffects] = useState(strain.effects);
  const [price, setPrice] = useState(String(strain.price));
  const [rating, setRating] = useState(strain.rating);
  const [imageUrl, setImageUrl] = useState(strain.image_url ?? '');

  async function handleSave() {
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`/api/strains`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: strain.id,
          name,
          type,
          effects,
          price: parseFloat(price) || 0,
          rating,
          image_url: imageUrl || undefined,
        }),
      });
      if (!res.ok) throw new Error('Failed to update');
      setEditing(false);
      onUpdated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete "${strain.name}"?`)) return;
    const res = await fetch(`/api/strains`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: strain.id }),
    });
    if (res.ok) onDeleted();
  }

  if (editing) {
    return (
      <div className="rounded-xl border border-neutral-700 bg-neutral-900 p-5 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input value={name} onChange={(e) => setName(e.target.value)} className="rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 focus:border-green-600 focus:outline-none" />
          <select value={type} onChange={(e) => setType(e.target.value)} className="rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 focus:border-green-600 focus:outline-none">
            {strainTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <input value={effects} onChange={(e) => setEffects(e.target.value)} placeholder="Effects" className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 focus:border-green-600 focus:outline-none" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} className="rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 focus:border-green-600 focus:outline-none" />
          <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Image URL" className="rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 focus:border-green-600 focus:outline-none" />
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} type="button" onClick={() => setRating(star === rating ? 0 : star)} className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-neutral-600'}`}>★</button>
          ))}
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex gap-2">
          <button onClick={handleSave} disabled={submitting} className="px-4 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 disabled:opacity-50 text-sm">Save</button>
          <button onClick={() => setEditing(false)} className="px-4 py-1.5 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-sm">Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-neutral-700 bg-neutral-900 overflow-hidden">
      {strain.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={strain.image_url} alt={strain.name} className="w-full h-40 object-cover" />
      )}
      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold">{strain.name}</h3>
            <span className={`inline-block text-xs px-2 py-0.5 rounded-full border mt-1 ${typeColor(strain.type)}`}>
              {strain.type}
            </span>
          </div>
          <StarRow rating={strain.rating} />
        </div>
        {strain.effects && (
          <p className="text-sm text-neutral-400">{strain.effects}</p>
        )}
        <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
          <span className="text-neutral-300 font-medium">${Number(strain.price).toFixed(2)}</span>
          <span className="text-xs text-neutral-500">
            {new Date(strain.created_at).toLocaleDateString()}
          </span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setEditing(true)} className="text-xs px-3 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-700">Edit</button>
          <button onClick={handleDelete} className="text-xs px-3 py-1 rounded-lg bg-red-900/40 text-red-300 hover:bg-red-800/60 border border-red-800/50">Delete</button>
        </div>
      </div>
    </div>
  );
}