import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";

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

    // 投稿とコメント取得
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
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setComments(enriched);
  };

  if (!post) return <div className="p-4">読み込み中...</div>;

  const formattedPostDate = new Date(post.createdAt).toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-10">
      <Link href="/" className="text-blue-600 underline inline-block">← 投稿一覧</Link>

      {/* 投稿本文 */}
      <section className="bg-white border rounded p-6 shadow-sm">
        <h1 className="text-2xl font-bold mb-3">📝 {post.body}</h1>

        {authorProfile && (
          <p className="text-sm text-gray-600 mb-2">
            投稿者: {authorProfile.username} <span className="text-gray-400">#{authorProfile.userId}</span>
          </p>
        )}
        <p className="text-sm text-gray-500 mb-4">投稿日時: {formattedPostDate}</p>
      </section>

      <hr className="my-8 border-gray-300" />

      {/* コメント一覧 */}
      <section>
        <h3 className="text-xl font-bold mb-4">✅ コメント一覧</h3>
        {comments.length === 0 ? (
          <p className="text-gray-500">まだコメントがありません。</p>
        ) : (
          comments.map((c) => (
            <div key={c.commentId} className="border rounded p-3 mb-3 bg-white shadow-sm">
              <p className="text-sm text-gray-600 mb-1">日時: {c.formattedDate}</p>
              <p>{c.content}</p>
            </div>
          ))
        )}
      </section>

      <hr className="my-8 border-gray-200" />

      {/* コメントフォーム */}
      <section className="bg-gray-50 border rounded p-6 shadow-sm">
        <h3 className="text-xl font-bold mb-4">💬 コメントを書く</h3>

        <div className="mb-4">
          <textarea
            className="border p-3 w-full rounded"
            rows={4}
            maxLength={30}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            placeholder="30文字以内で入力してください"
          />
          <p className="text-sm text-gray-500">{form.content.length}/30文字</p>
          {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
        </div>

        <button
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          onClick={submitComment}
          disabled={form.content.length > 30}
        >
          コメント送信
        </button>
      </section>
    </div>
  );
}
