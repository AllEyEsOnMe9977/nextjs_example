import { getDbPool } from "./db";
import type { Locale } from "./i18n";

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tag: string;
  content: string[];
}

export interface CreatePostInput {
  title: string;
  slug?: string;
  excerpt: string;
  tag: string;
  content: string[];
}

const SEED_POSTS: Post[] = [
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
      "Calm design starts with hierarchy. When typography does the heavy lifting through clear scale, comfortable line length, and deliberate contrast you rarely need extra borders or drop shadows to separate ideas.",
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
      "Writing is not merely recording finished thoughts it is the mechanism by which vague intuitions become clear arguments.",
      "Setting a modest weekly cadence removes the pressure to make every post definitive. Five hundred honest words published today beat three thousand words stuck in a drafts folder.",
      "Over time, a personal blog becomes a searchable archive of how your taste and thinking evolved.",
    ],
  },
];

const SEED_POSTS_FA: Record<string, Partial<Post>> = {
  "designing-for-calm-interfaces": {
    title: "طراحی برای رابط‌های کاربری آرام",
    excerpt:
      "چرا فضای سفید سخاوتمندانه، تایپوگرافی کنترل‌شده و تعاملات قابل پیش‌بینی باعث می‌شوند نرم‌افزار بی‌دردسر به نظر برسد.",
    date: "۱۹ آبان ۱۴۰۵",
    readTime: "۴ دقیقه مطالعه",
    content: [
      "بیشتر رابط‌های کاربری مدرن با نشانگرهای متعدد، انیمیشن‌های شلوغ و نوارهای کناری متراکم برای جلب توجه رقابت می‌کنند. با این حال، ابزارهایی که هر روز به آن‌ها برمی‌گردیم اغلب ویژگی متضادی دارند: آرامش.",
      "طراحی آرام با سلسله‌مراتب آغاز می‌شود. وقتی تایپوگرافی از طریق مقیاس روشن، طول خط مناسب و کنتراست سنجیده بار اصلی را به دوش می‌کشد، به ندرت به کادرها یا سایه‌های اضافه برای جدا کردن ایده‌ها نیاز دارید.",
      "با فضای سفید به عنوان یک عنصر ساختاری فعال رفتار کنید، نه فضای خالی باقی‌مانده. دادن فضا به محتوا برای نفس کشیدن، درک مطلب را بهبود می‌بخشد و خواندن روی نمایشگر را واقعاً لذت‌بخش می‌کند.",
    ],
  },
  "notes-on-building-with-nextjs": {
    title: "یادداشت‌هایی درباره ساخت وب‌اپلیکیشن‌های سریع با Next.js",
    excerpt:
      "الگوهای کاربردی برای ساده، سریع و نگهداری‌پذیر نگه داشتن معماری App Router.",
    date: "۱۳ آبان ۱۴۰۵",
    readTime: "۵ دقیقه مطالعه",
    content: [
      "بهترین بهینه‌سازی عملکرد، ارسال جاوااسکریپت کمتر به صورت پیش‌فرض است. کامپوننت‌های سمت سرور به شما امکان می‌دهند صفحات پرمحتوا را بدون نیاز به هیدراته کردن متن‌های ایستا در مرورگر رندر کنید.",
      "لایه داده خود را از کامپوننت‌های رابط کاربری جدا نگه دارید. حتی زمانی که با فایل‌های محلی شروع می‌کنید، قرار دادن عملیات خواندن در توابع کمکی تمیز، مهاجرت بعدی به پایگاه داده یا CMS را بسیار ساده می‌کند.",
      "روی حلقه‌های بازخورد سریع تمرکز کنید: تایپ‌های سخت‌گیرانه TypeScript، کدنویسی معنایی HTML و کلاس‌های کاربردی مینیمال تأثیر زیادی دارند.",
    ],
  },
  "the-habit-of-writing-weekly": {
    title: "عادت هفتگی نوشتن",
    excerpt:
      "چگونه انتشار جستارهای کوتاه و ناکامل، ذهن شما را بیش از انتظار برای خلق یک شاهکار صیقل می‌دهد.",
    date: "۵ آبان ۱۴۰۵",
    readTime: "۳ دقیقه مطالعه",
    content: [
      "نوشتن صرفاً ثبت افکار نهایی نیست؛ بلکه سازوکاری است که به کمک آن شهودهای مبهم به استدلال‌های شفاف تبدیل می‌شوند.",
      "تعیین یک آهنگ هفتگی متعادل، فشار بی‌نقص بودن هر نوشته را از بین می‌برد. پانصد کلمه صادقانه که امروز منتشر شود، بهتر از سه هزار کلمه‌ای است که در پوشه پیش‌نویس‌ها خاک می‌خورد.",
      "با گذشت زمان، یک وبلاگ شخصی به آرشیوی قابل جستجو از چگونگی تکامل سلیقه و تفکر شما تبدیل می‌شود.",
    ],
  },
};

