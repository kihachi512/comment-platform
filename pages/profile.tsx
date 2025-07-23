import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import styles from "../styles/Profile.module.css";
import Link from "next/link";

export default function ProfilePage({ toggleTheme, theme }: { toggleTheme: () => void; theme: string }) {
  const { data: session, status, update } = useSession();
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const [recentPosts, setRecentPosts] = useState<{ 
    postId: string; 
    body: string; 
    commentCount: number; 
    createdAt: string;
    authorId: string;
    authorName?: string;
  }[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  useEffect(() => {
    if (session?.user?.email) {
      fetch(`/api/profile?email=${session.user.email}`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.username) setUsername(data.username);
          if (data?.userId) {
            setUserId(data.userId);
            // ユーザーIDが取得できたら過去24時間の投稿を取得
            fetchRecentPosts(data.userId);
          }
        })
        .catch((error) => {
          console.error("プロフィール情報の取得に失敗しました:", error);
        });
    }
  }, [session]);

  const fetchRecentPosts = async (userIdToFetch: string) => {
    if (!userIdToFetch) return;
    
    setPostsLoading(true);
    try {
      const response = await fetch(`/api/my-posts?userId=${userIdToFetch}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const posts = await response.json();
      setRecentPosts(Array.isArray(posts) ? posts : []);
    } catch (error) {
      console.error("過去24時間の投稿取得に失敗しました:", error);
      setRecentPosts([]);
    } finally {
      setPostsLoading(false);
    }
  };

  const saveUsername = async () => {
    setError("");
    if (username.length > 8) {
      setError("ユーザー名は8文字以内です");
      setShowError(true);
      setTimeout(() => setShowError(false), 1800);
      return;
    }

    try {
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
    } catch (error) {
      console.error("ユーザー名保存エラー:", error);
      setError("ネットワークエラーが発生しました。");
      setShowError(true);
      setTimeout(() => setShowError(false), 1800);
    }
  };



  // セッションのロード中は何も表示しない（SSRとの整合性を保つため）
  if (status === "loading") {
    return (
      <div className={styles.container}>
        <div className={styles.cardWrapper}>
          <h1 className={styles.heading}>💻マイページ</h1>
          <div className={styles.loading}>読み込み中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {showSuccess && (
        <div className={styles.successPopup}>
          <span style={{ fontSize: 22, flexShrink: 0 }}>✅</span> ユーザー名を更新しました！
        </div>
      )}
      <div className={styles.cardWrapper}>
        <h1 className={styles.heading}>💻マイページ</h1>
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

        {/* 過去24時間の投稿セクション */}
        {session && (
          <div className={styles.recentPostsSection}>
            <h2 className={styles.sectionHeading}>📝 過去24時間の投稿</h2>
            <p className={styles.sectionDescription}>
              ※ あなたの投稿履歴は期限切れ後も表示されます
            </p>
            {postsLoading ? (
              <div className={styles.loading}>投稿を読み込み中...</div>
            ) : recentPosts.length > 0 ? (
              <div className={styles.postsList}>
                {recentPosts.map((post) => (
                  <Link key={post.postId} href={`/post/${post.postId}`} legacyBehavior>
                    <div className={styles.postCard} tabIndex={0} role="button">
                      <div className={styles.postContent}>
                        <span className={styles.postBody}>{post.body}</span>
                        <div className={styles.postMeta}>
                          <span className={styles.commentCount}>💬 {post.commentCount}</span>
                          <span className={styles.postDate}>
                            {new Date(post.createdAt).toLocaleString("ja-JP", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className={styles.noPosts}>
                過去24時間に投稿はありません
              </div>
            )}
          </div>
        )}
      </div>


    </div>
  );
}
