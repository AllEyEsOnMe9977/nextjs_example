"use client";

import Link from "next/link";
import { useLanguage } from "./LanguageProvider";
import { LanguageToggle } from "./LanguageToggle";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md transition-colors duration-300 dark:border-zinc-800/80 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-base font-semibold tracking-tight text-zinc-900 transition-opacity hover:opacity-75 dark:text-zinc-100"
        >
          {t.brandName}
        </Link>

        <div className="flex items-center gap-4 sm:gap-5">
          <nav className="flex items-center gap-5 text-sm text-zinc-600 sm:gap-6 dark:text-zinc-400">
            <Link
              href="/"
              className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              {t.nav.articles}
            </Link>
            <Link
              href="/dashboard"
              className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              {t.nav.write}
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}