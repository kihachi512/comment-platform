import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../../styles/PostDetail.module.css";

export default function PostDetail() {
  const router = useRouter();
  const { postId } = router.query;

  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [form, setForm] = useState({ content: "", type: "praise" });
  const [authorProfile, setAuthorProfile] = useState<{ username: string; userId: string } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!postId) return;

    fetch(`/api/post/${postId}`)
      .then((res) => res.json())
      .then((data) => {
        setPost(data);
        if (data?.authorId) {
          fetch(`/api/profile?userId=${data.authorId}`)
            .then((res) => res.json())
            .then((profile) => {
              setAuthorProfile({
                username: profile.username || "匿名ユーザー",
                userId: profile.userId || "",
              });
            });
        }
      });

    fetch(`/api/comments?postId=${postId}`)
      .then((res) => res.json())
      .then((comments) => {
        const enriched = comments
          .map((c: any) => ({
            ...c,
            formattedDate: new Date(c.createdAt).toLocaleString("ja-JP", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            }),
          }))
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setComments(enriched);
      });
  }, [postId]);

  const submitComment = async () => {
    setError("");

    if (form.content.length > 30) {
      setError("コメントは30文字以内で入力してください。");
      return;
    }

    await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, postId }),
    });
    setForm({ content: "", type: "praise" });

    const res = await fetch(`/api/comments?postId=${postId}`);
    const freshComments = await res.json();

    const enriched = freshComments
      .map((c: any) => ({
        ...c,
        formattedDate: new Date(c.createdAt).toLocaleString("ja-JP", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }),
      }))
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setComments(enriched);
  };

  if (!post) return <div className={styles.loading}>読み込み中...</div>;

  const formattedPostDate = new Date(post.createdAt).toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={styles.container}>

      <div className={styles.header}>
        <h1 className={styles.pageTitle}>📝投稿詳細</h1>
      </div>

      <section className={styles.postCard}>
        <h1 className={styles.postBody}>{post.body}</h1>
        {authorProfile && (
          <p className={styles.author}>投稿者: {authorProfile.username} <span className={styles.userId}>#{authorProfile.userId}</span></p>
        )}
        <p className={styles.date}>投稿日時: {formattedPostDate}</p>
      </section>

      <section className={styles.commentSection}>
        <h3 className={styles.commentTitle}>✅ コメント一覧</h3>
        {comments.length === 0 ? (
          <p className={styles.noComments}>まだコメントがありません。</p>
        ) : (
          <div className={styles.commentList}>
            {comments.map((c) => (
              <div key={c.commentId} className={styles.commentBox}>
                <p className={styles.commentDate}>日時: {c.formattedDate}</p>
                <p className={styles.commentContent}>{c.content}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className={styles.commentForm}>
        <h3 className={styles.commentTitle}>💬 コメントする</h3>

        <div className={styles.textareaWrapper}>
          <textarea
            className={styles.textarea}
            rows={4}
            maxLength={30}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />
          <p className={styles.charCount}>{form.content.length}/30文字</p>
          {error && <p className={styles.error}>{error}</p>}
        </div>

        <button
          className={styles.submitButton}
          onClick={submitComment}
          disabled={form.content.length > 30}
        >
          送信
        </button>
      </section>
    </div>
  );
}
