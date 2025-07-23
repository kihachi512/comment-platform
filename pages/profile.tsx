import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import styles from "../styles/Profile.module.css";
import Link from "next/link";

export default function ProfilePage({ toggleTheme, theme }: { toggleTheme: () => void; theme: string }) {
  const { data: session, update } = useSession();
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const [myPosts, setMyPosts] = useState<any[]>([]);

  useEffect(() => {
    if (session?.user?.email) {
      fetch(`/api/profile?email=${session.user.email}`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.username) setUsername(data.username);
          if (data?.userId) setUserId(data.userId);
        });
    }
  }, [session]);

  // 自分の投稿（過去24時間分のみ）を取得
  useEffect(() => {
    if (!userId) return;
    fetch("/api/posts?all=1")
      .then((res) => res.json())
      .then((data) => {
        const now = Date.now();
        const oneDayAgo = now - 24 * 60 * 60 * 1000;
        const filtered = data.filter((post: any) =>
          post.authorId === userId &&
          new Date(post.createdAt).getTime() >= oneDayAgo
        );
        // 新しい順にソート
        filtered.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setMyPosts(filtered);
      });
  }, [userId]);

  const saveUsername = async () => {
    setError("");
    if (username.length > 8) {
      setError("ユーザー名は8文字以内です");
      setShowError(true);
      setTimeout(() => setShowError(false), 1800);
      return;
    }

    const res = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: session?.user?.email, username }),
    });

    if (res.ok) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1800);
      // セッション情報を更新
      await update();
    } else {
      setError("更新に失敗しました。");
      setShowError(true);
      setTimeout(() => setShowError(false), 1800);
    }
  };

  return (
    <div className={styles.container}>
      {showSuccess && (
        <div className={styles.successPopup}>
          <span style={{ fontSize: 22, flexShrink: 0 }}>✅</span> ユーザー名を更新しました！
        </div>
      )}
      <div className={styles.cardWrapper}>
        <h1 className={styles.heading}>🧑‍💻マイページ</h1>
        <div className={styles.formGroup}>
          {session ? (
            <>
              <label className={styles.label}>ユーザー名：</label>
              <input
                className={styles.input}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ももんが"
                maxLength={8}
              />
              <p className={username.length >= 8 ? styles.charCountLimit : styles.charCount}>
                {username.length}/8文字
              </p>
              <p className={styles.userId}>ユーザーID：<span className={styles.mono}>#{userId}</span></p>
              <button className={styles.button} onClick={saveUsername} disabled={username.length > 8}>保存</button>
              <div className={styles.myPostsSection}>
                <h2 className={styles.myPostsHeading}>あなたの投稿（過去24時間分）</h2>
                {myPosts.length === 0 ? (
                  <p className={styles.noPostsMsg}>過去24時間以内の投稿はありません。</p>
                ) : (
                  <div className={styles.myPostsList}>
                    {myPosts.map((post) => (
                      <Link key={post.postId} href={`/post/${post.postId}`} legacyBehavior>
                        <div className={styles.myPostCard} tabIndex={0} role="button">
                          <span className={styles.myPostBody}>{post.body}</span>
                          <span className={styles.myPostDate}>{new Date(post.createdAt).toLocaleString()}</span>
                          <span className={styles.myPostCommentCount}>💬 {post.commentCount}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <p className={styles.notLoggedInMsg}>ログインするとユーザー名を設定できます。</p>
          )}
          <div className={styles.themeToggleWrapper}>
            <span className={styles.themeLabel}>テーマ切り替え:</span>
            <button onClick={toggleTheme} className={styles.themeToggleButton}>
              {theme === 'light' ? '🌙 ダーク' : '☀️ ライト'}
            </button>
          </div>
          {showError && (
            <div className={styles.errorPopup}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>❌</span> {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
