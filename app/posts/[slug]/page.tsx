import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleReader } from "../../../components/ArticleReader";
import {
  dictionaries,
  formatReadTime,
  getDirection,
  isValidLocale,
  LOCALE_COOKIE_NAME,
  translateTag,
  type Locale,
} from "../../../lib/i18n";
import { getNextPost, getPostBySlug, localizePost } from "../../../lib/posts";

export const dynamic = "force-dynamic";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

async function getServerLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(LOCALE_COOKIE_NAME)?.value;
  return isValidLocale(raw) ? raw : "en";
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const [{ slug }, locale] = await Promise.all([params, getServerLocale()]);
  const t = dictionaries[locale];
  const rawPost = await getPostBySlug(slug);
  if (!rawPost) {
    return { title: t.post.notFound };
  }
  const post = localizePost(rawPost, locale);
  return {
    title: `${post.title} — ${t.brandName}`,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const [{ slug }, locale] = await Promise.all([params, getServerLocale()]);
  const dir = getDirection(locale);
  const t = dictionaries[locale];

  const rawPost = await getPostBySlug(slug);
  if (!rawPost) {
    notFound();
  }

  const post = localizePost(rawPost, locale);
  const rawNextPost = await getNextPost(post.slug);
  const nextPost = rawNextPost ? localizePost(rawNextPost, locale) : undefined;

  return (
    <article className="mx-auto w-full max-w-2xl px-6 py-14">
      <Link
        href="/"
        className="group inline-flex items-center text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        <span className="me-1.5 transition-transform duration-200 group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0.5">
          {dir === "rtl" ? "→" : "←"}
        </span>
        {t.post.backToAll}
      </Link>

      <header className="animate-fade-slide-up mt-8">
        <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 font-medium text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
            {translateTag(post.tag, locale)}
          </span>
          <time>{post.date}</time>
          <span aria-hidden="true">&bull;</span>
          <span>{formatReadTime(post.readTime, locale)}</span>
        </div>

        <h1
          dir="auto"
          className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50"
        >
          {post.title}
        </h1>

        <p
          dir="auto"
          className="mt-4 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400"
        >
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
            {t.post.upNext}
          </p>
          <Link
            href={`/posts/${nextPost.slug}`}
            className="group mt-3 block rounded-2xl border border-zinc-200/80 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-300 hover:bg-zinc-50/70 dark:border-zinc-800/80 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/50"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {translateTag(nextPost.tag, locale)} &bull;{" "}
                  {formatReadTime(nextPost.readTime, locale)}
                </span>
                <h2
                  dir="auto"
                  className="mt-1 text-base font-semibold text-zinc-900 transition-colors group-hover:text-zinc-600 dark:text-zinc-100 dark:group-hover:text-zinc-300"
                >
                  {nextPost.title}
                </h2>
              </div>
              <span className="text-zinc-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-zinc-900 rtl:group-hover:-translate-x-1 dark:group-hover:text-zinc-100">
                {dir === "rtl" ? "←" : "→"}
              </span>
            </div>
          </Link>
        </aside>
      )}
    </article>
  );
}