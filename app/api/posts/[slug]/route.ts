import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isPublisherAuthenticated } from "../../../../lib/auth";
import { deletePost } from "../../../../lib/posts";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function DELETE(_request: Request, context: RouteContext) {
  const authenticated = await isPublisherAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { slug } = await context.params;
    const deleted = await deletePost(slug);

    if (!deleted) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }

    revalidatePath("/");
    revalidatePath(`/posts/${slug}`);

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete post.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}