import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function PostDetail() {
  const router = useRouter();
  const { postId } = router.query;

  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [form, setForm] = useState({ content: "", type: "praise" });

  useEffect(() => {
    if (!postId) return;
    fetch(`/api/post/${postId}`).then((res) => res.json()).then(setPost);
    fetch(`/api/comments?postId=${postId}`).then((res) => res.json()).then(setComments);
  }, [postId]);

  const submitComment = async () => {
    await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, postId }),
    });
    setForm({ content: "", type: "praise" });
    const res = await fetch(`/api/comments?postId=${postId}`);
    setComments(await res.json());
  };

  if (!post) return <div className="p-4">読み込み中...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-10">
      <Link href="/" className="text-blue-600 underline inline-block">
        ← 投稿一覧
      </Link>

      {/* 記事本文 */}
      <section className="bg-white border rounded p-6 shadow-sm">
        <h1 className="text-2xl font-bold mb-3">📝 記事本文</h1>
        <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
        <p className="text-gray-800 whitespace-pre-wrap">{post.body}</p>
      </section>

      {/* 区切り線 */}
      <hr className="my-8 border-gray-300" />

      {/* 承認済みコメント一覧 */}
      <section>
        <h3 className="text-xl font-bold mb-4">✅ 承認されたコメント</h3>
        {comments.length === 0 ? (
          <p className="text-gray-500">まだコメントがありません。</p>
        ) : (
          comments.map((c) => (
            <div key={c.commentId} className="border rounded p-3 mb-3 bg-white shadow-sm">
              <p className="text-sm text-gray-600 mb-1">タイプ: {c.type}</p>
              <p>{c.content}</p>
            </div>
          ))
        )}
      </section>

      {/* 区切り線（任意） */}
      <hr className="my-8 border-gray-200" />

      {/* コメントフォーム */}
      <section className="bg-gray-50 border rounded p-6 shadow-sm">
        <h3 className="text-xl font-bold mb-4">💬 コメントを書く</h3>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">コメントの種類</label>
          <select
            className="border p-2 w-full rounded"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="praise">いいね！</option>
            <option value="feeling">感想</option>
            <option value="suggestion">提案</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">コメント内容</label>
          <textarea
            className="border p-3 w-full rounded"
            rows={6}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            placeholder="あなたの感想を自由に記入してください"
          />
        </div>

        <button
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
          onClick={submitComment}
        >
          コメント送信
        </button>
      </section>
    </div>
  );
}
