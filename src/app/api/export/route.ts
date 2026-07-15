import { NextResponse } from 'next/server';
import { getStrains } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format') ?? 'json';
    const strains = await getStrains();

    if (format === 'csv') {
      const header = 'id,name,type,vendor,consumption,effects,price,rating,cbd_percent,makes_high,image_url,created_at';
      const rows = strains.map((s) => {
        const esc = (v: string | number | boolean | null) => {
          const str = v === null ? '' : String(v);
          return `"${str.replace(/"/g, '""')}"`;
        };
        return [s.id, s.name, s.type, s.vendor, s.consumption, s.effects, s.price, s.rating, s.cbd_percent, s.makes_high, s.image_url, s.created_at]
          .map(esc)
          .join(',');
      });
      const csv = [header, ...rows].join('\n');
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="strains.csv"',
        },
      });
    }

    return new NextResponse(JSON.stringify(strains, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment; filename="strains.json"',
      },
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to export' }, { status: 500 });
  }
}