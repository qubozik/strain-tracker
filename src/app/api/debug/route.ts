import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const hasUrl = !!process.env.DATABASE_URL;
  const urlPreview = process.env.DATABASE_URL
    ? process.env.DATABASE_URL.replace(/\/\/([^:]+):([^@]+)@/, '//$1:***@')
    : null;

  return NextResponse.json({
    DATABASE_URL_set: hasUrl,
    DATABASE_URL_preview: urlPreview,
    starts_with_postgres: urlPreview?.startsWith('postgres') ?? false,
    starts_with_neon: urlPreview?.includes('neon') ?? false,
    NODE_ENV: process.env.NODE_ENV,
  });
}