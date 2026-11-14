export type Locale = "en" | "fa";

export const LOCALE_COOKIE_NAME = "locale";

export function isValidLocale(value?: string | null): value is Locale {
  return value === "en" || value === "fa";
}

export function getDirection(locale: Locale): "ltr" | "rtl" {
  return locale === "fa" ? "rtl" : "ltr";
}

export function formatNumber(value: number | string, locale: Locale): string {
  const str = String(value);
  if (locale !== "fa") return str;
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return str.replace(/\d/g, (d) => persianDigits[Number(d)]);
}

export function formatReadTime(readTime: string, locale: Locale): string {
  if (locale !== "fa") return readTime;
  const match = readTime.match(/(\d+)/);
  if (!match) return readTime;
  return `${formatNumber(match[1], "fa")} دقیقه مطالعه`;
}

const TAG_TRANSLATIONS_FA: Record<string, string> = {
  All: "همه",
  Design: "طراحی",
  Engineering: "مهندسی نرم‌افزار",
  Writing: "نوشتن",
  Notes: "یادداشت‌ها",
  General: "عمومی",
};

export function translateTag(tag: string, locale: Locale): string {
  if (locale !== "fa") return tag;
  return TAG_TRANSLATIONS_FA[tag] ?? tag;
}

export const dictionaries = {
  en: {
    siteTitle: "Field Notes — Personal Blog",
    siteDescription: "Essays on design, software engineering, and clear thinking.",
    brandName: "Field Notes",
    nav: {
      articles: "Articles",
      write: "Write",
      switchLanguageLabel: "Switch language to Persian",
      switchButtonText: "فارسی",
    },
    home: {
      heading: "Writing & Field Notes",
      subheading:
        "Short essays on software craft, interface design, and lessons learned along the way.",
    },
    feed: {
      allTag: "All",
      searchPlaceholder: "Search articles...",
      searchAria: "Search articles",
      filterAria: "Filter articles by topic",
      emptyTitle: "No matching articles found",
      emptyDescription: "Try clearing your search or switching topics.",
      resetFilters: "Reset filters",
      readArticle: "Read article",
    },
    post: {
      notFound: "Post Not Found",
      backToAll: "Back to all articles",
      upNext: "Up Next",
    },
    reader: {
      textSize: "Text size",
      textSizeAria: "Adjust article font size",
      sizes: { sm: "S", md: "M", lg: "L" },
      share: "Share",
      linkCopied: "Link copied",
      enjoyedTitle: "Enjoyed this note?",
      enjoyedSubtitle: "Leave a clap or share it with a friend.",
      appreciate: "Appreciate",
      applaudAria: "Applaud this article",
      scrollTopAria: "Scroll back to top",
    },
    footer: {
      tagline: "Field Notes • Thoughts on building and writing.",
    },
    db: {
      checking: "Checking DB...",
      connected: "DB Connected",
      disconnected: "DB Disconnected",
      retestAria: "Re-test database connection",
      engine: "Engine",
      database: "Database",
      latency: "Latency",
      connectionError: "Connection Error",
    },
    login: {
      title: "Publisher Access",
      description:
        "Enter your publisher password to write, publish, and manage articles stored in PostgreSQL.",
      passwordLabel: "Publisher Password",
      verifying: "Verifying...",
      unlock: "Unlock Studio",
      networkError: "Network error while signing in.",
    },
    dashboard: {
      sessionBadge: "Authenticated Publisher Session",
      title: "Publisher Studio",
      signOut: "Sign out",
      viewLivePost: "View live post",
      newArticle: "New Article",
      writeTab: "Write",
      previewTab: "Preview",
      titleLabel: "Title",
      titlePlaceholder: "Deploying PostgreSQL on Coolify",
      tagLabel: "Topic Tag",
      customTagPlaceholder: "Custom tag",
      excerptLabel: "Excerpt",
      excerptPlaceholder:
        "A short summary shown on the home feed and SEO metadata...",
      bodyLabel: "Article Body",
      bodyHint: "(separate paragraphs with a blank line)",
      bodyPlaceholder:
        "Write your first paragraph here...\n\nPress Enter twice to start a new paragraph.",
      saving: "Saving to PostgreSQL...",
      publish: "Publish Article",
      untitled: "Untitled Article",
      previewExcerptEmpty: "Your article excerpt will appear here.",
      previewBodyEmpty: "Nothing written yet.",
      dbArticles: "Database Articles",
      delete: "Delete",
      deleting: "Deleting...",
      publishedSuccess: "Published directly to PostgreSQL!",
      deletedSuccess: "Article deleted from PostgreSQL.",
      publishNetworkError: "Network error while saving to PostgreSQL.",
      deleteNetworkError: "Network error while deleting post.",
    },
  },
  fa: {
    siteTitle: "یادداشت‌های میدانی — وبلاگ شخصی",
    siteDescription: "جستارهایی درباره طراحی، مهندسی نرم‌افزار و تفکر شفاف.",
    brandName: "یادداشت‌های میدانی",
    nav: {
      articles: "مقالات",
      write: "نوشتن",
      switchLanguageLabel: "تغییر زبان به انگلیسی",
      switchButtonText: "EN",
    },
    home: {
      heading: "نوشته‌ها و یادداشت‌های میدانی",
      subheading:
        "جستارهای کوتاه درباره هنر نرم‌افزار، طراحی رابط کاربری و تجربه‌های آموخته‌شده در مسیر.",
    },
    feed: {
      allTag: "همه",
      searchPlaceholder: "جستجوی مقالات...",
      searchAria: "جستجوی مقالات",
      filterAria: "فیلتر مقالات بر اساس موضوع",
      emptyTitle: "مقاله‌ای مطابق جستجوی شما پیدا نشد",
      emptyDescription: "عبارت جستجو را پاک کنید یا موضوع دیگری را انتخاب نمایید.",
      resetFilters: "بازنشانی فیلترها",
      readArticle: "مطالعه مقاله",
    },
    post: {
      notFound: "مقاله پیدا نشد",
      backToAll: "بازگشت به همه مقالات",
      upNext: "مقاله بعدی",
    },
    reader: {
      textSize: "اندازه متن",
      textSizeAria: "تنظیم اندازه فونت مقاله",
      sizes: { sm: "کوچک", md: "متوسط", lg: "بزرگ" },
      share: "اشتراک‌گذاری",
      linkCopied: "لینک کپی شد",
      enjoyedTitle: "از این یادداشت لذت بردید؟",
      enjoyedSubtitle: "با ثبت پسند حمایت کنید یا آن را با دوستانتان به اشتراک بگذارید.",
      appreciate: "پسندیدن",
      applaudAria: "پسندیدن این مقاله",
      scrollTopAria: "بازگشت به بالای صفحه",
    },
    footer: {
      tagline: "یادداشت‌های میدانی • نوشته‌هایی درباره ساختن و نوشتن.",
    },
    db: {
      checking: "بررسی پایگاه داده...",
      connected: "پایگاه داده متصل است",
      disconnected: "پایگاه داده قطع است",
      retestAria: "بررسی مجدد اتصال پایگاه داده",
      engine: "موتور",
      database: "پایگاه داده",
      latency: "تأخیر",
      connectionError: "خطای اتصال",
    },
    login: {
      title: "ورود نویسنده",
      description:
        "برای نوشتن، انتشار و مدیریت مقالات ذخیره‌شده در PostgreSQL رمز عبور خود را وارد کنید.",
      passwordLabel: "رمز عبور ناشر",
      verifying: "در حال بررسی...",
      unlock: "ورود به استودیو",
      networkError: "خطای شبکه هنگام ورود به سیستم.",
    },
    dashboard: {
      sessionBadge: "نشست تاییدشده نویسنده",
      title: "استودیو انتشار",
      signOut: "خروج",
      viewLivePost: "مشاهده مقاله",
      newArticle: "مقاله جدید",
      writeTab: "نوشتن",
      previewTab: "پیش‌نمایش",
      titleLabel: "عنوان",
      titlePlaceholder: "راه‌اندازی PostgreSQL روی سرور",
      tagLabel: "برچسب موضوعی",
      customTagPlaceholder: "برچسب دلخواه",
      excerptLabel: "چکیده",
      excerptPlaceholder:
        "خلاصه‌ای کوتاه که در صفحه اصلی و متادیتای سئو نمایش داده می‌شود...",
      bodyLabel: "متن مقاله",
      bodyHint: "(پاراگراف‌ها را با یک خط خالی جدا کنید)",
      bodyPlaceholder:
        "پاراگراف اول خود را اینجا بنویسید...\n\nبرای شروع پاراگراف جدید دو بار Enter بزنید.",
      saving: "در حال ذخیره در PostgreSQL...",
      publish: "انتشار مقاله",
      untitled: "مقاله بدون عنوان",
      previewExcerptEmpty: "چکیده مقاله شما در اینجا نمایش داده می‌شود.",
      previewBodyEmpty: "هنوز متنی نوشته نشده است.",
      dbArticles: "مقالات پایگاه داده",
      delete: "حذف",
      deleting: "در حال حذف...",
      publishedSuccess: "مقاله مستقیماً در PostgreSQL منتشر شد!",
      deletedSuccess: "مقاله از PostgreSQL حذف شد.",
      publishNetworkError: "خطای شبکه هنگام ذخیره در PostgreSQL.",
      deleteNetworkError: "خطای شبکه هنگام حذف مقاله.",
    },
  },
} as const;

export type Dictionary = (typeof dictionaries)[Locale];