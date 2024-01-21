import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import styles from "./app.module.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TagDO",
  description: "Todo App for Tagview's Tech Talk presentation",
};

const Header = () => (
  <nav className={styles.navbar}>
    <div className={styles.homeItem}>
      <Link href="/todos">todos</Link>
    </div>
    <div className={styles.navItems}>
      <Link className={styles.link} href="/leaderboard/csr">
        <span>Client Side Rendering (CSR)</span>
      </Link>
      <Link className={styles.link} href="/leaderboard/ssr">
        <span>Sever Side Rendering (SSR)</span>
      </Link>
      <Link className={styles.link} href="/leaderboard/ssg">
        <span>Static Site Generation (SSG)</span>
      </Link>
      <Link
        className={styles.link}
        href="/leaderboard/ssg-time-based-revalidation"
      >
        <span>Static Site Generation (SSG/ISR)</span>
        <span>Time based revalidation</span>
      </Link>
      <Link
        className={styles.link}
        href="/leaderboard/ssg-event-based-revalidation"
      >
        <span>Static Site Generation (SSR/ISR)</span>
        <span>Event based revalidation</span>
      </Link>
    </div>
  </nav>
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {children}
      </body>
    </html>
  );
}
