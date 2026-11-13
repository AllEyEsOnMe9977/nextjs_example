import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md transition-colors duration-300 dark:border-zinc-800/80 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-base font-semibold tracking-tight text-zinc-900 transition-opacity hover:opacity-75 dark:text-zinc-100"
        >
          Field Notes
        </Link>
        <div className="flex items-center gap-5">
          <nav className="flex items-center gap-6 text-sm text-zinc-600 dark:text-zinc-400">
            <Link
              href="/"
              className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              Articles
            </Link>
            <a
              href="#about"
              className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              About
            </a>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}