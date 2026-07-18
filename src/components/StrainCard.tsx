'use client';

import { useState } from 'react';
import ImageInput from './ImageInput';
import TerpeneInput from './TerpeneInput';
import Lightbox from './Lightbox';

interface Strain {
  id: number;
  name: string;
  type: string;
  effects: string;
  price: number;
  rating: number;
  image_url: string | null;
  images: string[];
  terpenes: string[];
  cbd_percent: number | null;
  makes_high: boolean;
  consumption: string;
  vendor: string;
  created_at: string;
}

interface StrainCardProps {
  strain: Strain;
  onUpdated: () => void;
  onDeleted: () => void;
  initialEditing?: boolean;
  onClose?: () => void;
}

const strainTypes = ['Sativa', 'Indica', 'Hybrid', 'Indica-dominant', 'Sativa-dominant', 'CBD'];
const consumptionMethods = ['Flower', 'Cart', 'Concentrate', 'Edible', 'Pre-roll', 'Vape', 'Tincture', 'Topical'];

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={`text-lg ${star <= rating ? 'text-star' : 'text-line'}`}>
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
      return 'bg-earth-orange/15 text-earth-orange border-earth-orange/40';
    case 'Indica':
    case 'Indica-dominant':
      return 'bg-earth-blue/15 text-earth-blue border-earth-blue/40';
    case 'Hybrid':
      return 'bg-brand/15 text-brand border-brand/40';
    case 'CBD':
      return 'bg-brand/10 text-brand border-brand/30';
    default:
      return 'bg-surface2 text-muted border-line';
  }
}

