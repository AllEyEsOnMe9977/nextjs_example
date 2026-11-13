import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isPublisherAuthenticated } from "../../../lib/auth";
import { createPost } from "../../../lib/posts";

export async function POST(request: Request) {
  const authenticated = await isPublisherAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const title = typeof body?.title === "string" ? body.title.trim() : "";
    const excerpt = typeof body?.excerpt === "string" ? body.excerpt.trim() : "";
    const tag = typeof body?.tag === "string" ? body.tag.trim() : "General";
    const slug = typeof body?.slug === "string" ? body.slug.trim() : "";
    const rawContent = typeof body?.content === "string" ? body.content : "";

    const paragraphs = rawContent
      .split(/\n\s*\n/)
      .map((p: string) => p.trim())
      .filter(Boolean);

    if (!title || !excerpt || paragraphs.length === 0) {
      return NextResponse.json(
        { error: "Title, excerpt, and at least one paragraph are required." },
        { status: 400 },
      );
    }

    const created = await createPost({
      title,
      slug,
      excerpt,
      tag,
      content: paragraphs,
    });

    revalidatePath("/");
    revalidatePath(`/posts/${created.slug}`);

    return NextResponse.json({ ok: true, post: created }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to publish post.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}