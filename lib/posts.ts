export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tag: string;
  content: string[];
}

export const posts: Post[] = [
  {
    slug: "designing-for-calm-interfaces",
    title: "Designing for Calm Interfaces",
    excerpt:
      "Why generous whitespace, restrained typography, and predictable interactions make software feel effortless.",
    date: "November 10, 2026",
    readTime: "4 min read",
    tag: "Design",
    content: [
      "Most modern interfaces compete for attention with badges, motion, and dense sidebars. Yet the tools we return to daily often share the opposite quality: quietness.",
      "Calm design starts with hierarchy. When typography does the heavy lifting—through clear scale, comfortable line length, and deliberate contrast—you rarely need extra borders or drop shadows to separate ideas.",
      "Treat whitespace as an active structural element rather than empty leftovers. Giving content room to breathe improves comprehension and makes reading on screens genuinely enjoyable.",
    ],
  },
  {
    slug: "notes-on-building-with-nextjs",
    title: "Notes on Building Fast Web Apps with Next.js",
    excerpt:
      "Practical patterns for keeping your App Router architecture simple, static-friendly, and easy to maintain.",
    date: "November 4, 2026",
    readTime: "5 min read",
    tag: "Engineering",
    content: [
      "The best performance optimization is shipping less JavaScript by default. Server Components let you render rich content pages without hydrating static text in the browser.",
      "Keep your data layer decoupled from your UI components. Even when starting with local TypeScript files, wrapping reads in clean helper functions makes migrating to MDX or a CMS trivial later.",
      "Focus on fast feedback loops: strict TypeScript types, semantic HTML, and minimal utility classes go a long way.",
    ],
  },
  {
    slug: "the-habit-of-writing-weekly",
    title: "The Habit of Writing Weekly",
    excerpt:
      "How publishing short, imperfect essays sharpens your thinking more than waiting for a masterpiece.",
    date: "October 27, 2026",
    readTime: "3 min read",
    tag: "Writing",
    content: [
      "Writing is not merely recording finished thoughts—it is the mechanism by which vague intuitions become clear arguments.",
      "Setting a modest weekly cadence removes the pressure to make every post definitive. Five hundred honest words published today beat three thousand words stuck in a drafts folder.",
      "Over time, a personal blog becomes a searchable archive of how your taste and thinking evolved.",
    ],
  },
];

export function getAllPosts(): Post[] {
  return posts;
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

export function getNextPost(currentSlug: string): Post | undefined {
  const index = posts.findIndex((post) => post.slug === currentSlug);
  if (index === -1 || posts.length <= 1) return undefined;
  return posts[(index + 1) % posts.length];
}