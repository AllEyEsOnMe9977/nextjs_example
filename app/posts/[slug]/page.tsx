import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "../../../lib/posts";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: `${post.title} — Field Notes`,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="mx-auto w-full max-w-2xl px-6 py-14">
      <Link
        href="/"
        className="inline-flex items-center text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        ← Back to all articles
      </Link>

      <header className="mt-8 border-b border-zinc-200 pb-8 dark:border-zinc-800">
        <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 font-medium text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
            {post.tag}
          </span>
          <time>{post.date}</time>
          <span aria-hidden="true">·</span>
          <span>{post.readTime}</span>
        </div>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
          {post.title}
        </h1>

        <p className="mt-4 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
          {post.excerpt}
        </p>
      </header>

      <div className="mt-8 space-y-6 text-base leading-8 text-zinc-700 dark:text-zinc-300">
        {post.content.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}