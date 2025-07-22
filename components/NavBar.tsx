// components/NavBar.tsx
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import styles from "../styles/NavBar.module.css";
import { useState } from "react";

export default function NavBar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className={styles.header}>
      <div className={styles.logoRow}>
        <button className={styles.hamburger} onClick={() => setMenuOpen(true)}>
          <span className={styles.hamburgerIcon} />
          <span className={styles.hamburgerIcon} />
          <span className={styles.hamburgerIcon} />
        </button>
        <div className={styles.logoWrapper}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoMain}>Textories</span>
            <span className={styles.logoSub}>〈 A note that only lasts for one hour 〉</span>
          </Link>
        </div>
      </div>
      <div className={styles.navRow}>
        <nav className={styles.nav}>
          <div className={styles.desktopNav}>
            <Link href="/">
              <button className={styles.listButton}>投稿一覧</button>
            </Link>
            <Link href="/new">
              <button className={styles.newPostButton}>新規投稿</button>
            </Link>
            <Link href="/profile">
              <button className={styles.profileButton}>プロフィール設定</button>
            </Link>
            <Link href="/about">
              <button className={styles.aboutButton}>サービス概要</button>
            </Link>
          </div>
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
      </div>
      {menuOpen && (
        <>
          <div className={styles.drawerOverlay} onClick={() => setMenuOpen(false)} />
          <div className={styles.drawerMenu}>
            <button className={styles.drawerClose} onClick={() => setMenuOpen(false)}>&times;</button>
            <Link href="/" onClick={() => setMenuOpen(false)}>
              <button className={styles.listButton}>投稿一覧</button>
            </Link>
            <Link href="/new" onClick={() => setMenuOpen(false)}>
              <button className={styles.newPostButton}>新規投稿</button>
            </Link>
            <Link href="/profile" onClick={() => setMenuOpen(false)}>
              <button className={styles.profileButton}>プロフィール設定</button>
            </Link>
            <Link href="/about" onClick={() => setMenuOpen(false)}>
              <button className={styles.aboutButton}>サービス概要</button>
            </Link>
            <div className={styles.userAreaMobile}>
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
          </div>
        </>
      )}
    </header>
  );
}
