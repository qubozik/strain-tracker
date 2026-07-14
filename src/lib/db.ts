import { neon } from "@neondatabase/serverless";

let connectionString = process.env.DATABASE_URL;
let _sql: ReturnType<typeof neon> | null = null;

function getConnectionString(): string {
  connectionString = connectionString || process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  return connectionString;
}

export const sql: ReturnType<typeof neon> = ((...args: unknown[]) => {
  if (!_sql) _sql = neon(getConnectionString());
  return (_sql as (...a: unknown[]) => unknown)(...args);
}) as ReturnType<typeof neon>;

export interface Strain {
  id: number;
  name: string;
  type: string;
  effects: string;
  price: number;
  rating: number;
  image_url: string | null;
  created_at: string;
}

export async function ensureSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS strains (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      effects TEXT NOT NULL DEFAULT '',
      price NUMERIC(10,2) NOT NULL DEFAULT 0,
      rating INTEGER NOT NULL DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
      image_url TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}

export async function getStrains(): Promise<Strain[]> {
  await ensureSchema();
  const rows = await sql`
    SELECT id, name, type, effects, price, rating, image_url, created_at
    FROM strains
    ORDER BY created_at DESC
  `;
  return rows as Strain[];
}

export async function createStrain(data: {
  name: string;
  type: string;
  effects: string;
  price: number;
  rating: number;
  image_url?: string;
}): Promise<Strain> {
  await ensureSchema();
  const rows = await sql`
    INSERT INTO strains (name, type, effects, price, rating, image_url)
    VALUES (${data.name}, ${data.type}, ${data.effects}, ${data.price}, ${data.rating}, ${data.image_url ?? null})
    RETURNING id, name, type, effects, price, rating, image_url, created_at
  `;
  return (rows as Strain[])[0];
}

export async function updateStrain(
  id: number,
  data: {
    name: string;
    type: string;
    effects: string;
    price: number;
    rating: number;
    image_url?: string;
  }
): Promise<Strain | null> {
  const rows = await sql`
    UPDATE strains SET
      name = ${data.name},
      type = ${data.type},
      effects = ${data.effects},
      price = ${data.price},
      rating = ${data.rating},
      image_url = ${data.image_url ?? null}
    WHERE id = ${id}
    RETURNING id, name, type, effects, price, rating, image_url, created_at
  `;
  return (rows as Strain[])[0] ?? null;
}

export async function deleteStrain(id: number): Promise<void> {
  await sql`DELETE FROM strains WHERE id = ${id}`;
}

export interface Stats {
  total: number;
  avgPrice: number;
  avgRating: number;
  typeCounts: Record<string, number>;
  bestRated: Strain | null;
}

export async function getStats(): Promise<Stats> {
  const strains = await getStrains();
  if (strains.length === 0) {
    return { total: 0, avgPrice: 0, avgRating: 0, typeCounts: {}, bestRated: null };
  }
  const avgPrice = strains.reduce((s, x) => s + Number(x.price), 0) / strains.length;
  const avgRating = strains.reduce((s, x) => s + x.rating, 0) / strains.length;
  const typeCounts = strains.reduce<Record<string, number>>((acc, x) => {
    acc[x.type] = (acc[x.type] ?? 0) + 1;
    return acc;
  }, {});
  const bestRated = strains.reduce((best, x) => (x.rating > best.rating ? x : best), strains[0]);
  return { total: strains.length, avgPrice, avgRating, typeCounts, bestRated };
}