export function localizePost(post: Post, locale: Locale): Post {
  if (locale !== "fa") return post;
  const localized = SEED_POSTS_FA[post.slug];
  if (!localized) return post;
  return {
    ...post,
    ...localized,
  };
}

let tableInitialized = false;

interface DbPostRow {
  slug: string;
  title: string;
  excerpt: string;
  published_date: string;
  read_time: string;
  tag: string;
  content: string[];
}

function mapRowToPost(row: DbPostRow): Post {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    date: row.published_date,
    readTime: row.read_time,
    tag: row.tag,
    content: Array.isArray(row.content) ? row.content : [],
  };
}

export async function ensurePostsTable(): Promise<void> {
  if (tableInitialized) return;
  const pool = getDbPool();
  await pool.query(`
    CREATE TABLE IF NOT EXISTS posts (
      slug TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      published_date TEXT NOT NULL,
      read_time TEXT NOT NULL,
      tag TEXT NOT NULL,
      content JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  const countResult = await pool.query<{ count: string }>(
    "SELECT COUNT(*)::text AS count FROM posts",
  );
  const existingCount = Number(countResult.rows[0]?.count ?? "0");

  if (existingCount === 0) {
    for (let i = 0; i < SEED_POSTS.length; i++) {
      const post = SEED_POSTS[i];
      await pool.query(
        `INSERT INTO posts (slug, title, excerpt, published_date, read_time, tag, content, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, NOW() - ($8 || ' minutes')::interval)
         ON CONFLICT (slug) DO NOTHING`,
        [
          post.slug,
          post.title,
          post.excerpt,
          post.date,
          post.readTime,
          post.tag,
          JSON.stringify(post.content),
          String(i * 10),
        ],
      );
    }
  }

  tableInitialized = true;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function estimateReadTime(paragraphs: string[]): string {
  const words = paragraphs.join(" ").trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

export async function getAllPosts(): Promise<Post[]> {
  try {
    await ensurePostsTable();
    const pool = getDbPool();
    const result = await pool.query<DbPostRow>(
      `SELECT slug, title, excerpt, published_date, read_time, tag, content
       FROM posts
       ORDER BY created_at DESC`,
    );
    return result.rows.map(mapRowToPost);
  } catch (error) {
    console.warn("[getAllPosts] Falling back to seed posts:", error);
    return SEED_POSTS;
  }
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const decodedSlug = decodeURIComponent(slug);
  try {
    await ensurePostsTable();
    const pool = getDbPool();
    const result = await pool.query<DbPostRow>(
      `SELECT slug, title, excerpt, published_date, read_time, tag, content
       FROM posts
       WHERE slug = $1
       LIMIT 1`,
      [decodedSlug],
    );
    return result.rows[0] ? mapRowToPost(result.rows[0]) : undefined;
  } catch (error) {
    console.warn("[getPostBySlug] Falling back to seed posts:", error);
    return SEED_POSTS.find((post) => post.slug === decodedSlug);
  }
}

export async function getNextPost(
  currentSlug: string,
): Promise<Post | undefined> {
  const all = await getAllPosts();
  const index = all.findIndex((post) => post.slug === currentSlug);
  if (index === -1 || all.length <= 1) return undefined;
  return all[(index + 1) % all.length];
}

export async function createPost(input: CreatePostInput): Promise<Post> {
  await ensurePostsTable();
  const pool = getDbPool();

  const baseSlug =
    slugify(input.slug?.trim() || input.title) || `post-${Date.now()}`;
  let finalSlug = baseSlug;

  const existing = await pool.query("SELECT slug FROM posts WHERE slug = $1", [
    finalSlug,
  ]);
  if (existing.rows.length > 0) {
    finalSlug = `${baseSlug}-${Math.floor(100 + Math.random() * 900)}`;
  }

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const readTime = estimateReadTime(input.content);

  const result = await pool.query<DbPostRow>(
    `INSERT INTO posts (slug, title, excerpt, published_date, read_time, tag, content)
     VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb)
     RETURNING slug, title, excerpt, published_date, read_time, tag, content`,
    [
      finalSlug,
      input.title.trim(),
      input.excerpt.trim(),
      formattedDate,
      readTime,
      input.tag.trim() || "General",
      JSON.stringify(input.content),
    ],
  );

  return mapRowToPost(result.rows[0]);
}

export async function deletePost(slug: string): Promise<boolean> {
  await ensurePostsTable();
  const pool = getDbPool();
  const result = await pool.query("DELETE FROM posts WHERE slug = $1", [
    decodeURIComponent(slug),
  ]);
  return (result.rowCount ?? 0) > 0;
}