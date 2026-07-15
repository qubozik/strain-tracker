import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { getStrains } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const url = process.env.DATABASE_URL;
  const urlPreview = url
    ? url.replace(/\/\/([^:]+):([^@]+)@/, '//$1:***@')
    : null;

  if (!url) {
    return NextResponse.json({ DATABASE_URL_set: false });
  }

  // Attempt an actual query to surface the real runtime error
  try {
    const sql = neon(url);
    const rows = await sql`SELECT 1 AS ok`;
    let appQuery: string;
    let count = -1;
    try {
      const strains = await getStrains();
      count = strains.length;
      appQuery = 'success';
    } catch (e) {
      appQuery = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
    }
    return NextResponse.json({
      DATABASE_URL_set: true,
      DATABASE_URL_preview: urlPreview,
      connection_test: 'success',
      result: rows,
      app_getStrains: appQuery,
      strain_count: count,
    });
  } catch (err) {
    return NextResponse.json({
      DATABASE_URL_set: true,
      DATABASE_URL_preview: urlPreview,
      connection_test: 'failed',
      error: err instanceof Error ? err.message : String(err),
      error_name: err instanceof Error ? err.name : 'Unknown',
      stack: err instanceof Error ? err.stack?.split('\n').slice(0, 5) : undefined,
    });
  }
}