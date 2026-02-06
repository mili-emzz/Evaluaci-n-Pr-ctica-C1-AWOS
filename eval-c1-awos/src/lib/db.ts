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
  try {
    const result = await db.query(text, params);
    return result.rows;
  } catch (err: any) {
    const message: string = err?.message ?? '';
    if (message.includes('does not exist') && process.env.DATABASE_URL) {
      // try fallback to 'postgres' database (useful when volume lost/init skipped)
      const fallback = replaceDbInUrl(process.env.DATABASE_URL, 'postgres');
      const fallbackPool = new Pool({ connectionString: fallback });
      try {
        const res = await fallbackPool.query(text, params);
        await fallbackPool.end();
        return res.rows;
      } catch {
        await fallbackPool.end();
      }
    }
    throw err;
  }
}