export default function StrainCard({ strain, onUpdated, onDeleted, initialEditing = false, onClose }: StrainCardProps) {
  const [editing, setEditing] = useState(initialEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // editable local state
  const [name, setName] = useState(strain.name);
  const [type, setType] = useState(strain.type);
  const [effects, setEffects] = useState(strain.effects);
  const [price, setPrice] = useState(String(strain.price));
  const [rating, setRating] = useState(strain.rating);
  const [images, setImages] = useState<string[]>(strain.images ?? []);
  const [terpenes, setTerpenes] = useState<string[]>(strain.terpenes ?? []);
  const [cbdPercent, setCbdPercent] = useState(
    strain.cbd_percent === null || strain.cbd_percent === undefined ? '' : String(strain.cbd_percent)
  );
  const [makesHigh, setMakesHigh] = useState(strain.makes_high);
  const [consumption, setConsumption] = useState(strain.consumption ?? 'Flower');
  const [vendor, setVendor] = useState(strain.vendor ?? '');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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
          images,
          terpenes,
          cbd_percent: cbdPercent === '' ? null : parseFloat(cbdPercent),
          makes_high: makesHigh,
          consumption,
          vendor,
        }),
      });
      if (!res.ok) throw new Error('Failed to update');
      setEditing(false);
      onUpdated();
      onClose?.();
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
      <div className="rounded-xl border border-line bg-surface p-5 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input value={name} onChange={(e) => setName(e.target.value)} className="rounded-lg bg-surface2 border border-line px-3 py-2 focus:border-brand focus:outline-none" />
          <select value={type} onChange={(e) => setType(e.target.value)} className="rounded-lg bg-surface2 border border-line px-3 py-2 focus:border-brand focus:outline-none">
            {strainTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <input value={effects} onChange={(e) => setEffects(e.target.value)} placeholder="Effects" className="w-full rounded-lg bg-surface2 border border-line px-3 py-2 focus:border-brand focus:outline-none" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <select value={consumption} onChange={(e) => setConsumption(e.target.value)} className="rounded-lg bg-surface2 border border-line px-3 py-2 focus:border-brand focus:outline-none">
            {consumptionMethods.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <input value={vendor} onChange={(e) => setVendor(e.target.value)} placeholder="Vendor / Company" className="rounded-lg bg-surface2 border border-line px-3 py-2 focus:border-brand focus:outline-none" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} className="rounded-lg bg-surface2 border border-line px-3 py-2 focus:border-brand focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">Photos (up to 3)</label>
          <ImageInput images={images} onChange={setImages} max={3} />
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">Top 3 Terpenes</label>
          <TerpeneInput terpenes={terpenes} onChange={setTerpenes} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input type="number" step="0.1" min="0" max="100" value={cbdPercent} onChange={(e) => setCbdPercent(e.target.value)} placeholder="CBD %" className="rounded-lg bg-surface2 border border-line px-3 py-2 focus:border-brand focus:outline-none" />
          <label className="flex items-center gap-2 cursor-pointer select-none px-1">
            <input type="checkbox" checked={makesHigh} onChange={(e) => setMakesHigh(e.target.checked)} className="h-5 w-5 rounded border-line bg-surface2 accent-brand" />
            <span className="text-sm text-fg">Makes me high</span>
          </label>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} type="button" onClick={() => setRating(star === rating ? 0 : star)} className={`text-2xl ${star <= rating ? 'text-star' : 'text-line'}`}>★</button>
          ))}
        </div>
        {error && <p className="text-earth-red text-sm">{error}</p>}
        <div className="flex gap-2">
          <button onClick={handleSave} disabled={submitting} className="px-4 py-1.5 rounded-lg bg-brand hover:bg-brand-hover text-brand-fg disabled:opacity-50 text-sm">Save</button>
          <button onClick={() => { setEditing(false); onClose?.(); }} className="px-4 py-1.5 rounded-lg bg-surface2 hover:bg-surface border border-line text-sm">Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-line bg-surface overflow-hidden">
      {strain.images && strain.images.length > 0 && (
        <div className={`grid gap-0.5 ${strain.images.length === 1 ? 'grid-cols-1' : 'grid-cols-3'}`}>
          {strain.images.slice(0, 3).map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setLightboxIndex(i)}
              className="block cursor-zoom-in"
              aria-label={`Expand photo ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`${strain.name} photo ${i + 1}`}
                className={`w-full object-cover ${strain.images.length === 1 ? 'h-40' : 'h-24'}`}
              />
            </button>
          ))}
        </div>
      )}
      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold">{strain.name}</h3>
            <span className={`inline-block text-xs px-2 py-0.5 rounded-full border mt-1 ${typeColor(strain.type)}`}>
              {strain.type}
            </span>
            {strain.vendor && (
              <p className="text-xs text-muted mt-1">{strain.vendor}</p>
            )}
          </div>
          <StarRow rating={strain.rating} />
        </div>
        {strain.effects && (
          <p className="text-sm text-muted">{strain.effects}</p>
        )}
        {strain.terpenes && strain.terpenes.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {strain.terpenes.map((t, i) => (
              <span key={i} className="inline-block text-xs px-2 py-0.5 rounded-full border bg-earth-orange/10 text-earth-orange border-earth-orange/30">
                {t}
              </span>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          <span className="inline-block text-xs px-2 py-0.5 rounded-full border bg-surface2 text-fg border-line">
            {strain.consumption ?? 'Flower'}
          </span>
          {strain.cbd_percent !== null && strain.cbd_percent !== undefined && (
            <span className="inline-block text-xs px-2 py-0.5 rounded-full border bg-brand/10 text-brand border-brand/30">
              CBD {Number(strain.cbd_percent)}%
            </span>
          )}
          <span
            className={`inline-block text-xs px-2 py-0.5 rounded-full border ${
              strain.makes_high
                ? 'bg-earth-orange/15 text-earth-orange border-earth-orange/40'
                : 'bg-surface2 text-muted border-line'
            }`}
          >
            {strain.makes_high ? 'Psychoactive' : 'Non-psychoactive'}
          </span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-line">
          <span className="text-fg font-medium">${Number(strain.price).toFixed(2)}</span>
          <span className="text-xs text-muted">
            {new Date(strain.created_at).toLocaleDateString()}
          </span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setEditing(true)} className="text-xs px-3 py-1 rounded-lg bg-surface2 hover:bg-surface border border-line">Edit</button>
          <button onClick={handleDelete} className="text-xs px-3 py-1 rounded-lg bg-earth-red/15 text-earth-red hover:bg-earth-red/25 border border-earth-red/40">Delete</button>
        </div>
      </div>
      {lightboxIndex !== null && (
        <Lightbox
          images={strain.images}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
}