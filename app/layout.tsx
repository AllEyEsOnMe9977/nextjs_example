import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "../components/Navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Field Notes — Personal Blog",
  description: "Essays on design, software engineering, and clear thinking.",
};

const themeInitScript = `
  (function() {
    try {
      var saved = localStorage.getItem('theme');
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (saved === 'dark' || (!saved && prefersDark)) {
        document.documentElement.classList.add('dark');
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer
          id="about"
          className="border-t border-zinc-200/80 py-10 text-sm text-zinc-500 transition-colors duration-300 dark:border-zinc-800/80 dark:text-zinc-400"
        >
          <div className="mx-auto flex max-w-2xl flex-col justify-between gap-2 px-6 sm:flex-row">
            <p>Field Notes — Thoughts on building and writing.</p>
            <p>© {new Date().getFullYear()}</p>
          </div>
        </footer>
      </body>
    </html>
  );
}