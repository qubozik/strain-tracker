'use client';

import { useRef, useState } from 'react';

interface ImageInputProps {
  images: string[];
  onChange: (images: string[]) => void;
  max?: number;
}

// Resize an uploaded image client-side to keep payloads small, return a JPEG data URL.
function resizeImage(file: File, maxDim = 1200, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas not supported'));
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ImageInput({ images, onChange, max = 3 }: ImageInputProps) {
  const [urlDraft, setUrlDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const canAdd = images.length < max;

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    try {
      const remaining = max - images.length;
      const chosen = Array.from(files).slice(0, remaining);
      const resized = await Promise.all(chosen.map((f) => resizeImage(f)));
      onChange([...images, ...resized].slice(0, max));
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  function addUrl() {
    const u = urlDraft.trim();
    if (!u) return;
    onChange([...images, u].slice(0, max));
    setUrlDraft('');
  }

  function removeAt(i: number) {
    onChange(images.filter((_, idx) => idx !== i));
  }

  return (
    <div className="space-y-2">
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {images.map((src, i) => (
            <div key={i} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`Photo ${i + 1}`} className="h-20 w-20 object-cover rounded-lg border border-line" />
              <button
                type="button"
                onClick={() => removeAt(i)}
                aria-label="Remove photo"
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-earth-red text-white text-xs leading-none flex items-center justify-center border border-line"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {canAdd && (
        <div className="flex flex-wrap gap-2">
          <input
            value={urlDraft}
            onChange={(e) => setUrlDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addUrl();
              }
            }}
            placeholder="Paste image URL..."
            className="flex-1 min-w-40 rounded-lg bg-surface2 border border-line px-3 py-2 focus:border-brand focus:outline-none"
          />
          <button
            type="button"
            onClick={addUrl}
            className="px-3 py-2 rounded-lg bg-surface2 hover:bg-surface border border-line text-sm"
          >
            Add URL
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={busy}
            className="px-3 py-2 rounded-lg bg-brand hover:bg-brand-hover text-brand-fg disabled:opacity-50 text-sm"
          >
            {busy ? 'Processing...' : 'Upload'}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      )}
      <p className="text-xs text-muted">
        {images.length}/{max} photos. Paste a URL or upload from your device.
      </p>
    </div>
  );
}