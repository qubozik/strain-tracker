'use client';

import { useState } from 'react';
import ImageInput from './ImageInput';

interface AddFormProps {
  onAdded: () => void;
}

const strainTypes = ['Sativa', 'Indica', 'Hybrid', 'Indica-dominant', 'Sativa-dominant', 'CBD'];
const consumptionMethods = ['Flower', 'Cart', 'Concentrate', 'Edible', 'Pre-roll', 'Vape', 'Tincture', 'Topical'];

export default function AddForm({ onAdded }: AddFormProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState('Hybrid');
  const [effects, setEffects] = useState('');
  const [price, setPrice] = useState('');
  const [rating, setRating] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [cbdPercent, setCbdPercent] = useState('');
  const [makesHigh, setMakesHigh] = useState(true);
  const [consumption, setConsumption] = useState('Flower');
  const [vendor, setVendor] = useState('');
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
          images,
          cbd_percent: cbdPercent === '' ? null : parseFloat(cbdPercent),
          makes_high: makesHigh,
          consumption,
          vendor,
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
      setImages([]);
      setCbdPercent('');
      setMakesHigh(true);
      setConsumption('Flower');
      setVendor('');
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
          <label className="block text-sm text-muted mb-1">Strain Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-lg bg-surface2 border border-line px-3 py-2 focus:border-brand focus:outline-none"
            placeholder="e.g. Blue Dream"
          />
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-lg bg-surface2 border border-line px-3 py-2 focus:border-brand focus:outline-none"
          >
            {strainTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm text-muted mb-1">Effects</label>
        <input
          value={effects}
          onChange={(e) => setEffects(e.target.value)}
          className="w-full rounded-lg bg-surface2 border border-line px-3 py-2 focus:border-brand focus:outline-none"
          placeholder="e.g. Happy, relaxed, creative"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-muted mb-1">Consumption Method</label>
          <select
            value={consumption}
            onChange={(e) => setConsumption(e.target.value)}
            className="w-full rounded-lg bg-surface2 border border-line px-3 py-2 focus:border-brand focus:outline-none"
          >
            {consumptionMethods.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">Vendor / Company</label>
          <input
            value={vendor}
            onChange={(e) => setVendor(e.target.value)}
            className="w-full rounded-lg bg-surface2 border border-line px-3 py-2 focus:border-brand focus:outline-none"
            placeholder="e.g. Cookies, Raw Garden"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-muted mb-1">Price ($)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full rounded-lg bg-surface2 border border-line px-3 py-2 focus:border-brand focus:outline-none"
            placeholder="0.00"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-muted mb-1">Photos (up to 3)</label>
        <ImageInput images={images} onChange={setImages} max={3} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-muted mb-1">CBD % (if product also contains THC)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="100"
            value={cbdPercent}
            onChange={(e) => setCbdPercent(e.target.value)}
            className="w-full rounded-lg bg-surface2 border border-line px-3 py-2 focus:border-brand focus:outline-none"
            placeholder="e.g. 12.5"
          />
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 cursor-pointer select-none py-2">
            <input
              type="checkbox"
              checked={makesHigh}
              onChange={(e) => setMakesHigh(e.target.checked)}
              className="h-5 w-5 rounded border-line bg-surface2 accent-brand"
            />
            <span className="text-sm text-fg">Makes me high (psychoactive)</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm text-muted mb-1">Your Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star === rating ? 0 : star)}
              className={`text-3xl transition-colors ${star <= rating ? 'text-star' : 'text-line'}`}
              aria-label={`Rate ${star} stars`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-earth-red text-sm">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full sm:w-auto px-6 py-2 rounded-lg bg-brand hover:bg-brand-hover text-brand-fg disabled:opacity-50 font-medium transition-colors"
      >
        {submitting ? 'Adding...' : 'Add Strain'}
      </button>
    </form>
  );
}