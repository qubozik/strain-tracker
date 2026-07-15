'use client';

export default function ExportButtons() {
  async function download(format: 'json' | 'csv') {
    const res = await fetch(`/api/export?format=${format}`);
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `strains.${format}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => download('json')}
        className="px-3 py-1.5 rounded-lg bg-surface2 hover:bg-surface border border-line text-sm"
      >
        Export JSON
      </button>
      <button
        onClick={() => download('csv')}
        className="px-3 py-1.5 rounded-lg bg-surface2 hover:bg-surface border border-line text-sm"
      >
        Export CSV
      </button>
    </div>
  );
}