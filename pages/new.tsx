import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import styles from "../styles/NewPost.module.css";

export default function NewPostPage() {
  const [form, setForm] = useState({ body: "" });
  const { data: session, status } = useSession();
  const router = useRouter();
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const submit = async () => {
    setError("");

    if (!session?.user?.userId) {
      alert("投稿にはログインが必要です。");
      return;
    }

    if (form.body.length > 50) {
      setError("本文は50文字以内で入力してください。");
      setShowError(true);
      setTimeout(() => setShowError(false), 1800);
      return;
    }

    const res = await fetch("/api/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postId: uuidv4(),
        body: form.body,
        authorId: session.user.userId,
        authorName: session.user.username,
      }),
    });

    if (res.ok) {
      setForm({ body: "" });
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        router.push("/");
      }, 1800);
    } else {
      const data = await res.json();
      setError(data?.error || "投稿に失敗しました。");
      setShowError(true);
      setTimeout(() => setShowError(false), 1800);
    }
  };

  if (status === "loading") {
    return <div className={styles.loading}>ログイン状態を確認中...</div>;
  }

  return (
    <div className={styles.container}>
      {showSuccess && (
        <div className={styles.successPopup}>
          <span style={{ fontSize: 22, flexShrink: 0 }}>✅</span> 投稿が作成されました！
        </div>
      )}
      {showError && (
        <div className={styles.errorPopup}>
          <span style={{ fontSize: 22, flexShrink: 0 }}>❌</span> {error}
        </div>
      )}
      <div className={styles.cardWrapper}>
        <h1 className={styles.title}>🆕 新規投稿</h1>
        <textarea
          className={styles.textarea}
          rows={4}
          placeholder="本文"
          value={form.body}
          onChange={(e) => setForm({ ...form, body: e.target.value })}
          maxLength={50}
        />
        <p className={form.body.length === 50 ? styles.charCountLimit : styles.charCount}>
          {form.body.length}/50文字
        </p>
        <button
          className={styles.submitButton}
          onClick={submit}
          disabled={form.body.length > 50}
        >
          投稿する
        </button>
      </div>
    </div>
  );
}