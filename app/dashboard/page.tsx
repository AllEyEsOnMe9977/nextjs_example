import type { Metadata } from "next";
import { PublisherDashboard } from "../../components/PublisherDashboard";
import { PublisherLogin } from "../../components/PublisherLogin";
import { isPublisherAuthenticated } from "../../lib/auth";
import { getAllPosts } from "../../lib/posts";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Publisher Studio — Field Notes",
};

export default async function DashboardPage() {
  const authenticated = await isPublisherAuthenticated();

  if (!authenticated) {
    return <PublisherLogin />;
  }

  const posts = await getAllPosts();
  return <PublisherDashboard initialPosts={posts} />;
}