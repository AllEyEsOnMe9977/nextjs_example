import { NextResponse } from "next/server";
import { getDbPool } from "../../../../lib/db";

// Prevent Next.js from caching this check at build time
export const dynamic = "force-dynamic";

export async function GET() {
  const startedAt = performance.now();

  try {
    const pool = getDbPool();
    const result = await pool.query<{
      server_time: string;
      pg_version: string;
      db_name: string;
    }>(
      "SELECT NOW() AS server_time, version() AS pg_version, current_database() AS db_name",
    );

    const latencyMs = Math.round(performance.now() - startedAt);
    const row = result.rows[0];
    // Extract short version like "PostgreSQL 16.4"
    const shortVersion =
      row?.pg_version?.split(" ").slice(0, 2).join(" ") ?? "PostgreSQL";

    return NextResponse.json({
      ok: true,
      latencyMs,
      database: row?.db_name ?? "unknown",
      version: shortVersion,
      serverTime: row?.server_time,
    });
  } catch (error) {
    const latencyMs = Math.round(performance.now() - startedAt);
    const message =
      error instanceof Error ? error.message : "Unknown database error";

    console.error("[DB Health Check Failed]:", message);

    return NextResponse.json(
      {
        ok: false,
        latencyMs,
        error: message,
      },
      { status: 500 },
    );
  }
}