import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

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
    return NextResponse.json({
      DATABASE_URL_set: true,
      DATABASE_URL_preview: urlPreview,
      connection_test: 'success',
      result: rows,
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