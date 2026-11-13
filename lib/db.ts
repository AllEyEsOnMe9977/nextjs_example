import { Pool } from "pg";

const globalForPg = globalThis as unknown as {
  pgPool?: Pool;
};

function createPool(): Pool {
  const rawUrl = process.env.DATABASE_URL;

  if (!rawUrl) {
    throw new Error("DATABASE_URL environment variable is not set.");
  }

  const parsedUrl = new URL(rawUrl);
  const sslMode = parsedUrl.searchParams.get("sslmode");
  const useSsl =
    process.env.DATABASE_SSL === "true" ||
    (sslMode !== null && sslMode !== "disable");

  // Strip sslmode so pg-connection-string does not override rejectUnauthorized: false
  parsedUrl.searchParams.delete("sslmode");

  return new Pool({
    connectionString: parsedUrl.toString(),
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
    ssl: useSsl ? { rejectUnauthorized: false } : undefined,
  });
}

export function getDbPool(): Pool {
  if (!globalForPg.pgPool) {
    globalForPg.pgPool = createPool();
  }
  return globalForPg.pgPool;
}