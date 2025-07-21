// components/NavBar.tsx
import Link from "next/link";
import styles from "../styles/NavBar.module.css";

export default function NavBar() {
  return (
    <header className={styles.header}>
      <div className={styles.logoWrapper}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoMain}>Textories</span>
          <span className={styles.logoSub}>〈 A note that only lasts for one hour 〉</span>
        </Link>
      </div>
      <nav className={styles.nav}>
        <Link href="/new">
          <button className={styles.newPostButton}>新規投稿</button>
        </Link>
        <Link href="/profile">
          <button className={styles.profileButton}>プロフィール設定</button>
        </Link>
        <Link href="/about">
          <button className={styles.aboutButton}>サービス概要</button>
        </Link>
      </nav>
    </header>
  );
}
