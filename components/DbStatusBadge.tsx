"use client";

import { useCallback, useEffect, useState } from "react";
import { formatNumber } from "../lib/i18n";
import { useLanguage } from "./LanguageProvider";

interface HealthResponse {
  ok: boolean;
  latencyMs: number;
  database?: string;
  version?: string;
  serverTime?: string;
  error?: string;
}

export function DbStatusBadge() {
  const { locale, t } = useLanguage();
  const [status, setStatus] = useState<"checking" | "connected" | "error">(
    "checking",
  );
  const [data, setData] = useState<HealthResponse | null>(null);
  const [expanded, setExpanded] = useState(false);

  const checkConnection = useCallback(async () => {
    setStatus("checking");
    try {
      const res = await fetch("/api/health/db", { cache: "no-store" });
      const json: HealthResponse = await res.json();
      setData(json);
      setStatus(json.ok ? "connected" : "error");
    } catch {
      setData({
        ok: false,
        latencyMs: 0,
        error: "Failed to reach /api/health/db",
      });
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  return (
    <div className="relative inline-flex flex-col items-start sm:items-end">
      <div className="inline-flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="inline-flex items-center gap-2 rounded-full border border-zinc-200/90 bg-zinc-50/80 px-3 py-1 text-xs font-medium text-zinc-700 transition-all duration-200 hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-800"
        >
          <span className="relative flex h-2 w-2">
            {status === "connected" && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            )}
            <span
              className={`relative inline-flex h-2 w-2 rounded-full transition-colors duration-300 ${
                status === "checking"
                  ? "animate-pulse bg-amber-400"
                  : status === "connected"
                    ? "bg-emerald-500"
                    : "bg-rose-500"
              }`}
            />
          </span>
          <span>
            {status === "checking" && t.db.checking}
            {status === "connected" &&
              `${t.db.connected} • ${formatNumber(data?.latencyMs ?? 0, locale)}ms`}
            {status === "error" && t.db.disconnected}
          </span>
        </button>

        <button
          type="button"
          onClick={checkConnection}
          disabled={status === "checking"}
          aria-label={t.db.retestAria}
          title={t.db.retestAria}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-200/90 text-zinc-500 transition-all duration-200 hover:border-zinc-300 hover:text-zinc-900 active:scale-90 disabled:opacity-40 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-100"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="none"
            className={`h-3.5 w-3.5 ${status === "checking" ? "animate-spin" : ""}`}
          >
            <path
              d="M3.33337 10C3.33337 6.3181 6.31814 3.33333 10 3.33333C12.5015 3.33333 14.6812 4.7116 15.8226 6.75M16.6667 10C16.6667 13.6819 13.6819 16.6667 10 16.6667C7.49854 16.6667 5.31887 15.2884 4.17746 13.25M16.25 3.75V7.08333H12.9167M3.75004 16.25V12.9167H7.08337"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Expandable Diagnostics Popover */}
      {expanded && data && (
        <div className="animate-fade-slide-up mt-2 w-72 rounded-xl border border-zinc-200 bg-white p-3.5 text-start text-xs shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          {data.ok ? (
            <dl className="space-y-1.5 text-zinc-600 dark:text-zinc-400">
              <div className="flex justify-between gap-2">
                <dt className="font-medium text-zinc-900 dark:text-zinc-200">
                  {t.db.engine}
                </dt>
                <dd dir="ltr">{data.version}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="font-medium text-zinc-900 dark:text-zinc-200">
                  {t.db.database}
                </dt>
                <dd dir="ltr" className="font-mono">
                  {data.database}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="font-medium text-zinc-900 dark:text-zinc-200">
                  {t.db.latency}
                </dt>
                <dd dir="ltr">{formatNumber(data.latencyMs, locale)} ms</dd>
              </div>
            </dl>
          ) : (
            <div className="space-y-1">
              <p className="font-medium text-rose-600 dark:text-rose-400">
                {t.db.connectionError}
              </p>
              <p
                dir="ltr"
                className="break-words font-mono text-[11px] text-zinc-500 dark:text-zinc-400"
              >
                {data.error}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}