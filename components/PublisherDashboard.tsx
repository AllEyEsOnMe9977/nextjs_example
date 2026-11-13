"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { Post } from "../lib/posts";

interface PublisherDashboardProps {
  initialPosts: Post[];
}

const PRESET_TAGS = ["Engineering", "Design", "Writing", "Notes"];

export function PublisherDashboard({ initialPosts }: PublisherDashboardProps) {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [mode, setMode] = useState<"write" | "preview">("write");

  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("Engineering");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
    slug?: string;
  } | null>(null);

  const previewSlug = useMemo(() => {
    return (
      title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "") || "your-article-slug"
    );
  }, [title]);

  const previewParagraphs = useMemo(() => {
    return content
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);
  }, [content]);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, tag, excerpt, content }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFeedback({
          type: "error",
          message: data.error || "Could not publish article.",
        });
        setSubmitting(false);
        return;
      }

      setPosts((prev) => [data.post, ...prev]);
      setTitle("");
      setExcerpt("");
      setContent("");
      setMode("write");
      setFeedback({
        type: "success",
        message: "Published directly to PostgreSQL!",
        slug: data.post.slug,
      });
      router.refresh();
    } catch {
      setFeedback({
        type: "error",
        message: "Network error while saving to PostgreSQL.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (slug: string) => {
    setDeletingSlug(slug);
    setFeedback(null);

    try {
      const res = await fetch(`/api/posts/${slug}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        setFeedback({
          type: "error",
          message: data.error || "Failed to delete post.",
        });
        return;
      }

      setPosts((prev) => prev.filter((p) => p.slug !== slug));
      setFeedback({
        type: "success",
        message: "Article deleted from PostgreSQL.",
      });
      router.refresh();
    } catch {
      setFeedback({
        type: "error",
        message: "Network error while deleting post.",
      });
    } finally {
      setDeletingSlug(null);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-12">
      {/* Studio Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Authenticated Publisher Session
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Publisher Studio
          </h1>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-full border border-zinc-200 px-3.5 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-100"
        >
          Sign out
        </button>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`animate-fade-slide-up mt-6 flex items-center justify-between rounded-xl border px-4 py-3 text-xs font-medium ${
            feedback.type === "success"
              ? "border-emerald-200 bg-emerald-50/70 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300"
              : "border-rose-200 bg-rose-50/70 text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300"
          }`}
        >
          <span>{feedback.message}</span>
          {feedback.slug && (
            <Link
              href={`/posts/${feedback.slug}`}
              className="underline underline-offset-2 hover:opacity-80"
            >
              View live post →
            </Link>
          )}
        </div>
      )}

      {/* Composer Card */}
      <section className="mt-8 rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4 dark:border-zinc-800/80">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            New Article
          </h2>

          <div className="inline-flex rounded-full border border-zinc-200 bg-zinc-50 p-0.5 dark:border-zinc-800 dark:bg-zinc-900">
            <button
              type="button"
              onClick={() => setMode("write")}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                mode === "write"
                  ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-800 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400"
              }`}
            >
              Write
            </button>
            <button
              type="button"
              onClick={() => setMode("preview")}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                mode === "preview"
                  ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-800 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400"
              }`}
            >
              Preview
            </button>
          </div>
        </div>

        {mode === "write" ? (
          <form onSubmit={handlePublish} className="mt-5 space-y-5">
            <div>
              <label
                htmlFor="post-title"
                className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
              >
                Title
              </label>
              <input
                id="post-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Deploying PostgreSQL on Coolify"
                className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-transparent px-3.5 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none dark:border-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-400"
              />
              <p className="mt-1 font-mono text-[11px] text-zinc-400">
                /posts/{previewSlug}
              </p>
            </div>

            <div>
              <label
                htmlFor="post-tag"
                className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
              >
                Topic Tag
              </label>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                {PRESET_TAGS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setTag(preset)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      tag === preset
                        ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200/80 dark:bg-zinc-800 dark:text-zinc-400"
                    }`}
                  >
                    {preset}
                  </button>
                ))}
                <input
                  id="post-tag"
                  type="text"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="Custom tag"
                  className="w-28 rounded-full border border-zinc-200 bg-transparent px-3 py-1 text-xs text-zinc-900 focus:border-zinc-900 focus:outline-none dark:border-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-400"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="post-excerpt"
                className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
              >
                Excerpt
              </label>
              <textarea
                id="post-excerpt"
                rows={2}
                required
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A short summary shown on the home feed and SEO metadata..."
                className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-transparent px-3.5 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none dark:border-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-400"
              />
            </div>

            <div>
              <label
                htmlFor="post-content"
                className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
              >
                Article Body{" "}
                <span className="font-normal text-zinc-400">
                  (separate paragraphs with a blank line)
                </span>
              </label>
              <textarea
                id="post-content"
                rows={7}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={
                  "Write your first paragraph here...\n\nPress Enter twice to start a new paragraph."
                }
                className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-transparent px-3.5 py-2.5 text-sm leading-relaxed text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none dark:border-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-400"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-full bg-zinc-900 px-5 py-2 text-xs font-medium text-white transition-all duration-200 hover:bg-zinc-800 active:scale-95 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                {submitting ? "Saving to PostgreSQL..." : "Publish Article"}
              </button>
            </div>
          </form>
        ) : (
          <div className="animate-fade-slide-up mt-6 space-y-4">
            <span className="inline-block rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              {tag || "General"}
            </span>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {title || "Untitled Article"}
            </h3>
            <p className="text-base text-zinc-600 dark:text-zinc-400">
              {excerpt || "Your article excerpt will appear here."}
            </p>
            <div className="space-y-4 border-t border-zinc-100 pt-4 text-sm leading-7 text-zinc-700 dark:border-zinc-800 dark:text-zinc-300">
              {previewParagraphs.length > 0 ? (
                previewParagraphs.map((p, idx) => <p key={idx}>{p}</p>)
              ) : (
                <p className="text-zinc-400">Nothing written yet.</p>
              )}
            </div>
          </div>
        )}
      </section>

      {/* PostgreSQL Stored Articles List */}
      <section className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Database Articles ({posts.length})
          </h2>
          <span className="font-mono text-xs text-zinc-400">table: posts</span>
        </div>

        <div className="mt-4 divide-y divide-zinc-200/80 rounded-2xl border border-zinc-200/80 dark:divide-zinc-800/80 dark:border-zinc-800/80">
          {posts.map((post) => (
            <div
              key={post.slug}
              className="flex items-center justify-between gap-4 px-5 py-4"
            >
              <div className="min-w-0">
                <Link
                  href={`/posts/${post.slug}`}
                  className="truncate text-sm font-medium text-zinc-900 hover:underline dark:text-zinc-100"
                >
                  {post.title}
                </Link>
                <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                  {post.tag} · {post.date} · {post.readTime}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleDelete(post.slug)}
                disabled={deletingSlug === post.slug}
                className="shrink-0 rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-rose-600 transition-colors hover:border-rose-200 hover:bg-rose-50 disabled:opacity-40 dark:border-zinc-800 dark:text-rose-400 dark:hover:border-rose-900 dark:hover:bg-rose-950/40"
              >
                {deletingSlug === post.slug ? "Deleting..." : "Delete"}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}