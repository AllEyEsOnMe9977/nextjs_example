"use client";

import { useEffect, useRef, useState } from "react";

type FontSize = "sm" | "md" | "lg";

interface BurstParticle {
  id: number;
  xOffset: number;
}

interface ArticleReaderProps {
  slug: string;
  title: string;
  content: string[];
}

const FONT_SIZE_STYLES: Record<FontSize, string> = {
  sm: "text-[15px] leading-7",
  md: "text-base sm:text-[17px] leading-8",
  lg: "text-lg sm:text-[19px] leading-9",
};

export function ArticleReader({ slug, title, content }: ArticleReaderProps) {
  const articleRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [fontSize, setFontSize] = useState<FontSize>("md");
  const [claps, setClaps] = useState(0);
  const [hasClapped, setHasClapped] = useState(false);
  const [particles, setParticles] = useState<BurstParticle[]>([]);
  const [copied, setCopied] = useState(false);

  // Load persisted font preference & article claps
  useEffect(() => {
    const savedSize = localStorage.getItem("reader-font-size") as FontSize | null;
    if (savedSize && ["sm", "md", "lg"].includes(savedSize)) {
      setFontSize(savedSize);
    }

    const savedClaps = Number(localStorage.getItem(`claps:${slug}`) || "0");
    if (savedClaps > 0) {
      setClaps(savedClaps);
      setHasClapped(true);
    }
  }, [slug]);

  // Track reading progress relative to the article body
  useEffect(() => {
    const handleScroll = () => {
      const el = articleRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollable = rect.height - windowHeight * 0.55;

      if (totalScrollable <= 0) {
        setProgress(100);
        return;
      }

      const scrolled = -rect.top + windowHeight * 0.2;
      const pct = Math.min(100, Math.max(0, (scrolled / totalScrollable) * 100));
      setProgress(pct);
      setShowTopBtn(window.scrollY > 360);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const handleFontSizeChange = (size: FontSize) => {
    setFontSize(size);
    localStorage.setItem("reader-font-size", size);
  };

  const handleClap = () => {
    const nextClaps = claps + 1;
    setClaps(nextClaps);
    setHasClapped(true);
    localStorage.setItem(`claps:${slug}`, String(nextClaps));

    const id = Date.now() + Math.random();
    const xOffset = Math.round((Math.random() - 0.5) * 28);
    setParticles((prev) => [...prev, { id, xOffset }]);

    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== id));
    }, 750);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      if (navigator.share) {
        await navigator.share({ title, url: window.location.href });
      }
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Reading Progress Bar pinned under sticky Navbar (h-16 = top-16) */}
      <div
        aria-hidden="true"
        className="fixed top-16 right-0 left-0 z-20 h-[2px] bg-transparent"
      >
        <div
          className="h-full bg-zinc-900 transition-[width] duration-150 ease-out dark:bg-zinc-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Reader Utility Bar */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200/80 pb-5 dark:border-zinc-800/80">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
            Text size
          </span>
          <div
            role="group"
            aria-label="Adjust article font size"
            className="inline-flex items-center rounded-full border border-zinc-200/90 bg-zinc-50 p-0.5 dark:border-zinc-800 dark:bg-zinc-900"
          >
            {(
              [
                { id: "sm", label: "S" },
                { id: "md", label: "M" },
                { id: "lg", label: "L" },
              ] as const
            ).map((option) => {
              const active = fontSize === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleFontSizeChange(option.id)}
                  aria-pressed={active}
                  className={`h-6 w-7 rounded-full text-xs font-medium transition-all duration-200 ${
                    active
                      ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-800 dark:text-zinc-100"
                      : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200/90 px-3 py-1 text-xs font-medium text-zinc-600 transition-all duration-200 hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900 active:scale-95 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
        >
          {copied ? (
            <>
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="none"
                className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400"
              >
                <path
                  d="M16.6667 5L7.50004 14.1667L3.33337 10"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-emerald-700 dark:text-emerald-400">
                Link copied
              </span>
            </>
          ) : (
            <>
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="none"
                className="h-3.5 w-3.5"
              >
                <path
                  d="M8.33333 10.8333C8.69121 11.3118 9.1478 11.7076 9.67216 11.994C10.1965 12.2803 10.7763 12.4504 11.3722 12.4928C11.9681 12.5352 12.5662 12.4488 13.1258 12.2395C13.6854 12.0302 14.1935 11.7029 14.6158 11.28L17.1158 8.78002C17.8749 7.99416 18.2949 6.94168 18.2854 5.84919C18.2759 4.7567 17.8377 3.71169 17.0652 2.93916C16.2926 2.16663 15.2476 1.72842 14.1551 1.71893C13.0626 1.70944 12.0102 2.12942 11.2243 2.88852L9.79099 4.31352M11.6667 9.16669C11.3088 8.68826 10.8522 8.29241 10.3278 8.00607C9.80348 7.71973 9.22369 7.54958 8.62779 7.50719C8.03189 7.4648 7.43379 7.55117 6.87421 7.76049C6.31463 7.9698 5.80652 8.29713 5.38416 8.72002L2.88416 11.22C2.12506 12.0059 1.70508 13.0584 1.71457 14.1509C1.72406 15.2433 2.16227 16.2883 2.9348 17.0609C3.70733 17.8334 4.75234 18.2716 5.84483 18.2811C6.93732 18.2906 7.9898 17.8706 8.77566 17.1115L10.2007 15.6865"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Share</span>
            </>
          )}
        </button>
      </div>

      {/* Article Paragraphs with smooth typography scaling & staggered entrance */}
      <div
        ref={articleRef}
        className={`mt-8 space-y-6 text-zinc-700 transition-[font-size,line-height] duration-300 dark:text-zinc-300 ${FONT_SIZE_STYLES[fontSize]}`}
      >
        {content.map((paragraph, index) => (
          <p
            key={index}
            style={{ animationDelay: `${index * 70}ms` }}
            className="animate-fade-slide-up"
          >
            {paragraph}
          </p>
        ))}
      </div>

      {/* Bottom Appreciation / Clap Bar */}
      <div className="mt-12 flex items-center justify-between rounded-2xl border border-zinc-200/80 bg-zinc-50/70 px-5 py-4 dark:border-zinc-800/80 dark:bg-zinc-900/50">
        <div>
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            Enjoyed this note?
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Leave a clap or share it with a friend.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative">
            {particles.map((particle) => (
              <span
                key={particle.id}
                style={{ "--x-offset": `${particle.xOffset}px` } as React.CSSProperties}
                className="animate-float-up pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 text-xs font-semibold text-zinc-900 dark:text-zinc-100"
              >
                +1
              </span>
            ))}

            <button
              type="button"
              onClick={handleClap}
              aria-label="Applaud this article"
              className={`group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition-all duration-200 active:scale-90 ${
                hasClapped
                  ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                  : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
              }`}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill={hasClapped ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 transition-transform duration-300 group-hover:scale-110"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
              <span>{claps > 0 ? claps : "Appreciate"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Scroll-to-Top Button */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Scroll back to top"
        className={`fixed right-6 bottom-6 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200/90 bg-white/90 text-zinc-700 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900/90 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:text-zinc-100 ${
          showTopBtn
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          className="h-4 w-4"
        >
          <path
            d="M10 15.8333V4.16667M10 4.16667L4.16667 10M10 4.16667L15.8333 10"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </>
  );
}