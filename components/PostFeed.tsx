"use client";

import { useMemo, useState } from "react";
import { translateTag } from "../lib/i18n";
import type { Post } from "../lib/posts";
import { useLanguage } from "./LanguageProvider";
import { PostCard } from "./PostCard";

interface PostFeedProps {
  posts: Post[];
}

export function PostFeed({ posts }: PostFeedProps) {
  const { locale, t } = useLanguage();
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const tags = useMemo(() => {
    const uniqueTags = Array.from(new Set(posts.map((post) => post.tag)));
    return ["All", ...uniqueTags];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesTag = selectedTag === "All" || post.tag === selectedTag;
      const localizedTag = translateTag(post.tag, locale).toLowerCase();
      const matchesQuery =
        !query ||
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tag.toLowerCase().includes(query) ||
        localizedTag.includes(query);
      return matchesTag && matchesQuery;
    });
  }, [posts, selectedTag, searchQuery, locale]);

  const resetFilters = () => {
    setSelectedTag("All");
    setSearchQuery("");
  };

  return (
    <section aria-label="Blog posts" className="pt-8">
      {/* Filter & Search Controls */}
      <div className="flex flex-col gap-4 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="tablist"
          aria-label={t.feed.filterAria}
          className="flex flex-wrap items-center gap-2"
        >
          {tags.map((tag) => {
            const isActive = selectedTag === tag;
            return (
              <button
                key={tag}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setSelectedTag(tag)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200/80 hover:text-zinc-900 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                }`}
              >
                {tag === "All" ? t.feed.allTag : translateTag(tag, locale)}
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-56">
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="none"
            className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
          >
            <path
              d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.feed.searchPlaceholder}
            aria-label={t.feed.searchAria}
            className="w-full rounded-full border border-zinc-200 bg-transparent py-1.5 ps-9 pe-3.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none dark:border-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
          />
        </div>
      </div>

      {/* Filtered Results */}
      {filteredPosts.length > 0 ? (
        <div className="divide-y divide-zinc-200/80 dark:divide-zinc-800/80">
          {filteredPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-zinc-200 py-14 text-center dark:border-zinc-800">
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {t.feed.emptyTitle}
          </p>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {t.feed.emptyDescription}
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-4 rounded-full bg-zinc-900 px-4 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-85 dark:bg-zinc-100 dark:text-zinc-900"
          >
            {t.feed.resetFilters}
          </button>
        </div>
      )}
    </section>
  );
}