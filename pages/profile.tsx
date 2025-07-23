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
  useEffect(() => {
    if (session?.user?.email) {
      fetch(`/api/profile?email=${session.user.email}`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.username) setUsername(data.username);
          if (data?.userId) setUserId(data.userId);
        })
        .catch((error) => {
          console.error("プロフィール情報の取得に失敗しました:", error);
        });
    }
  }, [session]);

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
      </div>


    </div>
  );
}
