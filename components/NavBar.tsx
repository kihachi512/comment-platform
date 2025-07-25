// components/NavBar.tsx
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import styles from "../styles/NavBar.module.css";
import { MdHome, MdAddBox, MdPerson, MdInfo } from "react-icons/md";

export default function NavBar() {
  const { data: session } = useSession();
  return (
    <header className={styles.header}>
      <div className={styles.logoRow}>
        <div className={styles.logoWrapper}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoMain}>Textories</span>
            <span className={styles.logoSub}>〈 A note that only lasts for one hour 〉</span>
          </Link>
        </div>
        {/* スマホ表示時のユーザー名をロゴの下に配置 */}
        {session && (
          <div className={styles.mobileUserName}>
            <span className={styles.userName}>{session.user?.username || session.user?.name || "ユーザー"}</span>
            {session.user?.userId && (
              <span className={styles.userId}>#{session.user.userId}</span>
            )}
          </div>
        )}
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
              <button className={styles.profileButton}>マイページ</button>
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
      {/* --- ボトムナビ（スマホのみ表示） --- */}
      <div className={styles.bottomNavWrapper}>
        <nav className={styles.bottomNav}>
          <Link href="/" className={styles.bottomNavItem}>
            <MdHome size={26} />
            <span>一覧</span>
          </Link>
          <Link href="/new" className={styles.bottomNavItem}>
            <MdAddBox size={26} />
            <span>新規</span>
          </Link>
          <Link href="/profile" className={styles.bottomNavItem}>
            <MdPerson size={26} />
            <span>マイページ</span>
          </Link>
          <Link href="/about" className={styles.bottomNavItem}>
            <MdInfo size={26} />
            <span>概要</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
