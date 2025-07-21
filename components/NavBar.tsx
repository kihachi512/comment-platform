// components/NavBar.tsx
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import styles from "../styles/NavBar.module.css";

export default function NavBar({ toggleTheme, theme }: { toggleTheme: () => void; theme: string }) {
  const { data: session } = useSession();
  return (
    <header className={styles.header}>
      <div className={styles.themeToggleWrapper}>
        <button onClick={toggleTheme} className={styles.themeToggleButton}>
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </div>
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
      <div className={styles.userArea}>
        {session ? (
          <>
            <span className={styles.userName}>{session.user?.username || session.user?.name || "ユーザー"}</span>
            {session.user?.userId && (
              <span className={styles.userId}>#{session.user.userId}</span>
            )}
            <button className={styles.logoutButton} onClick={() => signOut()}>ログアウト</button>
          </>
        ) : (
          <button className={styles.loginButton} onClick={() => signIn("google")}>Googleでログイン</button>
        )}
      </div>
    </header>
  );
}
