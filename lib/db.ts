import { Pool } from "pg";

const globalForPg = globalThis as unknown as {
  pgPool?: Pool;
};

function createPool(): Pool {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set.");
  }

  // Enable SSL automatically if specified in the URL or via DATABASE_SSL=true
  const useSsl =
    process.env.DATABASE_SSL === "true" ||
    connectionString.includes("sslmode=require");

  return new Pool({
    connectionString,
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