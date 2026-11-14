"use client";

import { useLanguage } from "./LanguageProvider";

export function LanguageToggle() {
  const { locale, toggleLocale, t } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleLocale}
      aria-label={t.nav.switchLanguageLabel}
      title={t.nav.switchLanguageLabel}
      className="inline-flex h-9 items-center gap-1.5 rounded-full border border-zinc-200/80 bg-zinc-50/80 px-3 text-xs font-medium text-zinc-700 transition-all duration-200 hover:border-zinc-300 hover:bg-zinc-100 active:scale-95 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-800"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
      </svg>
      <span className={locale === "en" ? "font-sans" : "tracking-wide"}>
        {t.nav.switchButtonText}
      </span>
    </button>
  );
}