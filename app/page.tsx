import { cookies } from "next/headers";
import { PostFeed } from "../components/PostFeed";
import {
  dictionaries,
  isValidLocale,
  LOCALE_COOKIE_NAME,
  type Locale,
} from "../lib/i18n";
import { getAllPosts, localizePost } from "../lib/posts";

export const dynamic = "force-dynamic";

export default async function Home() {
  const cookieStore = await cookies();
  const rawLocale = cookieStore.get(LOCALE_COOKIE_NAME)?.value;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : "en";
  const t = dictionaries[locale];

  const rawPosts = await getAllPosts();
  const posts = rawPosts.map((post) => localizePost(post, locale));

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-14">
      <section className="border-b border-zinc-200 pb-10 dark:border-zinc-800">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
          {t.home.heading}
        </h1>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          {t.home.subheading}
        </p>
      </section>

      <PostFeed posts={posts} />
    </div>
  );
}