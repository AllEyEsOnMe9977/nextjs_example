import type { Metadata } from "next";
import { Geist, Geist_Mono, Vazirmatn } from "next/font/google";
import { cookies } from "next/headers";
import { DbStatusBadge } from "../components/DbStatusBadge";
import { LanguageProvider } from "../components/LanguageProvider";
import { Navbar } from "../components/Navbar";
import {
  dictionaries,
  formatNumber,
  getDirection,
  isValidLocale,
  LOCALE_COOKIE_NAME,
  type Locale,
} from "../lib/i18n";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(LOCALE_COOKIE_NAME)?.value;
  const locale: Locale = isValidLocale(raw) ? raw : "en";
  const t = dictionaries[locale];

  return {
    title: t.siteTitle,
    description: t.siteDescription,
  };
}

const initScript = `
  (function() {
    try {
      var saved = localStorage.getItem('theme');
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (saved === 'dark' || (!saved && prefersDark)) {
        document.documentElement.classList.add('dark');
      }
      var savedLocale = localStorage.getItem('${LOCALE_COOKIE_NAME}');
      if (savedLocale === 'fa' || savedLocale === 'en') {
        document.documentElement.lang = savedLocale;
        document.documentElement.dir = savedLocale === 'fa' ? 'rtl' : 'ltr';
      }
    } catch (e) {}
  })();
`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const rawLocale = cookieStore.get(LOCALE_COOKIE_NAME)?.value;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : "en";
  const dir = getDirection(locale);
  const t = dictionaries[locale];

  return (
    <html
      lang={locale}
      dir={dir}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${vazirmatn.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: initScript }} />
      </head>
      <body className="flex min-h-full flex-col bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <LanguageProvider initialLocale={locale}>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer
            id="about"
            className="border-t border-zinc-200/80 py-10 text-sm text-zinc-500 transition-colors duration-300 dark:border-zinc-800/80 dark:text-zinc-400"
          >
            <div className="mx-auto flex max-w-2xl flex-col justify-between gap-4 px-6 sm:flex-row sm:items-center">
              <div>
                <p>{t.footer.tagline}</p>
                <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">
                  &copy; {formatNumber(new Date().getFullYear(), locale)}
                </p>
              </div>
              <DbStatusBadge />
            </div>
          </footer>
        </LanguageProvider>
      </body>
    </html>
  );
}