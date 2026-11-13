import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleReader } from "../../../components/ArticleReader";
import { getAllPosts, getNextPost, getPostBySlug } from "../../../lib/posts";

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

  const nextPost = getNextPost(post.slug);

  return (
    <article className="mx-auto w-full max-w-2xl px-6 py-14">
      <Link
        href="/"
        className="group inline-flex items-center text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        <span className="mr-1.5 transition-transform duration-200 group-hover:-translate-x-0.5">
          ←
        </span>
        Back to all articles
      </Link>

      <header className="animate-fade-slide-up mt-8">
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

      <ArticleReader
        slug={post.slug}
        title={post.title}
        content={post.content}
      />

      {nextPost && (
        <aside className="mt-14 border-t border-zinc-200/80 pt-10 dark:border-zinc-800/80">
          <p className="text-xs font-medium tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
            Up Next
          </p>
          <Link
            href={`/posts/${nextPost.slug}`}
            className="group mt-3 block rounded-2xl border border-zinc-200/80 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-300 hover:bg-zinc-50/70 dark:border-zinc-800/80 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/50"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {nextPost.tag} · {nextPost.readTime}
                </span>
                <h2 className="mt-1 text-base font-semibold text-zinc-900 transition-colors group-hover:text-zinc-600 dark:text-zinc-100 dark:group-hover:text-zinc-300">
                  {nextPost.title}
                </h2>
              </div>
              <span className="text-zinc-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-zinc-900 dark:group-hover:text-zinc-100">
                →
              </span>
            </div>
          </Link>
        </aside>
      )}
    </article>
  );
}