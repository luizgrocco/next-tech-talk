import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <Link href="/todos">Client Side Rendering (CSR)</Link>
      <Link href="/real-time-leaderboard">Sever Side Rendering (SSR)</Link>
      <Link href="/snapshot-leaderboard">Static Site Generation (SSG)</Link>
      <Link href="/30-second-leaderboard">
        Static Site Generation - Time based revalidation (SSG/ISR)
      </Link>
      <Link href="/event-based-leaderboard">
        Static Site Generation - Event based revalidation (SSR/ISR)
      </Link>
    </main>
  );
}
