import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import styles from "../styles/Home.module.css"; // CSSモジュール読み込み

export default function Home() {
  const [posts, setPosts] = useState<{ postId: string; body: string }[]>([]);
  const { data: session } = useSession();
  const [username, setUsername] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setPosts(sorted);
      });
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (!session?.user?.email) return;

      const res = await fetch(`/api/profile?email=${session.user.email}`);
      const data = await res.json();

      const fallbackName = session.user.name || "ユーザー";
      setUsername(data?.username || fallbackName);
      setUserId(data?.userId || "");
    };

    fetchUser();
  }, [session]);

  return (
    <div className={styles.container}>
      {/* ヘッダー */}
      <div className={styles.header}>
        <h1 className={styles.title}>Textories〈 A note that only lasts for one hour 〉</h1>
        {!session ? (
          <button className={styles.loginButton} onClick={() => signIn("google")}> 
            Googleでログイン
          </button>
        ) : (
          <div className={styles.userInfo}>
            <div>
              {username} さん{" "}
              {userId && <span className={styles.userId}>#{userId}</span>}
            </div>
            <button className={styles.logoutButton} onClick={() => signOut()}>
              ログアウト
            </button>
          </div>
        )}
      </div>

      {/* 操作ボタン */}
      {session && (
        <div className={styles.actions}>
          <Link href="/new">
            <button className={styles.newPostButton}>新規投稿</button>
          </Link>
          <Link href="/profile">
            <button className={styles.profileButton}>プロフィール設定</button>
          </Link>
        </div>
      )}

      <hr className={styles.divider} />

      {/* 投稿一覧 */}
      <div className={styles.postList}>
        {posts.map((post) => (
          <Link key={post.postId} href={`/post/${post.postId}`} legacyBehavior>
            <div className={styles.postCard} tabIndex={0} role="button">
              <span className={styles.postBody}>{post.body}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
