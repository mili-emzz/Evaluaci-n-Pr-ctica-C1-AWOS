import { Pool } from 'pg';

let pool: Pool | null = null;

function replaceDbInUrl(url: string | undefined, dbName: string) {
  if (!url) return url;
  try {
    const u = new URL(url);
    u.pathname = `/${dbName}`;
    return u.toString();
  } catch {
    return url.replace(/\/[^/]+$/, `/${dbName}`);
  }
}

export function getDb() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }
  return pool;
}

export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<T[]> {
  const db = getDb();
  const result = await db.query(text, params);
  return result.rows;
}