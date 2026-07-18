'use client';

import { useState } from 'react';
import { TERPENES, anxietyMeta } from '@/lib/terpenes';

interface TerpeneGuideProps {
  className?: string;
  children?: React.ReactNode;
}

export default function TerpeneGuide({ className, children }: TerpeneGuideProps) {
  const [open, setOpen] = useState(false);

  const helps = TERPENES.filter((t) => t.anxiety === 'helps');
  const worsens = TERPENES.filter((t) => t.anxiety === 'may-worsen');

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          className ??
          'px-3 py-1.5 rounded-lg border border-line bg-surface hover:bg-surface2 text-sm text-fg transition-colors'
        }
      >
        {children ?? '🧪 Terpene Guide'}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-start justify-center bg-black/70 p-4 overflow-y-auto"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-3xl my-8 rounded-xl border border-line bg-surface p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl font-bold">Terpene Guide</h2>
                <p className="text-muted text-sm mt-1">
                  Terpenes are aromatic compounds that shape a strain&apos;s smell, flavor, and
                  effects — and how it interacts with anxiety.
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="h-8 w-8 shrink-0 rounded-lg border border-line bg-surface2 hover:bg-surface text-lg leading-none"
              >
                ×
              </button>
            </div>

            {/* Anxiety callouts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <div className="rounded-lg border border-brand/40 bg-brand/10 p-3">
                <p className="text-sm font-semibold text-brand mb-1">Calming — may help anxiety</p>
                <p className="text-sm text-fg">
                  {helps.map((t) => t.name).join(', ')}
                </p>
                <p className="text-xs text-muted mt-2">
                  These lean sedative, mood-lifting, or stress-relieving. Great for winding down.
                </p>
              </div>
              <div className="rounded-lg border border-earth-red/40 bg-earth-red/10 p-3">
                <p className="text-sm font-semibold text-earth-red mb-1">
                  Energizing — may worsen anxiety
                </p>
                <p className="text-sm text-fg">
                  {worsens.map((t) => t.name).join(', ')}
                </p>
                <p className="text-xs text-muted mt-2">
                  These are stimulating/uplifting. In sensitive people or at higher doses, that
                  &quot;racy&quot; energy can heighten anxiety.
                </p>
              </div>
            </div>

            {/* Full list */}
            <div className="space-y-3">
              {TERPENES.map((t) => (
                <div key={t.name} className="rounded-lg border border-line bg-surface2/50 p-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h3 className="font-semibold">{t.name}</h3>
                    <span
                      className={`inline-block text-xs px-2 py-0.5 rounded-full border ${anxietyMeta[t.anxiety].badge}`}
                    >
                      {anxietyMeta[t.anxiety].label}
                    </span>
                  </div>
                  <p className="text-xs text-muted mt-1">
                    <span className="text-fg">Aroma:</span> {t.aroma} &nbsp;·&nbsp;{' '}
                    <span className="text-fg">Also in:</span> {t.foundIn}
                  </p>
                  <p className="text-sm mt-1">
                    <span className="text-muted">Effects:</span> {t.effects}
                  </p>
                  <p className="text-sm text-muted mt-1">{t.anxietyNote}</p>
                </div>
              ))}
            </div>

            <p className="text-xs text-muted mt-6 border-t border-line pt-3">
              Educational information only, not medical advice. Terpene effects vary by person,
              dose, and the &quot;entourage effect&quot; of how compounds combine. Research is still
              emerging.
            </p>
          </div>
        </div>
      )}
    </>
  );
}