"use client";

import Link from "next/link";
import { formatReadTime, translateTag } from "../lib/i18n";
import type { Post } from "../lib/posts";
import { useLanguage } from "./LanguageProvider";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const { locale, dir, t } = useLanguage();

  return (
    <article className="group py-8 first:pt-2">
      <Link href={`/posts/${post.slug}`} className="block space-y-2.5">
        <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 font-medium text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
            {translateTag(post.tag, locale)}
          </span>
          <time>{post.date}</time>
          <span aria-hidden="true">&bull;</span>
          <span>{formatReadTime(post.readTime, locale)}</span>
        </div>

        <h2
          dir="auto"
          className="text-xl font-semibold tracking-tight text-zinc-900 transition-colors group-hover:text-zinc-600 dark:text-zinc-100 dark:group-hover:text-zinc-300"
        >
          {post.title}
        </h2>

        <p
          dir="auto"
          className="leading-relaxed text-zinc-600 dark:text-zinc-400"
        >
          {post.excerpt}
        </p>

        <span className="inline-flex items-center pt-1 text-sm font-medium text-zinc-900 dark:text-zinc-200">
          {t.feed.readArticle}
          <span className="ms-1 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5">
            {dir === "rtl" ? "←" : "→"}
          </span>
        </span>
      </Link>
    </article>
  );
}