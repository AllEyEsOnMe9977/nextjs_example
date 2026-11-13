import Link from "next/link";
import type { Post } from "../lib/posts";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="group py-8 first:pt-2">
      <Link href={`/posts/${post.slug}`} className="block space-y-2.5">
        <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 font-medium text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
            {post.tag}
          </span>
          <time>{post.date}</time>
          <span aria-hidden="true">·</span>
          <span>{post.readTime}</span>
        </div>

        <h2 className="text-xl font-semibold tracking-tight text-zinc-900 transition-colors group-hover:text-zinc-600 dark:text-zinc-100 dark:group-hover:text-zinc-300">
          {post.title}
        </h2>

        <p className="leading-relaxed text-zinc-600 dark:text-zinc-400">
          {post.excerpt}
        </p>

        <span className="inline-flex items-center pt-1 text-sm font-medium text-zinc-900 dark:text-zinc-200">
          Read article
          <span className="ml-1 transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </span>
      </Link>
    </article>
  );
}