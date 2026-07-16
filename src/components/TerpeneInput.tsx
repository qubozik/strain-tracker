'use client';

interface TerpeneInputProps {
  terpenes: string[];
  onChange: (terpenes: string[]) => void;
}

const COMMON_TERPENES = [
  'Myrcene',
  'Limonene',
  'Caryophyllene',
  'Pinene',
  'Linalool',
  'Terpinolene',
  'Humulene',
  'Ocimene',
  'Bisabolol',
  'Nerolidol',
  'Guaiol',
  'Camphene',
  'Valencene',
  'Geraniol',
];

export default function TerpeneInput({ terpenes, onChange }: TerpeneInputProps) {
  // Always render 3 slots.
  const values = [terpenes[0] ?? '', terpenes[1] ?? '', terpenes[2] ?? ''];

  function setAt(i: number, val: string) {
    const next = [...values];
    next[i] = val;
    onChange(next.filter((v) => v.trim() !== ''));
  }

  return (
    <div>
      <datalist id="terpene-options">
        {COMMON_TERPENES.map((t) => (
          <option key={t} value={t} />
        ))}
      </datalist>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <input
            key={i}
            list="terpene-options"
            value={values[i]}
            onChange={(e) => setAt(i, e.target.value)}
            placeholder={`Terpene ${i + 1}`}
            className="w-full rounded-lg bg-surface2 border border-line px-3 py-2 focus:border-brand focus:outline-none"
          />
        ))}
      </div>
    </div>
  );
}