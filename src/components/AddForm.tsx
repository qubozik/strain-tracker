'use client';

import { useState } from 'react';

interface AddFormProps {
  onAdded: () => void;
}

const strainTypes = ['Sativa', 'Indica', 'Hybrid', 'Indica-dominant', 'Sativa-dominant', 'CBD'];

export default function AddForm({ onAdded }: AddFormProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState('Hybrid');
  const [effects, setEffects] = useState('');
  const [price, setPrice] = useState('');
  const [rating, setRating] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/strains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          type,
          effects,
          price: parseFloat(price) || 0,
          rating,
          image_url: imageUrl || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add strain');
      }
      setName('');
      setEffects('');
      setPrice('');
      setRating(0);
      setImageUrl('');
      onAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-neutral-400 mb-1">Strain Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-lg bg-neutral-900 border border-neutral-700 px-3 py-2 focus:border-green-600 focus:outline-none"
            placeholder="e.g. Blue Dream"
          />
        </div>
        <div>
          <label className="block text-sm text-neutral-400 mb-1">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-lg bg-neutral-900 border border-neutral-700 px-3 py-2 focus:border-green-600 focus:outline-none"
          >
            {strainTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm text-neutral-400 mb-1">Effects</label>
        <input
          value={effects}
          onChange={(e) => setEffects(e.target.value)}
          className="w-full rounded-lg bg-neutral-900 border border-neutral-700 px-3 py-2 focus:border-green-600 focus:outline-none"
          placeholder="e.g. Happy, relaxed, creative"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-neutral-400 mb-1">Price ($)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full rounded-lg bg-neutral-900 border border-neutral-700 px-3 py-2 focus:border-green-600 focus:outline-none"
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="block text-sm text-neutral-400 mb-1">Image URL (optional)</label>
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full rounded-lg bg-neutral-900 border border-neutral-700 px-3 py-2 focus:border-green-600 focus:outline-none"
            placeholder="https://..."
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-neutral-400 mb-1">Your Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star === rating ? 0 : star)}
              className={`text-3xl transition-colors ${star <= rating ? 'text-yellow-400' : 'text-neutral-600'}`}
              aria-label={`Rate ${star} stars`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full sm:w-auto px-6 py-2 rounded-lg bg-green-600 hover:bg-green-700 disabled:opacity-50 font-medium transition-colors"
      >
        {submitting ? 'Adding...' : 'Add Strain'}
      </button>
    </form>
  );
}