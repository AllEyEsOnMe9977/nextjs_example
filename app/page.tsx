import { PostFeed } from "../components/PostFeed";
import { getAllPosts } from "../lib/posts";

export default function Home() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-14">
      <section className="border-b border-zinc-200 pb-10 dark:border-zinc-800">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
          Writing &amp; Field Notes
        </h1>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          Short essays on software craft, interface design, and lessons learned
          along the way.
        </p>
      </section>

      <PostFeed posts={posts} />
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </section>
    </div>
  );
}