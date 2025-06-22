import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import styles from "../styles/Profile.module.css";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");

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
    const res = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: session?.user?.email, username }),
    });

    if (res.ok) {
      setMessage("ユーザー名を更新しました！");
    } else {
      setMessage("更新に失敗しました。");
    }
  };

  if (!session) {
    return <div className={styles.message}>ログインが必要です。</div>;
  }

  return (
    <div className={styles.container}>
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
        {message && <p className={styles.success}>{message}</p>}
      </div>
    </div>
  );
}
