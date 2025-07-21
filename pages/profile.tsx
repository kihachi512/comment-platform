import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import styles from "../styles/Profile.module.css";

export default function ProfilePage() {
  const { data: session, update } = useSession();
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
        });
    }
  }, [session]);

  const saveUsername = async () => {
    setError("");
    const res = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: session?.user?.email, username }),
    });

    if (res.ok) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1800);
      // セッション情報を更新
      await update({ ...session, user: { ...session?.user, username } });
    } else {
      setError("更新に失敗しました。");
      setShowError(true);
      setTimeout(() => setShowError(false), 1800);
    }
  };

  if (!session) {
    return <div className={styles.message}>ログインが必要です。</div>;
  }

  return (
    <div className={styles.container}>
      {showSuccess && (
        <div className={styles.successPopup}>
          <span style={{ fontSize: 22, flexShrink: 0 }}>✅</span> ユーザー名を更新しました！
        </div>
      )}
      <div className={styles.cardWrapper}>
        <h1 className={styles.heading}>💋プロフィール</h1>
        <div className={styles.formGroup}>
          <label className={styles.label}>ユーザー名：</label>
          <input
            className={styles.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="ももんが"
          />
          <p className={styles.userId}>ユーザーID：<span className={styles.mono}>#{userId}</span></p>
          <button className={styles.button} onClick={saveUsername}>保存</button>
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
