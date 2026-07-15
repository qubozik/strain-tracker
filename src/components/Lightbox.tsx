'use client';

import { useEffect, useState } from 'react';

interface LightboxProps {
  images: string[];
  index: number;
  onClose: () => void;
}

export default function Lightbox({ images, index, onClose }: LightboxProps) {
  const [current, setCurrent] = useState(index);

  useEffect(() => setCurrent(index), [index]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setCurrent((c) => (c + 1) % images.length);
      if (e.key === 'ArrowLeft') setCurrent((c) => (c - 1 + images.length) % images.length);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [images.length, onClose]);

  if (images.length === 0) return null;

  const hasMultiple = images.length > 1;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl leading-none flex items-center justify-center"
      >
        ×
      </button>

      {hasMultiple && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setCurrent((c) => (c - 1 + images.length) % images.length);
          }}
          aria-label="Previous"
          className="absolute left-4 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white text-3xl leading-none flex items-center justify-center"
        >
          ‹
        </button>
      )}

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={images[current]}
        alt={`Photo ${current + 1}`}
        className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
        onClick={(e) => e.stopPropagation()}
      />

      {hasMultiple && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setCurrent((c) => (c + 1) % images.length);
          }}
          aria-label="Next"
          className="absolute right-4 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white text-3xl leading-none flex items-center justify-center"
        >
          ›
        </button>
      )}

      {hasMultiple && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm">
          {current + 1} / {images.length}
        </div>
      )}
    </div>
  );
}